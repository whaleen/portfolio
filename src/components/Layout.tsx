import { Link, NavLink, Outlet } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";

export const Layout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/pfp.png"
                alt="Joshua Vaage"
                className="w-9 h-9 rounded-full border border-border"
              />
              <span className="text-lg font-semibold">Joshua Vaage</span>
            </Link>
            <div className="flex flex-wrap items-center justify-end gap-5 text-base">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  isActive
                    ? "text-foreground underline underline-offset-4"
                    : "text-muted-foreground hover:text-foreground"
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/projects"
                className={({ isActive }) =>
                  isActive
                    ? "text-foreground underline underline-offset-4"
                    : "text-muted-foreground hover:text-foreground"
                }
              >
                Projects
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive
                    ? "text-foreground underline underline-offset-4"
                    : "text-muted-foreground hover:text-foreground"
                }
              >
                About
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  isActive
                    ? "text-foreground underline underline-offset-4"
                    : "text-muted-foreground hover:text-foreground"
                }
              >
                Contact
              </NavLink>
              <ModeToggle />
            </div>
          </div>
        </div>
      </nav>
      <main className="px-4 py-6">
        <Outlet />
      </main>
      <footer className="border-t border-border mt-16">
        <div className="max-w-5xl mx-auto px-4 py-8 text-sm text-muted-foreground">
          <p>© 2026 Joshua Vaage</p>
        </div>
      </footer>
    </div>
  );
};
