const PREFIX = "assetflow_";
export const KEYS = {
  users: "users",
  departments: "departments",
  categories: "categories",
  assets: "assets",
  allocations: "allocations",
  transfers: "transfer_requests",
  returns: "return_requests",
  resources: "resources",
  bookings: "bookings",
  maintenance: "maintenance_requests",
  audits: "audit_cycles",
  notifications: "notifications",
  logs: "activity_logs",
};
const now = () => new Date().toISOString();
export function generateId(prefix = "ID") {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}
export function getAll(collection) {
  try {
    const value = JSON.parse(localStorage.getItem(PREFIX + collection) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}
export const getById = (collection, id) =>
  getAll(collection).find((item) => String(item.id) === String(id)) || null;
export function setAll(collection, items) {
  if (!Array.isArray(items))
    throw new Error("Storage collection must be an array.");
  localStorage.setItem(PREFIX + collection, JSON.stringify(items));
  return items;
}
export function create(collection, value) {
  const items = getAll(collection),
    record = {
      ...value,
      id: value.id || generateId(collection.slice(0, 3).toUpperCase()),
      createdAt: value.createdAt || now(),
      updatedAt: now(),
    };
  setAll(collection, [record, ...items]);
  return record;
}
export function update(collection, id, changes) {
  const items = getAll(collection);
  let found = false;
  const next = items.map((item) => {
    if (String(item.id) !== String(id)) return item;
    found = true;
    return { ...item, ...changes, id: item.id, updatedAt: now() };
  });
  if (!found) throw new Error(`Record not found: ${id}`);
  setAll(collection, next);
  return next.find((item) => String(item.id) === String(id));
}
export function remove(collection, id) {
  const items = getAll(collection),
    next = items.filter((item) => String(item.id) !== String(id));
  if (next.length === items.length) throw new Error(`Record not found: ${id}`);
  setAll(collection, next);
  return true;
}
export function addNotification({
  userId = null,
  department = null,
  type = "System",
  title,
  description,
  priority = "Normal",
  reference = null,
}) {
  return create(KEYS.notifications, {
    userId,
    department,
    type,
    title,
    description,
    priority,
    reference,
    unread: true,
    time: now(),
  });
}
export function addActivityLog({
  actor,
  role,
  action,
  entity,
  entityId,
  details,
}) {
  return create(KEYS.logs, {
    actor,
    role,
    action,
    entity,
    entityId,
    details,
    timestamp: now(),
  });
}
export function detectBookingConflict(
  resourceId,
  date,
  startTime,
  endTime,
  excludeId = null,
) {
  return getAll(KEYS.bookings).some(
    (b) =>
      b.id !== excludeId &&
      b.resourceId === resourceId &&
      b.date === date &&
      b.status !== "CANCELLED" &&
      startTime < b.endTime &&
      endTime > b.startTime,
  );
}
export function detectOverdueReturns() {
  const today = new Date().toISOString().slice(0, 10);
  return getAll(KEYS.allocations).filter(
    (a) =>
      a.status === "ACTIVE" &&
      a.expectedReturnDate &&
      a.expectedReturnDate < today,
  );
}
export function syncOverdueNotifications() {
  detectOverdueReturns().forEach((allocation) => {
    const exists = getAll(KEYS.notifications).some(
      (notification) =>
        notification.reference === allocation.id &&
        notification.type === "Returns",
    );
    if (!exists)
      addNotification({
        userId: allocation.holderId,
        department: allocation.department,
        type: "Returns",
        title: "Asset return overdue",
        description: `${allocation.assetTag} was due on ${allocation.expectedReturnDate}.`,
        priority: "High",
        reference: allocation.id,
      });
  });
}
export function calculateDashboardStats() {
  const assets = getAll(KEYS.assets),
    bookings = getAll(KEYS.bookings),
    transfers = getAll(KEYS.transfers),
    maintenance = getAll(KEYS.maintenance);
  return {
    totalAssets: assets.length,
    availableAssets: assets.filter((a) => a.status === "AVAILABLE").length,
    allocatedAssets: assets.filter((a) => a.status === "ALLOCATED").length,
    underMaintenance: assets.filter((a) => a.status === "UNDER_MAINTENANCE")
      .length,
    activeBookings: bookings.filter((b) =>
      ["CONFIRMED", "ACTIVE"].includes(b.status),
    ).length,
    pendingTransfers: transfers.filter((t) => t.status === "PENDING").length,
    overdueReturns: detectOverdueReturns().length,
    pendingMaintenance: maintenance.filter((m) =>
      ["PENDING", "APPROVED", "TECHNICIAN_ASSIGNED", "IN_PROGRESS"].includes(
        m.status,
      ),
    ).length,
  };
}
export function initializeSeedData() {
  const seed = (key, data) => {
    if (localStorage.getItem(PREFIX + key) === null) setAll(key, data);
  };
  seed(KEYS.departments, [
    {
      id: "DEP-IT",
      name: "Information Technology",
      head: "Aarav Mehta",
      parent: "Corporate Operations",
      status: "ACTIVE",
    },
    {
      id: "DEP-OPS",
      name: "Operations",
      head: "Priya Nair",
      parent: "Executive Office",
      status: "ACTIVE",
    },
    {
      id: "DEP-HR",
      name: "Human Resources",
      head: "Neha Kapoor",
      parent: "Corporate Operations",
      status: "ACTIVE",
    },
    {
      id: "DEP-FIN",
      name: "Finance",
      head: "Amit Kulkarni",
      parent: "Executive Office",
      status: "ACTIVE",
    },
    {
      id: "DEP-SALES",
      name: "Sales",
      head: "Vikram Shah",
      parent: "Revenue Division",
      status: "ACTIVE",
    },
    {
      id: "DEP-MKT",
      name: "Marketing",
      head: "Sneha Iyer",
      parent: "Revenue Division",
      status: "ACTIVE",
    },
    {
      id: "DEP-ADM",
      name: "Administration",
      head: "Abhay Sonone",
      parent: "Corporate Operations",
      status: "ACTIVE",
    },
  ]);
  seed(KEYS.categories, [
    { id: "CAT-LAP", name: "Laptop", code: "LT", bookable: false },
    { id: "CAT-VEH", name: "Vehicle", code: "VH", bookable: true },
    { id: "CAT-PROJ", name: "Projector", code: "PJ", bookable: true },
    { id: "CAT-FUR", name: "Furniture", code: "FR", bookable: false },
    { id: "CAT-MCH", name: "Machinery", code: "MC", bookable: false },
    { id: "CAT-ROOM", name: "Meeting Room", code: "MR", bookable: true },
  ]);
  seed(KEYS.users, [
    {
      id: "USR-ADMIN",
      name: "Abhay Sonone",
      email: "abhaysonone0@gmail.com",
      password: "Abhay@9834244904",
      role: "ADMIN",
      department: "Administration",
      designation: "System Administrator",
      active: true,
    },
    {
      id: "USR-AM",
      name: "Aarav Mehta",
      email: "manager@assetflow.io",
      password: "Manager@123",
      role: "ASSET_MANAGER",
      department: "Information Technology",
      designation: "Asset Manager",
      active: true,
    },
    {
      id: "USR-DH",
      name: "Priya Nair",
      email: "head@assetflow.io",
      password: "Head@123",
      role: "DEPARTMENT_HEAD",
      department: "Operations",
      designation: "Department Head",
      active: true,
    },
    {
      id: "USR-EMP",
      name: "Rahul Mehta",
      email: "employee@assetflow.io",
      password: "Employee@123",
      role: "EMPLOYEE",
      department: "Information Technology",
      designation: "Software Engineer",
      active: true,
    },
  ]);
  const requiredUsers = [
    {
      id: "USR-ADMIN",
      name: "Abhay Sonone",
      email: "abhaysonone0@gmail.com",
      password: "Abhay@9834244904",
      role: "ADMIN",
      department: "Administration",
      designation: "System Administrator",
      active: true,
    },
    {
      id: "USR-AM",
      name: "Aarav Mehta",
      email: "manager@assetflow.io",
      password: "Manager@123",
      role: "ASSET_MANAGER",
      department: "Information Technology",
      designation: "Asset Manager",
      active: true,
    },
    {
      id: "USR-DH",
      name: "Priya Nair",
      email: "head@assetflow.io",
      password: "Head@123",
      role: "DEPARTMENT_HEAD",
      department: "Operations",
      designation: "Department Head",
      active: true,
    },
    {
      id: "USR-EMP",
      name: "Rahul Mehta",
      email: "employee@assetflow.io",
      password: "Employee@123",
      role: "EMPLOYEE",
      department: "Information Technology",
      designation: "Software Engineer",
      active: true,
    },
  ];
  const existingUsers = getAll(KEYS.users);
  requiredUsers.forEach((required) => {
    if (
      !existingUsers.some(
        (user) => user.email.toLowerCase() === required.email.toLowerCase(),
      )
    )
      existingUsers.push(required);
  });
  setAll(KEYS.users, existingUsers);
  seed(KEYS.assets, [
    {
      id: "AST-1024",
      tag: "AF-LT-1024",
      name: "MacBook Pro 16",
      category: "Laptop",
      serial: "C02ZQ1ABMD6R",
      department: "Information Technology",
      location: "HQ · Floor 4",
      condition: "GOOD",
      purchaseDate: "2025-01-16",
      warrantyDate: "2028-01-15",
      type: "NORMAL",
      status: "ALLOCATED",
      currentHolderId: "USR-EMP",
      currentHolder: "Rahul Mehta",
    },
    {
      id: "AST-0009",
      tag: "AF-PJ-0009",
      name: "Epson EB-L630U",
      category: "Projector",
      serial: "X8KJ020091",
      department: "Marketing",
      location: "HQ · Store A",
      condition: "GOOD",
      purchaseDate: "2024-03-14",
      warrantyDate: "2027-03-13",
      type: "SHARED_RESOURCE",
      status: "AVAILABLE",
    },
    {
      id: "AST-0118",
      tag: "AF-VH-0118",
      name: "Toyota Innova Crysta",
      category: "Vehicle",
      serial: "MA1TA2SJ3N20541",
      department: "Operations",
      location: "HQ · Parking B",
      condition: "GOOD",
      purchaseDate: "2022-09-21",
      warrantyDate: "2027-09-20",
      type: "SHARED_RESOURCE",
      status: "ALLOCATED",
      currentHolderId: "USR-DH",
      currentHolder: "Priya Nair",
    },
    {
      id: "AST-0088",
      tag: "AF-TB-0088",
      name: "Samsung Galaxy Tab S9",
      category: "Tablet",
      serial: "R52W80T0088",
      department: "Sales",
      location: "Branch · Mumbai",
      condition: "GOOD",
      purchaseDate: "2025-02-08",
      warrantyDate: "2027-02-07",
      type: "NORMAL",
      status: "AVAILABLE",
    },
  ]);
  seed(KEYS.allocations, [
    {
      id: "ALL-1001",
      assetId: "AST-1024",
      assetTag: "AF-LT-1024",
      holderId: "USR-EMP",
      holderName: "Rahul Mehta",
      department: "Information Technology",
      allocationDate: "2026-06-21",
      expectedReturnDate: "2026-07-05",
      status: "ACTIVE",
    },
  ]);
  seed(
    KEYS.resources,
    getAll(KEYS.assets)
      .filter((a) => a.type === "SHARED_RESOURCE")
      .map((a) => ({
        id: a.id,
        name: a.name,
        assetTag: a.tag,
        department: a.department,
        location: a.location,
        status: "ACTIVE",
      })),
  );
  seed(KEYS.transfers, []);
  seed(KEYS.returns, []);
  seed(KEYS.bookings, []);
  seed(KEYS.maintenance, []);
  seed(KEYS.audits, [
    {
      id: "AUD-Q3-2026",
      name: "Q3 Physical Asset Verification",
      department: "Corporate Operations",
      startDate: "2026-07-01",
      endDate: "2026-07-18",
      auditor: "Abhay Sonone",
      status: "ACTIVE",
      progress: 0,
      items: getAll(KEYS.assets).map((asset) => ({
        assetId: asset.id,
        tag: asset.tag,
        name: asset.name,
        category: asset.category,
        expectedLocation: asset.location,
        currentLocation: "",
        verificationStatus: "PENDING",
        verificationMethod: "Pending",
        checkedAt: null,
      })),
      discrepancies: [],
    },
  ]);
  seed(KEYS.notifications, []);
  seed(KEYS.logs, []);
  syncOverdueNotifications();
}
