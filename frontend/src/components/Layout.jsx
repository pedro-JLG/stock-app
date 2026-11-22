import { NavLink, Outlet } from 'react-router';
import { useAuth } from '../hooks/useAuth.js';

const ROLE_LABELS = {
    admin: 'Administrador',
    operator: 'Operario',
};

function linkClass({ isActive }) {
    return isActive
        ? 'font-semibold text-foreground'
        : 'text-muted-foreground hover:text-foreground';
}

export default function Layout() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-muted">
            <header className="bg-card text-card-foreground shadow">
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
                            <span className="text-muted-foreground">
                                ({ROLE_LABELS[user.role] ?? user.role})
                            </span>
                        </span>
                        <button
                            type="button"
                            onClick={logout}
                            className="px-3 py-1 border rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        >
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
