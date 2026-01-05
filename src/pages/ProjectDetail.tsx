import { useParams, Link, Navigate } from "react-router-dom";
import { useProjects } from "@/hooks/useProjects";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SocialPreview } from "@/components/SocialPreview";
import { ArrowLeft, ExternalLink, Github, Globe, RefreshCw, Star, GitFork, Eye, EyeOff, CircleDot, Smartphone, CheckCircle, Wallet, Briefcase, Settings } from "lucide-react";
import { updateGitHubData, updateOGData, toggleHidden } from "@/lib/api";
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
  const { projects, loading, refresh } = useProjects();
  const [updating, setUpdating] = useState(false);
  const [readmeContent, setReadmeContent] = useState<string | null>(null);
  const [readmeLoading, setReadmeLoading] = useState(false);
  const [readmeError, setReadmeError] = useState(false);

  // Only show settings in development
  const isDev = import.meta.env.DEV;

  const project = projects.find(
    (p) => p["GitHub Org"] === org && p.Repo === repo
  );

  // Fetch README content if available
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
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  const backUrl = org ? `/projects/${org}` : "/projects";

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Button variant="ghost" asChild>
        <Link to={backUrl}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {org} Projects
        </Link>
      </Button>

      {/* Hero Section */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {project.Favicon && (
                <img
                  src={project.Favicon}
                  alt=""
                  className="w-12 h-12 rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              <h1 className="text-5xl font-bold">{project.Repo}</h1>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Badge variant="outline">{project["GitHub Org"]}</Badge>
              {(project["Primary Language"] || project.Language) && (
                <Badge variant="secondary">{project["Primary Language"] || project.Language}</Badge>
              )}
              {project["Project Type"] && (
                <Badge variant="outline">{project["Project Type"]}</Badge>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <a
                href={`https://github.com/${project["GitHub Org"]}/${project.Repo}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </a>
            </Button>
            {(project.Homepage || project["Live URL"]) && (
              <Button asChild>
                <a
                  href={project.Homepage || project["Live URL"]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Globe className="mr-2 h-4 w-4" />
                  Live Demo
                </a>
              </Button>
            )}
            {isDev && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" disabled={updating}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={async () => {
                      setUpdating(true);
                      try {
                        await updateGitHubData(`${project["GitHub Org"]}/${project.Repo}`);
                        await refresh();
                      } catch (error) {
                        console.error('Failed to update:', error);
                        alert(`Failed to update: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
                          await updateOGData(`${project["GitHub Org"]}/${project.Repo}`);
                          await refresh();
                        } catch (error) {
                          console.error('Failed to update OG data:', error);
                          alert(`Failed to update OG data: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
                        await toggleHidden(`${project["GitHub Org"]}/${project.Repo}`, !isHidden);
                        await refresh();
                      } catch (error) {
                        console.error('Failed to toggle hidden:', error);
                        alert(`Failed to toggle hidden: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Social Preview */}
        <SocialPreview
          org={project["GitHub Org"]}
          repo={project.Repo}
          className="h-96 rounded-lg"
        />
      </div>

      {/* Project Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Description */}
        {(project.Notes || project.Description) && (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">
                {project.Description || project.Notes}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Tech Stack */}
        <Card>
          <CardHeader>
            <CardTitle>Tech Stack</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {project.Framework && (
              <div>
                <p className="text-sm text-muted-foreground">Framework</p>
                <p className="font-medium">{project.Framework}</p>
              </div>
            )}
            {project.Styling && (
              <div>
                <p className="text-sm text-muted-foreground">Styling</p>
                <p className="font-medium">{project.Styling}</p>
              </div>
            )}
            {project.Backend && project.Backend !== "none" && (
              <div>
                <p className="text-sm text-muted-foreground">Backend</p>
                <p className="font-medium">{project.Backend}</p>
              </div>
            )}
            {project.Database && project.Database !== "none" && (
              <div>
                <p className="text-sm text-muted-foreground">Database</p>
                <p className="font-medium">{project.Database}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {project.Stars !== undefined && project.Stars !== "" && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stars</span>
                <span className="font-medium flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  {project.Stars}
                </span>
              </div>
            )}
            {project.Forks !== undefined && project.Forks !== "" && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Forks</span>
                <span className="font-medium flex items-center gap-1">
                  <GitFork className="h-4 w-4" />
                  {project.Forks}
                </span>
              </div>
            )}
            {project.Watchers !== undefined && project.Watchers !== "" && project.Watchers !== "0" && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Watchers</span>
                <span className="font-medium flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {project.Watchers}
                </span>
              </div>
            )}
            {project["Open Issues"] !== undefined && project["Open Issues"] !== "" && project["Open Issues"] !== "0" && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Open Issues</span>
                <span className="font-medium flex items-center gap-1">
                  <CircleDot className="h-4 w-4" />
                  {project["Open Issues"]}
                </span>
              </div>
            )}
            {project["Last Updated"] && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Updated</span>
                <span className="font-medium text-sm">
                  {new Date(project["Last Updated"]).toLocaleDateString()}
                </span>
              </div>
            )}
            {project.Status && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={project.Status === "active" ? "default" : "secondary"}>
                  {project.Status}
                </Badge>
              </div>
            )}
            {project["Latest Commit Date"] && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Commit</span>
                <span className="font-medium text-sm">
                  {new Date(project["Latest Commit Date"]).toLocaleDateString()}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Latest Commit Message */}
        {project["Latest Commit Message"] && (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Latest Commit</CardTitle>
              {project["Latest Commit Author"] && (
                <CardDescription>
                  by {project["Latest Commit Author"]}
                  {project["Latest Commit Date"] && (
                    <> on {new Date(project["Latest Commit Date"]).toLocaleDateString()}</>
                  )}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <p className="font-mono text-sm whitespace-pre-wrap">
                {project["Latest Commit Message"]}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Open Graph Data */}
        {(project["OG Title"] || project["OG Description"] || project["OG Image"]) && (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Live Site Preview</CardTitle>
              {project["OG Site Name"] && (
                <CardDescription>{project["OG Site Name"]}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {project["OG Image"] && (
                <div className="rounded-lg overflow-hidden border">
                  <img
                    src={project["OG Image"]}
                    alt={project["OG Title"] || "Site preview"}
                    className="w-full h-auto"
                  />
                </div>
              )}
              <div className="space-y-2">
                {project["OG Title"] && (
                  <h3 className="text-lg font-semibold">{project["OG Title"]}</h3>
                )}
                {project["OG Description"] && (
                  <p className="text-muted-foreground">{project["OG Description"]}</p>
                )}
                {project["OG URL"] && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {project.Favicon ? (
                      <img
                        src={project.Favicon}
                        alt=""
                        className="w-4 h-4 rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <Globe className="h-4 w-4" />
                    )}
                    <a
                      href={project["OG URL"]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {project["OG URL"]}
                    </a>
                  </div>
                )}
                {project["OG Type"] && (
                  <Badge variant="secondary">{project["OG Type"]}</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {project.PWA === "yes" && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Smartphone className="h-3 w-3" />
                PWA
              </Badge>
            )}
            {project["Has Tests"] === "yes" && (
              <Badge variant="outline" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Tests
              </Badge>
            )}
            {project["Has CI/CD"] === "yes" && (
              <Badge variant="outline" className="flex items-center gap-1">
                <RefreshCw className="h-3 w-3" />
                CI/CD
              </Badge>
            )}
            {project["Wallet Integration"] === "yes" && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Wallet className="h-3 w-3" />
                Web3 Wallet
              </Badge>
            )}
            {project["Resume Worthy"] === "yes" && (
              <Badge className="bg-green-500/20 text-green-700 dark:text-green-400 flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                Resume Worthy
              </Badge>
            )}
            {project["Featured Project"] === "yes" && (
              <Badge className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 flex items-center gap-1">
                <Star className="h-3 w-3" />
                Featured
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* GitHub Topics (preferred over Key Tags) */}
        {project.Topics && (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.Topics.split(",").map((topic) => (
                  <Badge key={topic} variant="outline">
                    {topic.trim()}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Key Tags (fallback if no Topics) */}
        {!project.Topics && project["Key Tags"] && (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project["Key Tags"].split(",").map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag.trim()}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Blockchain */}
        {project.Blockchain && project.Blockchain !== "none" && (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Web3 / Blockchain</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Blockchain</p>
                <p className="font-medium">{project.Blockchain}</p>
              </div>
              {project["Wallet Integration"] === "yes" && (
                <p className="text-sm text-muted-foreground">
                  Includes wallet integration for decentralized transactions
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* License */}
        {project.License && (
          <Card>
            <CardHeader>
              <CardTitle>License</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline">{project.License}</Badge>
            </CardContent>
          </Card>
        )}

        {/* Links */}
        {project.Homepage && (
          <Card>
            <CardHeader>
              <CardTitle>Homepage</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" asChild className="w-full">
                <a
                  href={project.Homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Visit Website
                </a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* README Section */}
      {readmeLoading && (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading README...</p>
          </CardContent>
        </Card>
      )}

      {readmeError && (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Failed to load README</p>
          </CardContent>
        </Card>
      )}

      {readmeContent && !readmeLoading && (
        <Card>
          <CardHeader>
            <CardTitle>README</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {readmeContent}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
