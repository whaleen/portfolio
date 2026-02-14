import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { useProjects } from "@/hooks/useProjects";
import { Badge } from "@/components/ui/badge";
import { SocialPreview } from "@/components/SocialPreview";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Globe,
  RefreshCw,
  Star,
  GitFork,
  Eye,
  EyeOff,
  CircleDot,
  Smartphone,
  CheckCircle,
  Wallet,
  Pin,
  Settings,
  Package,
  Trash2,
} from "lucide-react";
import {
  updateGitHubData,
  updateOGData,
  toggleHidden,
  deleteProject,
} from "@/lib/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const ProjectDetail = () => {
  const { org, repo } = useParams<{ org: string; repo: string }>();
  const navigate = useNavigate();
  const { projects, loading, refresh } = useProjects();
  const [updating, setUpdating] = useState(false);
  const [readmeContent, setReadmeContent] = useState<string | null>(null);
  const [readmeLoading, setReadmeLoading] = useState(false);
  const [readmeError, setReadmeError] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isDev = import.meta.env.DEV;

  const project = projects.find(
    (p) => p["GitHub Org"] === org && p.Repo === repo
  );

  useEffect(() => {
    const readmePath = project?.["README Path"];
    if (!readmePath) {
      setReadmeContent(null);
      return;
    }

    const fetchReadme = async () => {
      setReadmeLoading(true);
      setReadmeError(false);
      try {
        const response = await fetch(readmePath);
        if (!response.ok) throw new Error("Failed to fetch README");
        const text = await response.text();
        setReadmeContent(text);
      } catch (error) {
        console.error("Error fetching README:", error);
        setReadmeError(true);
      } finally {
        setReadmeLoading(false);
      }
    };

    fetchReadme();
  }, [project?.["README Path"]]);

  if (loading) {
    return <p className="text-muted-foreground py-10">Loading project...</p>;
  }

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  const backUrl = org ? `/projects/${org}` : "/projects";
  const chipClass = "rounded-none";

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <Link
        to={backUrl}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground underline underline-offset-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {org} projects
      </Link>

      <header className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {project.Favicon && (
                <img
                  src={project.Favicon}
                  alt=""
                  className="w-11 h-11 rounded-none"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
              <h1 className="text-5xl font-semibold tracking-tight">{project.Repo}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className={chipClass}>
                {project["GitHub Org"]}
              </Badge>
              {(project["Primary Language"] || project.Language) && (
                <Badge variant="secondary" className={chipClass}>
                  {project["Primary Language"] || project.Language}
                </Badge>
              )}
              {project["Project Type"] && (
                <Badge variant="outline" className={chipClass}>
                  {project["Project Type"]}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <a
              href={`https://github.com/${project["GitHub Org"]}/${project.Repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 underline underline-offset-4"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            {(project.Homepage || project["Live URL"]) && !project["NPM Package URL"] && (
              <a
                href={project.Homepage || project["Live URL"]}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 underline underline-offset-4"
              >
                <Globe className="h-4 w-4" />
                Live
              </a>
            )}
            {project["NPM Package URL"] && (
              <a
                href={project["NPM Package URL"]}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 underline underline-offset-4"
              >
                <Package className="h-4 w-4" />
                NPM
              </a>
            )}
            {isDev && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    disabled={updating}
                    className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground disabled:opacity-50 underline underline-offset-4"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={async () => {
                      setUpdating(true);
                      try {
                        await updateGitHubData(
                          `${project["GitHub Org"]}/${project.Repo}`
                        );
                        await refresh();
                      } catch (error) {
                        console.error("Failed to update:", error);
                        alert(
                          `Failed to update: ${
                            error instanceof Error ? error.message : "Unknown error"
                          }`
                        );
                      } finally {
                        setUpdating(false);
                      }
                    }}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Update from GitHub
                  </DropdownMenuItem>
                  {(project.Homepage || project["Live URL"]) && (
                    <DropdownMenuItem
                      onClick={async () => {
                        setUpdating(true);
                        try {
                          await updateOGData(
                            `${project["GitHub Org"]}/${project.Repo}`
                          );
                          await refresh();
                        } catch (error) {
                          console.error("Failed to update OG data:", error);
                          alert(
                            `Failed to update OG data: ${
                              error instanceof Error ? error.message : "Unknown error"
                            }`
                          );
                        } finally {
                          setUpdating(false);
                        }
                      }}
                    >
                      <Globe className="h-4 w-4" />
                      Update Open Graph
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={async () => {
                      const isHidden = project.Hidden === "yes";
                      setUpdating(true);
                      try {
                        await toggleHidden(
                          `${project["GitHub Org"]}/${project.Repo}`,
                          !isHidden
                        );
                        await refresh();
                      } catch (error) {
                        console.error("Failed to toggle hidden:", error);
                        alert(
                          `Failed to toggle hidden: ${
                            error instanceof Error ? error.message : "Unknown error"
                          }`
                        );
                      } finally {
                        setUpdating(false);
                      }
                    }}
                  >
                    {project.Hidden === "yes" ? (
                      <>
                        <Eye className="h-4 w-4" />
                        Show Project
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-4 w-4" />
                        Hide Project
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Project
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <SocialPreview
          org={project["GitHub Org"]}
          repo={project.Repo}
          className="w-full max-w-[640px] border border-border rounded-none aspect-[1200/630]"
        />
      </header>

      {showDeleteConfirm && (
        <section className="border border-red-500 dark:border-red-900 p-4 space-y-3">
          <h2 className="text-red-600 dark:text-red-400 font-semibold">Delete project?</h2>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete {project.Repo}? This removes it from
            the CSV database.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <button
              type="button"
              onClick={async () => {
                setUpdating(true);
                try {
                  await deleteProject(`${project["GitHub Org"]}/${project.Repo}`);
                  navigate("/projects");
                } catch (error) {
                  console.error("Failed to delete project:", error);
                  alert(
                    `Failed to delete project: ${
                      error instanceof Error ? error.message : "Unknown error"
                    }`
                  );
                  setUpdating(false);
                  setShowDeleteConfirm(false);
                }
              }}
              disabled={updating}
              className="text-red-600 dark:text-red-400 underline underline-offset-4 disabled:opacity-50"
            >
              Yes, delete
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={updating}
              className="underline underline-offset-4 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </section>
      )}

      <section className="space-y-8 border-y border-border py-6">
        {(project.Notes || project.Description) && (
          <article className="space-y-2">
            <h2 className="text-2xl font-semibold">About</h2>
            <p className="text-muted-foreground leading-relaxed">
              {project.Description || project.Notes}
            </p>
          </article>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <article className="space-y-3">
            <h3 className="text-xl font-semibold">Tech Stack</h3>
            <dl className="space-y-2 text-sm">
              {project.Framework && (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Framework</dt>
                  <dd>{project.Framework}</dd>
                </div>
              )}
              {project.Styling && (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Styling</dt>
                  <dd>{project.Styling}</dd>
                </div>
              )}
              {project.Backend && project.Backend !== "none" && (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Backend</dt>
                  <dd>{project.Backend}</dd>
                </div>
              )}
              {project.Database && project.Database !== "none" && (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Database</dt>
                  <dd>{project.Database}</dd>
                </div>
              )}
            </dl>
          </article>

          <article className="space-y-3">
            <h3 className="text-xl font-semibold">Stats</h3>
            <dl className="space-y-2 text-sm">
              {project.Stars !== undefined && project.Stars !== "" && (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Stars</dt>
                  <dd className="inline-flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    {project.Stars}
                  </dd>
                </div>
              )}
              {project.Forks !== undefined && project.Forks !== "" && (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Forks</dt>
                  <dd className="inline-flex items-center gap-1">
                    <GitFork className="h-4 w-4" />
                    {project.Forks}
                  </dd>
                </div>
              )}
              {project.Watchers &&
                project.Watchers !== "0" && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Watchers</dt>
                    <dd className="inline-flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {project.Watchers}
                    </dd>
                  </div>
                )}
              {project["Open Issues"] &&
                project["Open Issues"] !== "0" && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Open Issues</dt>
                    <dd className="inline-flex items-center gap-1">
                      <CircleDot className="h-4 w-4" />
                      {project["Open Issues"]}
                    </dd>
                  </div>
                )}
              {project["Last Updated"] && (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Updated</dt>
                  <dd>{new Date(project["Last Updated"]).toLocaleDateString()}</dd>
                </div>
              )}
              {project["Latest Commit Date"] && (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Last Commit</dt>
                  <dd>
                    {new Date(project["Latest Commit Date"]).toLocaleDateString()}
                  </dd>
                </div>
              )}
              {project.Status && (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Status</dt>
                  <dd>
                    <Badge
                      variant={project.Status === "active" ? "default" : "secondary"}
                      className={chipClass}
                    >
                      {project.Status}
                    </Badge>
                  </dd>
                </div>
              )}
            </dl>
          </article>
        </div>

        {(project.PWA === "yes" ||
          project["Has Tests"] === "yes" ||
          project["Has CI/CD"] === "yes" ||
          project["Wallet Integration"] === "yes" ||
          project.Pinned === "yes" ||
          project["Featured Project"] === "yes") && (
          <article className="space-y-3">
            <h3 className="text-xl font-semibold">Features</h3>
            <div className="flex flex-wrap gap-2">
              {project.PWA === "yes" && (
                <Badge variant="outline" className={`flex items-center gap-1 ${chipClass}`}>
                  <Smartphone className="h-3 w-3" />
                  PWA
                </Badge>
              )}
              {project["Has Tests"] === "yes" && (
                <Badge variant="outline" className={`flex items-center gap-1 ${chipClass}`}>
                  <CheckCircle className="h-3 w-3" />
                  Tests
                </Badge>
              )}
              {project["Has CI/CD"] === "yes" && (
                <Badge variant="outline" className={`flex items-center gap-1 ${chipClass}`}>
                  <RefreshCw className="h-3 w-3" />
                  CI/CD
                </Badge>
              )}
              {project["Wallet Integration"] === "yes" && (
                <Badge variant="outline" className={`flex items-center gap-1 ${chipClass}`}>
                  <Wallet className="h-3 w-3" />
                  Web3 Wallet
                </Badge>
              )}
              {project.Pinned === "yes" && (
                <Badge
                  className={`bg-green-500/20 text-green-700 dark:text-green-400 flex items-center gap-1 ${chipClass}`}
                >
                  <Pin className="h-3 w-3" />
                  Pinned
                </Badge>
              )}
              {project["Featured Project"] === "yes" && (
                <Badge
                  className={`bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 flex items-center gap-1 ${chipClass}`}
                >
                  <Star className="h-3 w-3" />
                  Featured
                </Badge>
              )}
            </div>
          </article>
        )}

        {project.Topics && (
          <article className="space-y-3">
            <h3 className="text-xl font-semibold">Topics</h3>
            <div className="flex flex-wrap gap-2">
              {project.Topics.split(",").map((topic) => (
                <Badge key={topic} variant="outline" className={chipClass}>
                  {topic.trim()}
                </Badge>
              ))}
            </div>
          </article>
        )}

        {!project.Topics && project["Key Tags"] && (
          <article className="space-y-3">
            <h3 className="text-xl font-semibold">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {project["Key Tags"].split(",").map((tag) => (
                <Badge key={tag} variant="secondary" className={chipClass}>
                  {tag.trim()}
                </Badge>
              ))}
            </div>
          </article>
        )}

        {project.Blockchain && project.Blockchain !== "none" && (
          <article className="space-y-3">
            <h3 className="text-xl font-semibold">Web3 / Blockchain</h3>
            <p className="text-sm text-muted-foreground">
              Blockchain: <span className="text-foreground">{project.Blockchain}</span>
            </p>
            {project["Wallet Integration"] === "yes" && (
              <p className="text-sm text-muted-foreground">
                Includes wallet integration for decentralized transactions.
              </p>
            )}
          </article>
        )}

        {(project.License || project.Homepage || project["NPM Package URL"]) && (
          <article className="space-y-3">
            <h3 className="text-xl font-semibold">Links</h3>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              {project.License && (
                <Badge variant="outline" className={chipClass}>
                  {project.License}
                </Badge>
              )}
              {project.Homepage && !project["NPM Package URL"] && (
                <a
                  href={project.Homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 underline underline-offset-4"
                >
                  <ExternalLink className="h-4 w-4" />
                  Website
                </a>
              )}
              {project["NPM Package URL"] && (
                <a
                  href={project["NPM Package URL"]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 underline underline-offset-4"
                >
                  <Package className="h-4 w-4" />
                  NPM package
                </a>
              )}
            </div>
          </article>
        )}
      </section>

      {(project["Latest Commit Message"] ||
        project["OG Title"] ||
        project["OG Description"] ||
        project["OG Image"]) && (
        <section className="space-y-8 border-y border-border py-6">
          {project["Latest Commit Message"] && (
            <article className="space-y-2">
              <h2 className="text-2xl font-semibold">Latest Commit</h2>
              {(project["Latest Commit Author"] || project["Latest Commit Date"]) && (
                <p className="text-sm text-muted-foreground">
                  {project["Latest Commit Author"] && `by ${project["Latest Commit Author"]}`}
                  {project["Latest Commit Date"] &&
                    ` on ${new Date(project["Latest Commit Date"]).toLocaleDateString()}`}
                </p>
              )}
              <p className="font-mono text-sm whitespace-pre-wrap">
                {project["Latest Commit Message"]}
              </p>
            </article>
          )}

          {(project["OG Title"] || project["OG Description"] || project["OG Image"]) && (
            <article className="space-y-3">
              <h2 className="text-2xl font-semibold">Live Site Preview</h2>
              {project["OG Site Name"] && (
                <p className="text-sm text-muted-foreground">{project["OG Site Name"]}</p>
              )}
              {project["OG Image"] && (
                <div className="border border-border rounded-none overflow-hidden">
                  <img
                    src={project["OG Image"]}
                    alt={project["OG Title"] || "Site preview"}
                    className="w-full h-auto"
                  />
                </div>
              )}
              {project["OG Title"] && (
                <h3 className="text-lg font-semibold">{project["OG Title"]}</h3>
              )}
              {project["OG Description"] && (
                <p className="text-muted-foreground">{project["OG Description"]}</p>
              )}
              {project["OG URL"] && (
                <a
                  href={project["OG URL"]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm underline underline-offset-4"
                >
                  {project.Favicon ? (
                    <img
                      src={project.Favicon}
                      alt=""
                      className="w-4 h-4 rounded-none"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <Globe className="h-4 w-4" />
                  )}
                  {project["OG URL"]}
                </a>
              )}
              {project["OG Type"] && (
                <Badge variant="secondary" className={chipClass}>
                  {project["OG Type"]}
                </Badge>
              )}
            </article>
          )}
        </section>
      )}

      <section className="space-y-4 border-y border-border py-6">
        <h2 className="text-2xl font-semibold">README</h2>
        {readmeLoading && <p className="text-muted-foreground">Loading README...</p>}
        {readmeError && <p className="text-muted-foreground">Failed to load README.</p>}
        {readmeContent && !readmeLoading && (
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{readmeContent}</ReactMarkdown>
          </div>
        )}
      </section>
    </div>
  );
};
