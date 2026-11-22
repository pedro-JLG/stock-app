import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../hooks/useAuth.js';

export default function ProtectedRoute({ role }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <p className="p-8 text-center text-muted-foreground">Cargando...</p>;
    }
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    if (role && user.role !== role) {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
}
