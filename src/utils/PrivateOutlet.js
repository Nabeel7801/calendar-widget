import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

import MainLayout from 'layout/MainLayout';

export function PrivateOutlet() {
    const auth = useAuth();
    const location = useLocation();

    return auth.user ? <MainLayout /> : <Navigate to="/login" state={{ from: location }} />;
}
