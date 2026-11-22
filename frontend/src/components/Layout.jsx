import { NavLink, Outlet } from 'react-router';
import { useAuth } from '../hooks/useAuth.js';

const ROLE_LABELS = {
    admin: 'Administrador',
    operator: 'Operario',
};

function linkClass({ isActive }) {
    return isActive ? 'font-semibold text-blue-600' : 'text-slate-600 hover:text-slate-900';
}

export default function Layout() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow">
                <nav className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center gap-4">
                    <NavLink to="/" end className={linkClass}>
                        Stock
                    </NavLink>
                    <NavLink to="/movimientos" end className={linkClass}>
                        Movimientos
                    </NavLink>
                    <NavLink to="/movimientos/nuevo" className={linkClass}>
                        Registrar movimiento
                    </NavLink>

                    <div className="ml-auto flex items-center gap-3 text-sm">
                        <span>
                            {user.name}{' '}
                            <span className="text-slate-500">
                                ({ROLE_LABELS[user.role] ?? user.role})
                            </span>
                        </span>
                        <button type="button" onClick={logout} className="px-3 py-1 border rounded">
                            Salir
                        </button>
                    </div>
                </nav>
            </header>
            <main className="max-w-5xl mx-auto px-4 py-6">
                <Outlet />
            </main>
        </div>
    );
}
