class MemoryStorage {
  constructor() {
    this.data = new Map();
  }
  getItem(k) {
    return this.data.has(k) ? this.data.get(k) : null;
  }
  setItem(k, v) {
    this.data.set(k, String(v));
  }
  removeItem(k) {
    this.data.delete(k);
  }
  clear() {
    this.data.clear();
  }
}
globalThis.localStorage = new MemoryStorage();
const storage = await import("../src/services/storageService.js"),
  workflow = await import("../src/services/workflowService.js"),
  auth = await import("../src/utils/auth.js");
storage.initializeSeedData();
const users = storage.getAll(storage.KEYS.users),
  admin = users.find((u) => u.role === "ADMIN"),
  manager = users.find((u) => u.role === "ASSET_MANAGER"),
  employee = users.find((u) => u.role === "EMPLOYEE"),
  head = users.find((u) => u.role === "DEPARTMENT_HEAD");
const checks = [];
const ok = (name, value) => {
  if (!value) throw new Error(`FAILED: ${name}`);
  checks.push(name);
};
const rejects = (name, fn) => {
  try {
    fn();
    throw new Error(`FAILED: ${name}`);
  } catch (error) {
    if (error.message.startsWith("FAILED")) throw error;
    checks.push(name);
  }
};
rejects("registration rejects ADMIN", () =>
  auth.registerUser({
    name: "Bad Admin",
    email: "bad@x.com",
    password: "X",
    role: "ADMIN",
  }),
);
const asset = workflow.registerAsset(
  {
    tag: "AF-TEST-01",
    name: "Test Laptop",
    category: "Laptop",
    serial: "SER-TEST-01",
    department: "Information Technology",
    location: "Test Lab",
    condition: "GOOD",
    purchaseDate: "2026-01-01",
    warrantyDate: "2029-01-01",
    type: "NORMAL",
  },
  manager,
);
ok(
  "new asset starts AVAILABLE",
  storage.getById(storage.KEYS.assets, asset.id).status === "AVAILABLE",
);
rejects("duplicate asset tag blocked", () =>
  workflow.registerAsset({ ...asset, id: undefined, serial: "OTHER" }, manager),
);
workflow.allocateAsset(
  {
    assetId: asset.id,
    holderId: employee.id,
    expectedReturnDate: "2026-12-31",
  },
  manager,
);
ok(
  "allocation changes asset status",
  storage.getById(storage.KEYS.assets, asset.id).status === "ALLOCATED",
);
rejects("double allocation blocked", () =>
  workflow.allocateAsset({ assetId: asset.id, holderId: head.id }, manager),
);
const transfer = workflow.requestTransfer(
  { assetId: asset.id, newHolderId: head.id, reason: "Department project" },
  employee,
);
rejects("duplicate transfer blocked", () =>
  workflow.requestTransfer(
    { assetId: asset.id, newHolderId: head.id, reason: "Again" },
    employee,
  ),
);
workflow.decideTransfer(transfer.id, "APPROVE", manager);
ok(
  "approved transfer updates holder",
  storage.getById(storage.KEYS.assets, asset.id).currentHolderId === head.id,
);
const booking = workflow.createBooking(
  {
    resourceId: "AST-0009",
    resourceName: "Epson EB-L630U",
    date: "2026-08-10",
    startTime: "10:00",
    endTime: "11:00",
    purpose: "Demo",
    attendees: 4,
  },
  employee,
);
ok(
  "booking persisted",
  Boolean(storage.getById(storage.KEYS.bookings, booking.id)),
);
rejects("overlapping booking blocked", () =>
  workflow.createBooking(
    {
      resourceId: "AST-0009",
      resourceName: "Epson EB-L630U",
      date: "2026-08-10",
      startTime: "10:30",
      endTime: "11:30",
      purpose: "Conflict",
    },
    head,
  ),
);
const maintenance = workflow.raiseMaintenance(
  { assetId: asset.id, issueDescription: "Screen issue", priority: "HIGH" },
  head,
);
ok(
  "raised maintenance stays pending",
  maintenance.status === "PENDING" &&
    storage.getById(storage.KEYS.assets, asset.id).status === "ALLOCATED",
);
workflow.updateMaintenanceStatus(maintenance.id, "APPROVED", manager);
ok(
  "approval moves asset to maintenance",
  storage.getById(storage.KEYS.assets, asset.id).status === "UNDER_MAINTENANCE",
);
workflow.updateMaintenanceStatus(maintenance.id, "RESOLVED", manager);
ok(
  "resolved assigned asset returns allocated",
  storage.getById(storage.KEYS.assets, asset.id).status === "ALLOCATED",
);
const returned = workflow.requestReturn(
  { assetId: asset.id, notes: "Done" },
  head,
);
workflow.approveReturn(
  { requestId: returned.id, condition: "GOOD", conditionNotes: "Verified" },
  manager,
);
ok(
  "approved return releases asset",
  storage.getById(storage.KEYS.assets, asset.id).status === "AVAILABLE",
);
const audit = workflow.createAudit(
  {
    name: "Test Audit",
    department: "Information Technology",
    startDate: "2026-08-01",
    endDate: "2026-08-10",
    assignedAuditor: manager.id,
    assets: [asset],
  },
  admin,
);
rejects("incomplete audit cannot close", () =>
  workflow.closeAudit(audit.id, admin),
);
workflow.verifyAuditItem(
  audit.id,
  asset.id,
  { verificationStatus: "VERIFIED", currentLocation: "Test Lab" },
  manager,
);
workflow.closeAudit(audit.id, admin);
ok(
  "complete audit closes",
  storage.getById(storage.KEYS.audits, audit.id).status === "COMPLETED",
);
ok(
  "actions create activity logs",
  storage.getAll(storage.KEYS.logs).length >= 8,
);
ok(
  "actions create notifications",
  storage.getAll(storage.KEYS.notifications).length >= 3,
);
console.log(`Workflow checks passed: ${checks.length}`);
checks.forEach((check) => console.log(`  ✓ ${check}`));
