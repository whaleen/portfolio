import { useFeaturedProjects } from "@/hooks/useProjects";
import { Link } from "react-router-dom";
import { SocialPreview } from "@/components/SocialPreview";
import { hasSocialPreview } from "@/lib/socialPreview";

export const Home = () => {
  const { projects, loading } = useFeaturedProjects();

  return (
    <div className="max-w-5xl mx-auto space-y-20">
      <section className="space-y-6 pt-10">
        <img
          src="/pfp.png"
          alt="Joshua Vaage"
          className="w-20 h-20 rounded-full border border-border"
        />
        <div className="space-y-4">
          <h1 className="text-5xl font-semibold tracking-tight">Joshua Vaage</h1>
          <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
            Full-stack developer focused on product engineering, developer tools,
            and AI-assisted workflows, with significant experience in Web3/Solana
            systems.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-base">
          <a
            href="https://t.me/jvaage"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            Telegram (preferred)
          </a>
          <a
            href="https://x.com/4A_6F_73_68"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            X DMs
          </a>
          <a
            href="https://github.com/whaleen"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            GitHub
          </a>
          <Link to="/contact" className="underline underline-offset-4">
            Contact
          </Link>
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold">Featured Projects</h2>
          <p className="text-muted-foreground">
            Selected work across developer tools, AI workflows, PWAs, and
            Web3/Solana projects.
          </p>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading projects...</p>
        ) : (
          <ul className="divide-y divide-border border-y border-border">
            {projects.map((project) => (
              <li key={project.Repo} className="py-5">
                <article className="space-y-3">
                  {hasSocialPreview(project["GitHub Org"], project.Repo) && (
                    <Link
                      to={`/projects/${project["GitHub Org"]}/${project.Repo}`}
                      className="block w-[220px] sm:w-[260px] overflow-hidden border border-border"
                    >
                      <SocialPreview
                        org={project["GitHub Org"]}
                        repo={project.Repo}
                        className="aspect-[1200/630]"
                      />
                    </Link>
                  )}
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <Link
                      to={`/projects/${project["GitHub Org"]}/${project.Repo}`}
                      className="text-xl font-medium underline underline-offset-4"
                    >
                      {project.Repo}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {project["GitHub Org"]}
                      {(project["Primary Language"] || project.Language) &&
                        ` · ${project["Primary Language"] || project.Language}`}
                    </p>
                  </div>
                  {(project.Description || project.Notes) && (
                    <p className="text-muted-foreground leading-relaxed">
                      {project.Description || project.Notes}
                    </p>
                  )}
                </article>
              </li>
            ))}
          </ul>
        )}

        <Link to="/projects" className="inline-block underline underline-offset-4">
          View all projects ({projects.length})
        </Link>
      </section>

      <section className="space-y-6 pb-4">
        <h2 className="text-3xl font-semibold">Focus Areas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm leading-7">
          <div>
            <h3 className="font-semibold mb-2">Frontend</h3>
            <p className="text-muted-foreground">
              React, Next.js, Vite, TypeScript, Tailwind CSS
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Backend and Tooling</h3>
            <p className="text-muted-foreground">
              Node.js, PostgreSQL, Python, Rust, CLI workflows, AI/LLM tooling
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Web3</h3>
            <p className="text-muted-foreground">
              Solana, wallet adapters, Web3.js, on-chain product integrations
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
