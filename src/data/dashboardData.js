import {
  ArrowLeftRight,
  Boxes,
  CalendarCheck2,
  CircleCheckBig,
  Clock3,
  PackageCheck,
  Users,
  Wrench,
} from "lucide-react";

export const kpis = [
  {
    label: "Total Assets",
    value: "1,284",
    trend: "+12.5%",
    up: true,
    icon: Boxes,
    tone: "blue",
    gradient: "from-blue-500/10",
  },
  {
    label: "Allocated Assets",
    value: "742",
    trend: "+8.2%",
    up: true,
    icon: PackageCheck,
    tone: "indigo",
    gradient: "from-indigo-500/10",
  },
  {
    label: "Available Assets",
    value: "486",
    trend: "+4.1%",
    up: true,
    icon: CircleCheckBig,
    tone: "emerald",
    gradient: "from-emerald-500/10",
  },
  {
    label: "Employees",
    value: "350",
    trend: "+6.3%",
    up: true,
    icon: Users,
    tone: "cyan",
    gradient: "from-cyan-500/10",
  },
  {
    label: "Active Bookings",
    value: "68",
    trend: "+16.4%",
    up: true,
    icon: CalendarCheck2,
    tone: "violet",
    gradient: "from-violet-500/10",
  },
  {
    label: "Pending Maintenance",
    value: "23",
    trend: "-5.4%",
    up: false,
    icon: Wrench,
    tone: "amber",
    gradient: "from-amber-500/10",
  },
  {
    label: "Pending Transfers",
    value: "14",
    trend: "-3.1%",
    up: false,
    icon: ArrowLeftRight,
    tone: "amber",
    gradient: "from-orange-500/10",
  },
  {
    label: "Upcoming Returns",
    value: "29",
    trend: "+6.8%",
    up: true,
    icon: Clock3,
    tone: "cyan",
    gradient: "from-sky-500/10",
  },
];
export const chartData = [
  { name: "Jan", allocated: 610, available: 430 },
  { name: "Feb", allocated: 648, available: 415 },
  { name: "Mar", allocated: 630, available: 442 },
  { name: "Apr", allocated: 690, available: 404 },
  { name: "May", allocated: 716, available: 391 },
  { name: "Jun", allocated: 742, available: 486 },
];
export const utilization = [
  { name: "Allocated", value: 58, color: "#3563e9" },
  { name: "Available", value: 38, color: "#10b981" },
  { name: "Maintenance", value: 4, color: "#f59e0b" },
];
export const activities = [
  {
    title: "MacBook Pro 16 allocated",
    meta: "Assigned to Aditi Sharma · 12 min ago",
    type: "Allocation",
    color: "blue",
  },
  {
    title: "Conference Room A booked",
    meta: "Product team · Today, 2:00–3:00 PM",
    type: "Booking",
    color: "violet",
  },
  {
    title: "Vehicle VH-204 service completed",
    meta: "Maintenance closed by R. Mehta · 1 hr ago",
    type: "Maintenance",
    color: "emerald",
  },
  {
    title: "Projector PJ-009 transfer requested",
    meta: "Marketing → Sales · 2 hrs ago",
    type: "Transfer",
    color: "amber",
  },
  {
    title: "Dell Latitude returned",
    meta: "Received from Karan Singh · 3 hrs ago",
    type: "Return",
    color: "cyan",
  },
];
export const maintenance = [
  {
    date: "18",
    month: "JUL",
    title: "CNC Machine #04",
    meta: "Preventive service · Plant A",
    priority: "High",
  },
  {
    date: "21",
    month: "JUL",
    title: "Vehicle VH-118",
    meta: "Oil & filter replacement",
    priority: "Medium",
  },
  {
    date: "25",
    month: "JUL",
    title: "HVAC Unit - Floor 3",
    meta: "Quarterly inspection",
    priority: "Routine",
  },
];
export const notifications = [
  {
    title: "Transfer approved",
    meta: "Laptop LT-301 was approved",
    time: "5m",
  },
  {
    title: "Booking reminder",
    meta: "Meeting room booking in 30 min",
    time: "18m",
  },
  {
    title: "Low stock alert",
    meta: "Wireless mice below threshold",
    time: "1h",
  },
];
