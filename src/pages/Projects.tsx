import { useState, useMemo, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useProjects } from "@/hooks/useProjects";
import { RefreshCw } from "lucide-react";
import { updateGitHubData } from "@/lib/api";
import { SocialPreview } from "@/components/SocialPreview";
import { hasSocialPreview } from "@/lib/socialPreview";

export const Projects = () => {
  const { org: orgParam } = useParams<{ org?: string }>();
  const navigate = useNavigate();
  const { projects, loading, refresh } = useProjects();
  const isDev = import.meta.env.DEV;
  const [selectedOrg, setSelectedOrg] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  useEffect(() => {
    if (orgParam) {
      setSelectedOrg(orgParam);
      return;
    }
    setSelectedOrg("all");
  }, [orgParam]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesOrg =
        selectedOrg === "all" || project["GitHub Org"] === selectedOrg;
      const matchesType =
        selectedType === "all" || project["Project Type"] === selectedType;
      const notHidden = project.Hidden !== "yes";

      return matchesOrg && matchesType && notHidden;
    });
  }, [projects, selectedOrg, selectedType]);

  const orgs = ["all", "whaleen", "nothingdao", "orthfx", "boringprotocol"];
  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    projects.forEach((project) => {
      const matchesOrg =
        selectedOrg === "all" || project["GitHub Org"] === selectedOrg;
      const notHidden = project.Hidden !== "yes";
      if (matchesOrg && notHidden && project["Project Type"]) {
        types.add(project["Project Type"]);
      }
    });

    return Array.from(types).sort((a, b) => a.localeCompare(b));
  }, [projects, selectedOrg]);

  useEffect(() => {
    if (!availableTypes.includes(selectedType)) {
      setSelectedType("all");
    }
  }, [availableTypes, selectedType]);

  const UpdateLink = ({ org, repo }: { org: string; repo: string }) => {
    const [updating, setUpdating] = useState(false);

    const handleUpdate = async (e: React.MouseEvent) => {
      e.preventDefault();
      setUpdating(true);
      try {
        await updateGitHubData(`${org}/${repo}`);
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
    };

    return (
      <button
        type="button"
        onClick={handleUpdate}
        disabled={updating}
        className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground disabled:opacity-50"
        title="Refresh from GitHub"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${updating ? "animate-spin" : ""}`} />
        <span className="text-sm">refresh</span>
      </button>
    );
  };

  const pageTitle = selectedOrg === "all" ? "Projects" : `${selectedOrg} Projects`;

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <header className="space-y-3 pt-10">
        <h1 className="text-5xl font-semibold tracking-tight">{pageTitle}</h1>
        <p className="text-muted-foreground">
          {filteredProjects.length} repositories
          {selectedOrg !== "all" && ` · ${projects.length} total in dataset`}
        </p>
      </header>

      <section className="space-y-4 border-y border-border py-5">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-base">
            <span className="text-muted-foreground">Org</span>
            <span className="text-muted-foreground">|</span>
            {orgs.map((org, index) => {
              const active = selectedOrg === org;
              return (
                <span key={org} className="inline-flex items-center gap-2">
                  {index > 0 && <span className="text-muted-foreground">·</span>}
                  <button
                    type="button"
                    onClick={() => {
                      if (org === "all") {
                        navigate("/projects");
                      } else {
                        navigate(`/projects/${org}`);
                      }
                    }}
                    className={
                      active
                        ? "text-foreground underline underline-offset-4"
                        : "text-muted-foreground hover:text-foreground"
                    }
                  >
                    {org === "all" ? "All projects" : org}
                  </button>
                </span>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">Type</span>
            <span className="text-muted-foreground">|</span>
            {availableTypes.map((type, index) => {
              const active = selectedType === type;
              return (
                <span key={type} className="inline-flex items-center gap-2">
                  {index > 0 && <span className="text-muted-foreground">·</span>}
                  <button
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={
                      active
                        ? "text-foreground underline underline-offset-4"
                        : "text-muted-foreground hover:text-foreground"
                    }
                  >
                    {type}
                  </button>
                </span>
              );
            })}
            {selectedType !== "all" && (
              <span className="inline-flex items-center gap-2">
                <span className="text-muted-foreground">·</span>
                <button
                  type="button"
                  onClick={() => setSelectedType("all")}
                  className="text-muted-foreground hover:text-foreground underline underline-offset-4"
                >
                  Clear
                </button>
              </span>
            )}
          </div>
        </div>
      </section>

      {loading ? (
        <p className="text-muted-foreground">Loading projects...</p>
      ) : filteredProjects.length === 0 ? (
        <p className="text-muted-foreground">
          No projects match the current filters.
        </p>
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {filteredProjects.map((project) => {
            const externalUrl =
              project["NPM Package URL"] ||
              project.Homepage ||
              project["Live URL"] ||
              "";

            return (
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
                      {project["Project Type"] && ` · ${project["Project Type"]}`}
                      {(project["Primary Language"] || project.Language) &&
                        ` · ${project["Primary Language"] || project.Language}`}
                      {project.Pinned === "yes" && " · pinned"}
                    </p>
                  </div>

                  {(project.Description || project.Notes) && (
                    <p className="text-muted-foreground leading-relaxed">
                      {project.Description || project.Notes}
                    </p>
                  )}

                  {(project.Topics || project["Key Tags"]) && (
                    <p className="text-sm text-muted-foreground">
                      {(project.Topics || project["Key Tags"] || "")
                        .split(",")
                        .filter((tag) => tag.trim())
                        .slice(0, 5)
                        .join(" · ")}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-sm">
                    <a
                      href={`https://github.com/${project["GitHub Org"]}/${project.Repo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4"
                    >
                      Code
                    </a>
                    {externalUrl && (
                      <a
                        href={externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-4"
                      >
                        {project["NPM Package URL"] ? "NPM" : "Live"}
                      </a>
                    )}
                    {isDev && (
                      <UpdateLink org={project["GitHub Org"]} repo={project.Repo} />
                    )}
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
