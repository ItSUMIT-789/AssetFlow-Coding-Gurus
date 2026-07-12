// import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
// import Home from './pages/Home'
// import Login from './pages/Login'
// import Register from './pages/Register'
// import Dashboard from './pages/Dashboard'
// import ProtectedRoute from './components/ProtectedRoute'
// import AssetPage from './pages/AssetPage'
// import NotificationCenter from './pages/NotificationCenter'
// import AuditManagementPage from './pages/AuditManagementPage'

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route 
//           path="/dashboard" 
//           element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
//         />
//         <Route path="/assets" element={<AssetPage />} />
//         <Route path="/notifications" element={<NotificationCenter />} />
//         <Route path="/audit-management" element={<AuditManagementPage />} />
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </BrowserRouter>
//   )
// }

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AssetAllocationPage from './pages/AssetAllocationPage'
import OrganizationSetup from './pages/OrganizationSetup'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assets"
          element={
            <ProtectedRoute>
              <AssetAllocationPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/organization-setup"
          element={
            <ProtectedRoute>
              <OrganizationSetup />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}