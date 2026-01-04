import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useProjects } from "@/hooks/useProjects";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SocialPreview } from "@/components/SocialPreview";
import { RefreshCw } from "lucide-react";
import { updateGitHubData } from "@/lib/api";

export const Projects = () => {
  const { projects, loading, refresh } = useProjects();
  const [selectedOrg, setSelectedOrg] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showResumeWorthy, setShowResumeWorthy] = useState(false);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesOrg =
        selectedOrg === "all" || project["GitHub Org"] === selectedOrg;
      const matchesType =
        selectedType === "all" || project["Project Type"] === selectedType;
      const matchesSearch =
        searchTerm === "" ||
        project.Repo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.Description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.Notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.Topics?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project["Key Tags"]?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesResumeWorthy =
        !showResumeWorthy || project["Resume Worthy"] === "yes";

      return matchesOrg && matchesType && matchesSearch && matchesResumeWorthy;
    });
  }, [projects, selectedOrg, selectedType, searchTerm, showResumeWorthy]);

  const orgs = ["all", "whaleen", "nothingdao", "orthfx", "boringprotocol"];
  const types = ["all", "app", "library", "tool", "game", "website"];

  // Update button component
  const UpdateButton = ({ org, repo }: { org: string; repo: string }) => {
    const [updating, setUpdating] = useState(false);

    const handleUpdate = async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setUpdating(true);
      try {
        await updateGitHubData(`${org}/${repo}`);
        // Refresh projects data
        await refresh();
      } catch (error) {
        console.error('Failed to update:', error);
        alert(`Failed to update: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setUpdating(false);
      }
    };

    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleUpdate}
        disabled={updating}
        className="px-2"
        title="Update from GitHub"
      >
        <RefreshCw className={`h-4 w-4 ${updating ? 'animate-spin' : ''}`} />
      </Button>
    );
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-5xl font-bold">All Projects</h1>
        <p className="text-xl text-muted-foreground">
          {filteredProjects.length} of {projects.length} repositories
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Projects</CardTitle>
          <CardDescription>Narrow down by organization, type, or search</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Organization</label>
              <select
                value={selectedOrg}
                onChange={(e) => setSelectedOrg(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {orgs.map((org) => (
                  <option key={org} value={org}>
                    {org === "all" ? "All Organizations" : org}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Project Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type === "all" ? "All Types" : type}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showResumeWorthy}
                  onChange={(e) => setShowResumeWorthy(e.target.checked)}
                  className="w-4 h-4 rounded border-input"
                />
                <span className="text-sm font-medium">Resume Worthy Only</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Link
              key={project.Repo}
              to={`/projects/${project["GitHub Org"]}/${project.Repo}`}
              className="block"
            >
              <Card className="hover:shadow-lg transition-shadow overflow-hidden h-full">
                <SocialPreview
                  org={project["GitHub Org"]}
                  repo={project.Repo}
                  className="h-48 rounded-t-lg"
                />
                <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {project.Favicon && (
                      <img
                        src={project.Favicon}
                        alt=""
                        className="w-5 h-5 rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <CardTitle className="text-lg">{project.Repo}</CardTitle>
                  </div>
                  {(project["Primary Language"] || project.Language) && (
                    <Badge variant="secondary" className="whitespace-nowrap">
                      {project["Primary Language"] || project.Language}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="outline">{project["GitHub Org"]}</Badge>
                  {project["Project Type"] && (
                    <Badge variant="outline">{project["Project Type"]}</Badge>
                  )}
                  {project["Featured Project"] === "yes" && (
                    <Badge className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/30">
                      ⭐ Featured
                    </Badge>
                  )}
                  {project.PWA === "yes" && (
                    <Badge variant="outline">PWA</Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {(project.Description || project.Notes) && (
                  <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                    {project.Description || project.Notes}
                  </CardDescription>
                )}

                {/* Show GitHub Topics first, fallback to Key Tags */}
                {(project.Topics || project["Key Tags"]) && (
                  <div className="flex flex-wrap gap-1">
                    {(project.Topics || project["Key Tags"] || "")
                      .split(",")
                      .filter(tag => tag.trim())
                      .slice(0, 4)
                      .map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag.trim()}
                        </Badge>
                      ))}
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="flex-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <a
                    href={`https://github.com/${project["GitHub Org"]}/${project.Repo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Code
                  </a>
                </Button>
                {(project.Homepage || project["Live URL"]) && (
                  <Button
                    size="sm"
                    asChild
                    className="flex-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <a
                      href={project.Homepage || project["Live URL"]}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Demo
                    </a>
                  </Button>
                )}
                <UpdateButton
                  org={project["GitHub Org"]}
                  repo={project.Repo}
                />
              </CardFooter>
            </Card>
            </Link>
          ))}
        </div>
      )}

      {filteredProjects.length === 0 && !loading && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No projects found matching your filters. Try adjusting your search criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
