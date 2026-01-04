import { Link, Outlet } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";

export const Layout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/pfp.png"
                alt="Joshua Vaage"
                className="w-10 h-10 rounded-full border-2 border-border"
              />
              <span className="text-xl font-bold">Joshua Vaage</span>
            </Link>
            <div className="flex gap-6">
              <Link
                to="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <Link
                to="/projects"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Projects
              </Link>
              <Link
                to="/about"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </Link>
              <ModeToggle />
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <div className="flex justify-center mb-4">
            <img
              src="/pfp.png"
              alt="Joshua Vaage"
              className="w-12 h-12 rounded-full border-2 border-border"
            />
          </div>
          <p>© 2026 Joshua Vaage. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
