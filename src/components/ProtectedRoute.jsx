import { Navigate, useLocation } from 'react-router-dom'
export default function ProtectedRoute({children}){const location=useLocation();return localStorage.getItem('assetflow_auth')==='true'?children:<Navigate to="/login" replace state={{from:location}}/>}
