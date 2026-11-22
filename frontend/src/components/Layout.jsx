import { NavLink, Outlet } from 'react-router';
import { useAuth } from '../hooks/useAuth.js';
import Badge from './ui/Badge.jsx';
import Button from './ui/Button.jsx';
import Logo from './ui/Logo.jsx';
import { PlusIcon } from './ui/icons.jsx';
import { getInitials } from './ui/format.js';
import { buttonClass } from './ui/styles.js';

const ROLE_LABELS = {
    admin: 'Administrador',
    operator: 'Operario',
};

// Tab: 14px/500, active = foreground text + 2px orange bar under the label.
function tabClass({ isActive }) {
    const base =
        'relative flex h-full items-center rounded-sm px-3 text-sm font-medium whitespace-nowrap transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring';
    return isActive
        ? `${base} text-foreground after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-primary`
        : `${base} text-text-secondary hover:text-foreground`;
}

export default function Layout() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-background">
            <a
                href="#contenido"
                className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-20 focus:rounded-md focus:border focus:border-border focus:bg-card focus:px-3 focus:py-2"
            >
                Saltar al contenido
            </a>
            <header className="sticky top-0 z-10 h-14 border-b border-border-subtle bg-card">
                <nav
                    aria-label="Principal"
                    className="mx-auto flex h-full max-w-6xl items-center gap-3 px-4 sm:px-6"
                >
                    <div className="flex h-full min-w-0 items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Logo />
                            <span className="hidden text-sm font-semibold sm:inline">
                                Inventario
                            </span>
                        </div>
                        <div className="hidden h-5 w-px bg-border sm:block" aria-hidden="true" />
                        <div className="flex h-full overflow-x-auto">
                            <NavLink to="/" end className={tabClass}>
                                Stock
                            </NavLink>
                            <NavLink to="/movimientos" end className={tabClass}>
                                Movimientos
                            </NavLink>
                        </div>
                    </div>

                    <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
                        <NavLink
                            to="/movimientos/nuevo"
                            className={({ isActive }) =>
                                buttonClass({
                                    variant: 'secondary',
                                    size: 'sm',
                                    className: isActive ? 'border-border-strong bg-secondary' : '',
                                })
                            }
                        >
                            <PlusIcon size={14} />
                            <span className="sr-only md:not-sr-only">Registrar movimiento</span>
                        </NavLink>
                        <span
                            role="img"
                            aria-label={user.name}
                            title={user.name}
                            className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-xs font-medium text-text-secondary"
                        >
                            {getInitials(user.name)}
                        </span>
                        <span
                            className="hidden max-w-32 truncate text-13 leading-5 sm:block"
                            title={user.name}
                        >
                            {user.name}
                        </span>
                        <span className="hidden md:block">
                            <Badge>{ROLE_LABELS[user.role] ?? user.role}</Badge>
                        </span>
                        <Button variant="ghost" size="sm" onClick={logout}>
                            Salir
                        </Button>
                    </div>
                </nav>
            </header>
            <main
                id="contenido"
                tabIndex={-1}
                className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6"
            >
                <Outlet />
            </main>
        </div>
    );
}
