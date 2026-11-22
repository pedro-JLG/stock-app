import { Navigate, Route, Routes } from 'react-router';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import StockPage from './pages/StockPage.jsx';
import MovementsPage from './pages/MovementsPage.jsx';
import NewMovementPage from './pages/NewMovementPage.jsx';
import ProductFormPage from './pages/ProductFormPage.jsx';

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />

            <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                    <Route index element={<StockPage />} />
                    <Route path="movimientos" element={<MovementsPage />} />
                    <Route path="movimientos/nuevo" element={<NewMovementPage />} />

                    <Route element={<ProtectedRoute role="admin" />}>
                        <Route path="productos/nuevo" element={<ProductFormPage />} />
                        <Route path="productos/:id/editar" element={<ProductFormPage />} />
                    </Route>
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
