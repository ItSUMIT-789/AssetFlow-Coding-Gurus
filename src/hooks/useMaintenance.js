import { useMemo, useState } from 'react'

const seedRequests = [
  {
    id: 1,
    assetName: 'Dell Latitude 7440',
    issue: 'Battery drains within 45 minutes',
    priority: 'High',
    status: 'Pending',
    technician: 'A. Khan',
    technicianRole: 'Senior Technician',
    estimatedCompletion: '2h',
    createdAt: '2026-07-11',
    dueDate: '2026-07-12',
    category: 'Laptops',
    tags: ['Battery', 'Warranty'],
    progress: 20,
    estimatedHours: 2.5,
    sla: 'At risk',
  },
  {
    id: 2,
    assetName: 'Epson EcoTank L6570',
    issue: 'Paper jam on tray 2',
    priority: 'Medium',
    status: 'Approved',
    technician: 'M. Reza',
    technicianRole: 'Field Engineer',
    estimatedCompletion: 'Today',
    createdAt: '2026-07-10',
    dueDate: '2026-07-13',
    category: 'Printers',
    tags: ['Printer', 'Consumables'],
    progress: 38,
    estimatedHours: 1.5,
    sla: 'On track',
  },
  {
    id: 3,
    assetName: 'Cisco Webex Board',
    issue: 'Camera feed flickering',
    priority: 'Critical',
    status: 'Technician Assigned',
    technician: 'L. Stone',
    technicianRole: 'AV Specialist',
    estimatedCompletion: '4h',
    createdAt: '2026-07-09',
    dueDate: '2026-07-11',
    category: 'Conference Devices',
    tags: ['AV', 'Escalation'],
    progress: 52,
    estimatedHours: 4,
    sla: 'Breached',
  },
  {
    id: 4,
    assetName: 'iPhone 15 Pro',
    issue: 'Replace cracked screen',
    priority: 'High',
    status: 'In Progress',
    technician: 'R. Patel',
    technicianRole: 'Mobile Support',
    estimatedCompletion: 'Tomorrow',
    createdAt: '2026-07-08',
    dueDate: '2026-07-12',
    category: 'Mobiles',
    tags: ['Mobile', 'Repair'],
    progress: 74,
    estimatedHours: 3,
    sla: 'On track',
  },
  {
    id: 5,
    assetName: 'Logitech Rally Bar',
    issue: 'Firmware update and calibration',
    priority: 'Low',
    status: 'Resolved',
    technician: 'S. Ali',
    technicianRole: 'AV Specialist',
    estimatedCompletion: 'Done',
    createdAt: '2026-07-06',
    dueDate: '2026-07-09',
    category: 'Conference Devices',
    tags: ['Firmware', 'Calibration'],
    progress: 100,
    estimatedHours: 2,
    sla: 'Met',
  },
]

const seedComments = {
  1: [
    { id: 1, author: 'Nora Chen', time: '10m ago', body: 'Requested swap to a spare device after user feedback.' },
    { id: 2, author: 'A. Khan', time: '4m ago', body: 'Battery health check confirmed under 62% capacity.' },
  ],
  2: [{ id: 1, author: 'M. Reza', time: '22m ago', body: 'Cleaning and tray alignment completed.' }],
  3: [{ id: 1, author: 'L. Stone', time: '1h ago', body: 'Calibration starts after room booking clears.' }],
  4: [{ id: 1, author: 'R. Patel', time: '2h ago', body: 'Screen replacement part allocated from stock.' }],
  5: [{ id: 1, author: 'S. Ali', time: '1d ago', body: 'Device handed back to the booking owner.' }],
}

const stepOrder = ['Pending', 'Approved', 'Technician Assigned', 'In Progress', 'Resolved']

export function useMaintenance() {
  const [requests, setRequests] = useState(seedRequests)
  const [selectedId, setSelectedId] = useState(seedRequests[0].id)
  const [isDrawerOpen, setIsDrawerOpen] = useState(true)
  const [draggingId, setDraggingId] = useState(null)
  const [commentDraft, setCommentDraft] = useState('Add a note to this request…')
  const [uploads, setUploads] = useState([
    { id: 1, name: 'screen-shot-01.png', progress: 86 },
    { id: 2, name: 'damage-closeup.jpg', progress: 64 },
  ])

  const selectedRequest = useMemo(() => requests.find((item) => item.id === selectedId) ?? requests[0], [requests, selectedId])

  const groupedRequests = useMemo(() => stepOrder.reduce((accumulator, status) => {
    accumulator[status] = requests.filter((request) => request.status === status)
    return accumulator
  }, {}), [requests])

  const stats = useMemo(() => ({
    total: requests.length,
    open: requests.filter((request) => request.status !== 'Resolved').length,
    pendingApproval: requests.filter((request) => request.status === 'Pending').length,
    assigned: requests.filter((request) => request.status === 'Technician Assigned').length,
    inProgress: requests.filter((request) => request.status === 'In Progress').length,
    resolved: requests.filter((request) => request.status === 'Resolved').length,
    avgResolutionTime: '6.8h',
    avgCompletionTime: '1.4d',
    highPriority: requests.filter((request) => request.priority === 'High' || request.priority === 'Critical').length,
    slaCompliance: '91%',
    technicianUtilization: '78%',
  }), [requests])

  const charts = useMemo(() => ({
    byStatus: stepOrder.map((status) => ({ name: status, value: groupedRequests[status].length })),
    monthlyTrend: [
      { month: 'Jan', requests: 24, resolved: 21 },
      { month: 'Feb', requests: 28, resolved: 25 },
      { month: 'Mar', requests: 31, resolved: 29 },
      { month: 'Apr', requests: 35, resolved: 30 },
      { month: 'May', requests: 32, resolved: 28 },
      { month: 'Jun', requests: 38, resolved: 33 },
    ],
    priorityDistribution: [
      { name: 'Critical', value: requests.filter((request) => request.priority === 'Critical').length },
      { name: 'High', value: requests.filter((request) => request.priority === 'High').length },
      { name: 'Medium', value: requests.filter((request) => request.priority === 'Medium').length },
      { name: 'Low', value: requests.filter((request) => request.priority === 'Low').length },
    ],
    technicianWorkload: [
      { name: 'A. Khan', value: 5 },
      { name: 'M. Reza', value: 3 },
      { name: 'L. Stone', value: 4 },
      { name: 'R. Patel', value: 2 },
      { name: 'S. Ali', value: 6 },
    ],
    resolutionTime: [
      { bucket: '<4h', value: 9 },
      { bucket: '4-8h', value: 13 },
      { bucket: '8-24h', value: 8 },
      { bucket: '24h+', value: 4 },
    ],
  }), [groupedRequests, requests])

  const moveRequest = (requestId, nextStatus) => {
    setRequests((currentRequests) => currentRequests.map((request) => (request.id === requestId ? { ...request, status: nextStatus, progress: Math.min(100, request.progress + 18) } : request)))
    setSelectedId(requestId)
    setIsDrawerOpen(true)
  }

  const openRequest = (requestId) => {
    setSelectedId(requestId)
    setIsDrawerOpen(true)
  }

  const addComment = () => {
    setCommentDraft('')
  }

  const value = {
    requests,
    groupedRequests,
    selectedRequest,
    selectedId,
    setSelectedId,
    isDrawerOpen,
    setIsDrawerOpen,
    draggingId,
    setDraggingId,
    openRequest,
    moveRequest,
    stats,
    charts,
    comments: seedComments[selectedRequest.id] ?? [],
    commentDraft,
    setCommentDraft,
    addComment,
    uploads,
    setUploads,
    stepOrder,
  }

  return value
}