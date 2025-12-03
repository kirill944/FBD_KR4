import React from 'react'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children, isLoggedIn }) {
    if (!isLoggedIn) {
        return <Navigate to="/FBD_KR4/login" replace />
    }

    return children
}

export default ProtectedRoute