import {
  BellRing,
  BookOpenCheck,
  Boxes,
  Building2,
  ChartNoAxesCombined,
  ClipboardCheck,
  History,
  LockKeyhole,
  SearchCheck,
  Settings,
  ShieldCheck,
  UserRoundCog,
  Users,
  Wrench,
} from "lucide-react";
export const features = [
  [
    Boxes,
    "Asset Tracking",
    "Track the lifecycle, ownership, status, and location of every physical asset.",
  ],
  [
    Users,
    "Employee & Department Allocation",
    "Assign assets with clear accountability across people and teams.",
  ],
  [
    BookOpenCheck,
    "Resource Booking",
    "Reserve rooms, vehicles, and equipment without schedule conflicts.",
  ],
  [
    Wrench,
    "Maintenance Management",
    "Plan service schedules and resolve maintenance requests efficiently.",
  ],
  [
    ClipboardCheck,
    "Audit & Verification",
    "Run physical audits and preserve a complete, reliable history.",
  ],
  [
    BellRing,
    "Real-Time Notifications",
    "Keep users informed about bookings, returns, and maintenance.",
  ],
  [
    LockKeyhole,
    "Role-Based Access Control",
    "Protect sensitive workflows with precise permission controls.",
  ],
  [
    ChartNoAxesCombined,
    "Reports & Analytics",
    "Turn asset activity into clear operational insights.",
  ],
];
export const roles = [
  [
    Users,
    "Employee",
    "View assigned assets, request resources, and manage personal bookings.",
  ],
  [
    Building2,
    "Department Head",
    "Oversee team allocations and monitor departmental resource usage.",
  ],
  [
    UserRoundCog,
    "Asset Manager",
    "Manage inventory, assignments, maintenance, and verification.",
  ],
  [
    ShieldCheck,
    "Administrator",
    "Control users, roles, settings, and organization-wide governance.",
  ],
];
export const benefits = [
  "Prevent double asset allocation",
  "Reduce asset loss",
  "Improve resource utilization",
  "Automate maintenance workflows",
  "Track overdue returns",
  "Maintain complete audit history",
  "Improve organizational transparency",
];
export const steps = [
  [Boxes, "Register Assets", "Build a structured digital inventory."],
  [
    SearchCheck,
    "Allocate or Book Resources",
    "Assign assets and reserve shared resources.",
  ],
  [
    Settings,
    "Track Usage and Maintenance",
    "Monitor condition, location, and service activity.",
  ],
  [
    History,
    "Generate Reports and Insights",
    "Make confident, data-driven decisions.",
  ],
];
