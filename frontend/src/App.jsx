import { Navigate, Route, Routes } from 'react-router';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LoginPage from './pages/LoginPage.jsx';
import StockPage from './pages/StockPage.jsx';
import MovementsPage from './pages/MovementsPage.jsx';
import NewMovementPage from './pages/NewMovementPage.jsx';
import ProductFormPage from './pages/ProductFormPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route index element={<StockPage />} />
        <Route path="movimientos" element={<MovementsPage />} />
        <Route path="movimientos/nuevo" element={<NewMovementPage />} />

        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="productos/nuevo" element={<ProductFormPage />} />
          <Route path="productos/:id/editar" element={<ProductFormPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}