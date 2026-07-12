import {
  addActivityLog,
  addNotification,
  create,
  detectBookingConflict,
  getAll,
  getById,
  KEYS,
  update,
} from "./storageService.js";
const today = () => new Date().toISOString().slice(0, 10);
const log = (user, action, entity, record, details) =>
  addActivityLog({
    actor: user.name,
    role: user.role,
    action,
    entity,
    entityId: record.id,
    details,
  });
export function registerAsset(data, user) {
  if (!["ADMIN", "ASSET_MANAGER"].includes(user.role))
    throw new Error("You cannot register assets.");
  if (
    getAll(KEYS.assets).some(
      (a) => a.tag.toLowerCase() === data.tag.toLowerCase(),
    )
  )
    throw new Error("Asset tag already exists.");
  if (
    getAll(KEYS.assets).some(
      (a) => a.serial.toLowerCase() === data.serial.toLowerCase(),
    )
  )
    throw new Error("Serial number already exists.");
  const asset = create(KEYS.assets, {
    ...data,
    status: "AVAILABLE",
    currentHolder: null,
    currentHolderId: null,
  });
  if (asset.type === "SHARED_RESOURCE")
    create(KEYS.resources, {
      id: asset.id,
      name: asset.name,
      assetTag: asset.tag,
      department: asset.department,
      location: asset.location,
      status: "ACTIVE",
    });
  log(user, "ASSET_REGISTERED", "ASSET", asset, `${asset.tag} · ${asset.name}`);
  addNotification({
    type: "Assets",
    title: "Asset registered",
    description: `${asset.name} was added to the directory.`,
    reference: asset.tag,
  });
  return asset;
}
export function allocateAsset({ assetId, holderId, expectedReturnDate }, user) {
  if (!["ADMIN", "ASSET_MANAGER"].includes(user.role))
    throw new Error("You cannot allocate assets directly.");
  const asset = getById(KEYS.assets, assetId),
    holder =
      getById(KEYS.users, holderId) ||
      getAll(KEYS.users).find((candidate) => candidate.name === holderId);
  if (!asset || !holder) throw new Error("Asset or holder not found.");
  if (asset.status !== "AVAILABLE")
    throw new Error(
      "Asset is already allocated. Submit a transfer request instead.",
    );
  const allocation = create(KEYS.allocations, {
    assetId,
    assetTag: asset.tag,
    holderId,
    holderName: holder.name,
    department: holder.department,
    allocationDate: today(),
    expectedReturnDate,
    status: "ACTIVE",
  });
  update(KEYS.assets, assetId, {
    status: "ALLOCATED",
    currentHolderId: holderId,
    currentHolder: holder.name,
  });
  log(
    user,
    "ASSET_ALLOCATED",
    "ALLOCATION",
    allocation,
    `${asset.tag} allocated to ${holder.name}`,
  );
  addNotification({
    userId: holderId,
    type: "Allocation",
    title: "Asset allocated to you",
    description: `${asset.name} has been allocated to you.`,
    reference: asset.tag,
  });
  return allocation;
}
export function requestTransfer(
  { assetId, newHolderId, reason, priority = "Normal" },
  user,
) {
  const asset = getById(KEYS.assets, assetId);
  if (!asset || asset.status !== "ALLOCATED")
    throw new Error("Only allocated assets can be transferred.");
  if (user.role === "EMPLOYEE" && asset.currentHolderId !== user.id)
    throw new Error("You can transfer only assets allocated to you.");
  if (
    getAll(KEYS.transfers).some(
      (t) => t.assetId === assetId && t.status === "PENDING",
    )
  )
    throw new Error("A pending transfer request already exists.");
  const holder =
    getById(KEYS.users, newHolderId) ||
    getAll(KEYS.users).find((candidate) => candidate.name === newHolderId);
  if (!holder || newHolderId === asset.currentHolderId)
    throw new Error("Select a different valid holder.");
  const request = create(KEYS.transfers, {
    assetId,
    assetTag: asset.tag,
    currentHolderId: asset.currentHolderId,
    currentHolder: asset.currentHolder,
    newHolderId: holder.id,
    newHolder: holder.name,
    department: asset.department,
    reason,
    priority,
    status: "PENDING",
    requestedBy: user.id,
  });
  log(
    user,
    "TRANSFER_REQUESTED",
    "TRANSFER",
    request,
    `${asset.tag}: ${asset.currentHolder} to ${holder.name}`,
  );
  addNotification({
    department: asset.department,
    type: "Transfers",
    title: "Transfer approval required",
    description: `${asset.name} transfer is awaiting approval.`,
    priority,
    reference: request.id,
  });
  return request;
}
export function decideTransfer(id, decision, user) {
  const request = getById(KEYS.transfers, id);
  if (!request || request.status !== "PENDING")
    throw new Error("Pending transfer request not found.");
  if (user.role === "DEPARTMENT_HEAD" && request.department !== user.department)
    throw new Error("This transfer belongs to another department.");
  if (!["ADMIN", "ASSET_MANAGER", "DEPARTMENT_HEAD"].includes(user.role))
    throw new Error("You cannot approve transfers.");
  const status = decision === "APPROVE" ? "APPROVED" : "REJECTED";
  update(KEYS.transfers, id, {
    status,
    decidedBy: user.id,
    decidedAt: new Date().toISOString(),
  });
  if (status === "APPROVED") {
    update(KEYS.assets, request.assetId, {
      currentHolderId: request.newHolderId,
      currentHolder: request.newHolder,
      status: "ALLOCATED",
    });
    const active = getAll(KEYS.allocations).find(
      (a) => a.assetId === request.assetId && a.status === "ACTIVE",
    );
    if (active)
      update(KEYS.allocations, active.id, {
        status: "TRANSFERRED",
        returnedDate: today(),
      });
    create(KEYS.allocations, {
      assetId: request.assetId,
      assetTag: request.assetTag,
      holderId: request.newHolderId,
      holderName: request.newHolder,
      department: request.department,
      allocationDate: today(),
      status: "ACTIVE",
    });
  }
  log(user, `TRANSFER_${status}`, "TRANSFER", request, request.assetTag);
  return status;
}
export function requestReturn({ assetId, notes = "" }, user) {
  const asset = getById(KEYS.assets, assetId);
  if (!asset || asset.currentHolderId !== user.id)
    throw new Error("You can return only assets allocated to you.");
  if (
    getAll(KEYS.returns).some(
      (r) => r.assetId === assetId && r.status === "PENDING",
    )
  )
    throw new Error("A pending return already exists.");
  const request = create(KEYS.returns, {
    assetId,
    assetTag: asset.tag,
    holderId: user.id,
    notes,
    status: "PENDING",
    requestedDate: today(),
  });
  log(user, "RETURN_REQUESTED", "RETURN", request, asset.tag);
  return request;
}
export function approveReturn({ requestId, condition, conditionNotes }, user) {
  if (!["ADMIN", "ASSET_MANAGER"].includes(user.role))
    throw new Error("You cannot approve returns.");
  const request = getById(KEYS.returns, requestId);
  if (!request || request.status !== "PENDING")
    throw new Error("Return request not found.");
  const maintenance = condition === "DAMAGED";
  update(KEYS.returns, requestId, {
    status: "APPROVED",
    returnedDate: today(),
    condition,
    conditionNotes,
    approvedBy: user.id,
  });
  update(KEYS.assets, request.assetId, {
    status: maintenance ? "UNDER_MAINTENANCE" : "AVAILABLE",
    condition,
    currentHolder: null,
    currentHolderId: null,
  });
  const active = getAll(KEYS.allocations).find(
    (a) => a.assetId === request.assetId && a.status === "ACTIVE",
  );
  if (active)
    update(KEYS.allocations, active.id, {
      status: "RETURNED",
      returnedDate: today(),
    });
  log(user, "RETURN_APPROVED", "RETURN", request, request.assetTag);
  return true;
}
export function createBooking(data, user) {
  if (data.endTime <= data.startTime)
    throw new Error("End time must be after start time.");
  if (
    detectBookingConflict(
      data.resourceId,
      data.date,
      data.startTime,
      data.endTime,
    )
  )
    throw new Error("This resource is already booked for the selected time.");
  const booking = create(KEYS.bookings, {
    ...data,
    userId: user.id,
    userName: user.name,
    department: data.department || user.department,
    status: "CONFIRMED",
  });
  log(
    user,
    "RESOURCE_BOOKED",
    "BOOKING",
    booking,
    `${data.resourceName} · ${data.date}`,
  );
  addNotification({
    userId: user.id,
    type: "Bookings",
    title: "Booking confirmed",
    description: `${data.resourceName} is booked for ${data.date}.`,
    reference: booking.id,
  });
  return booking;
}
export function cancelBooking(id, user) {
  const booking = getById(KEYS.bookings, id);
  if (!booking || booking.status === "CANCELLED")
    throw new Error("Active booking not found.");
  if (user.role === "EMPLOYEE" && booking.userId !== user.id)
    throw new Error("You can cancel only your own bookings.");
  return update(KEYS.bookings, id, {
    status: "CANCELLED",
    cancelledAt: new Date().toISOString(),
  });
}
export function raiseMaintenance(data, user) {
  const asset = getById(KEYS.assets, data.assetId);
  if (!asset) throw new Error("Asset not found.");
  if (user.role === "EMPLOYEE" && asset.currentHolderId !== user.id)
    throw new Error("Only the current holder can raise maintenance.");
  const request = create(KEYS.maintenance, {
    ...data,
    assetName: asset.name,
    assetTag: asset.tag,
    requestedBy: user.id,
    requestDate: today(),
    status: "PENDING",
  });
  log(user, "MAINTENANCE_REQUESTED", "MAINTENANCE", request, asset.tag);
  return request;
}
export function updateMaintenanceStatus(id, status, user) {
  const request = getById(KEYS.maintenance, id);
  if (!request) throw new Error("Maintenance request not found.");
  if (!["ADMIN", "ASSET_MANAGER"].includes(user.role))
    throw new Error("You cannot manage maintenance requests.");
  update(KEYS.maintenance, id, { status });
  if (["APPROVED", "TECHNICIAN_ASSIGNED", "IN_PROGRESS"].includes(status))
    update(KEYS.assets, request.assetId, { status: "UNDER_MAINTENANCE" });
  if (status === "RESOLVED") {
    const asset = getById(KEYS.assets, request.assetId);
    update(KEYS.assets, request.assetId, {
      status: asset.currentHolderId ? "ALLOCATED" : "AVAILABLE",
    });
  }
  log(user, `MAINTENANCE_${status}`, "MAINTENANCE", request, request.assetTag);
  return true;
}
export function createAudit(data, user) {
  if (user.role !== "ADMIN")
    throw new Error("Only Admin can create audit cycles.");
  return create(KEYS.audits, {
    ...data,
    status: "ACTIVE",
    items: data.assets.map((asset) => ({
      assetId: asset.id,
      tag: asset.tag,
      name: asset.name,
      expectedLocation: asset.location,
      currentLocation: "",
      verificationStatus: "PENDING",
    })),
    progress: 0,
  });
}
export function verifyAuditItem(auditId, assetId, result, user) {
  const audit = getById(KEYS.audits, auditId);
  if (!audit) throw new Error("Audit not found.");
  const items = audit.items.map((item) =>
      item.assetId === assetId
        ? {
            ...item,
            ...result,
            verifiedBy: user.id,
            verifiedAt: new Date().toISOString(),
          }
        : item,
    ),
    checked = items.filter((i) => i.verificationStatus !== "PENDING").length,
    progress = Math.round((checked / items.length) * 100);
  const updated = update(KEYS.audits, auditId, {
    items,
    progress,
    discrepancies: items.filter(
      (i) =>
        i.verificationStatus !== "VERIFIED" &&
        i.verificationStatus !== "PENDING",
    ),
  });
  return updated;
}
export function closeAudit(id, user) {
  const audit = getById(KEYS.audits, id);
  if (user.role !== "ADMIN") throw new Error("Only Admin can close audits.");
  if (!audit || audit.progress < 100)
    throw new Error("All assets must be checked before closing the audit.");
  return update(KEYS.audits, id, {
    status: "COMPLETED",
    completedAt: new Date().toISOString(),
  });
}
