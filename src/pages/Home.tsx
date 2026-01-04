import { useFeaturedProjects } from "@/hooks/useProjects";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SocialPreview } from "@/components/SocialPreview";

export const Home = () => {
  const { projects, loading } = useFeaturedProjects();

  return (
    <>
      {/* Fixed Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-10 dark:opacity-5 pointer-events-none"
        style={{ backgroundImage: 'url(/josh.png)' }}
      />

      <div className="relative z-10 space-y-24">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-20">
        <div className="space-y-4">
          <div className="flex justify-center mb-6">
            <img
              src="/pfp.png"
              alt="Joshua Vaage"
              className="w-32 h-32 rounded-full border-4 border-border shadow-lg"
            />
          </div>
          <h1 className="text-6xl font-bold tracking-tight">Joshua Vaage</h1>
          <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Full-stack developer specializing in Web3/Solana development. Builder
            of developer tools, AI workflow systems, and blockchain-integrated
            applications.
          </p>
        </div>
        <div className="flex gap-6 justify-center pt-6">
          <Button variant="outline" asChild>
            <a
              href="https://github.com/whaleen"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a
              href="https://x.com/4A_6F_73_68"
              target="_blank"
              rel="noopener noreferrer"
            >
              X / Twitter
            </a>
          </Button>
          <Button asChild>
            <Link to="/contact">
              Contact Me
            </Link>
          </Button>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-bold">Featured Projects</h2>
          <p className="text-lg text-muted-foreground">
            Highlighting my best work across Web3, AI tooling, and PWAs
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
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
                    <CardTitle className="text-xl">{project.Repo}</CardTitle>
                    {(project["Primary Language"] || project.Language) && (
                      <Badge variant="secondary">{project["Primary Language"] || project.Language}</Badge>
                    )}
                  </div>
                  <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                    {project.Description || project.Notes}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(project.Topics || project["Key Tags"] || "")
                      .split(",")
                      .filter(tag => tag.trim())
                      .slice(0, 3)
                      .map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag.trim()}
                        </Badge>
                      ))}
                  </div>
                </CardContent>
                <CardFooter className="flex gap-3">
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
                </CardFooter>
              </Card>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center pt-4">
          <Button variant="link" asChild size="lg">
            <Link to="/projects">
              View all projects ({projects.length}) →
            </Link>
          </Button>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center">Tech Stack</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Frontend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <Badge>React</Badge>
                <Badge>Next.js</Badge>
                <Badge>Vite</Badge>
                <Badge>TypeScript</Badge>
                <Badge>Tailwind CSS</Badge>
                <Badge>shadcn/ui</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Web3 / Blockchain</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <Badge>Solana</Badge>
                <Badge>Web3.js</Badge>
                <Badge>Wallet Adapters</Badge>
                <Badge>NFT platforms</Badge>
                <Badge>Token economics</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Backend & Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <Badge>Node.js</Badge>
                <Badge>PostgreSQL</Badge>
                <Badge>Python</Badge>
                <Badge>Rust</Badge>
                <Badge>AI/LLM</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      </div>
    </>
  );
};
