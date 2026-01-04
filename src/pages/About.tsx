import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const About = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-16">
      <div className="space-y-4 text-center">
        <div className="flex justify-center mb-6">
          <img
            src="/pfp.png"
            alt="Joshua Vaage"
            className="w-32 h-32 rounded-full border-4 border-border shadow-lg"
          />
        </div>
        <h1 className="text-5xl font-bold">About Me</h1>
        <p className="text-2xl text-muted-foreground">
          Full-stack developer specializing in Web3/Solana development
        </p>
      </div>

      {/* Summary */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Summary</h2>
        <p className="text-muted-foreground">
          Full-stack developer specializing in Web3/Solana development with a
          focus on React, TypeScript, and decentralized applications. Builder of
          developer tools, AI workflow systems, and blockchain-integrated
          applications. Active contributor to the Solana ecosystem with multiple
          open-source projects.
        </p>
      </section>

      {/* Tech Skills */}
      <section className="space-y-8">
        <h2 className="text-3xl font-semibold text-center">Technical Skills</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Frontend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge>React</Badge>
                <Badge>Next.js</Badge>
                <Badge>Vite</Badge>
                <Badge>TypeScript</Badge>
                <Badge>JavaScript</Badge>
                <Badge>Tailwind CSS</Badge>
                <Badge>shadcn/ui</Badge>
                <Badge>DaisyUI</Badge>
                <Badge>Mobile-first</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Blockchain/Web3</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge>Solana</Badge>
                <Badge>Web3.js</Badge>
                <Badge>Wallet Adapters</Badge>
                <Badge>Smart Contracts</Badge>
                <Badge>NFT platforms</Badge>
                <Badge>Token economics</Badge>
                <Badge>Phantom</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Backend & Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge>Node.js</Badge>
                <Badge>PostgreSQL</Badge>
                <Badge>Git</Badge>
                <Badge>GitHub Actions</Badge>
                <Badge>CLI Development</Badge>
                <Badge>AI/LLM</Badge>
                <Badge>Helius SDK</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Other</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge>Python</Badge>
                <Badge>Rust</Badge>
                <Badge>Tauri</Badge>
                <Badge>Jekyll</Badge>
                <Badge>11ty</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Organizations */}
      <section className="space-y-8">
        <h2 className="text-3xl font-semibold text-center">Organizations</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>nothingdao</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Web3, Solana Development - Building tools for the Solana ecosystem
              </p>
              <Button variant="outline" asChild className="w-full">
                <a
                  href="https://github.com/nothingdao"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on GitHub
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>orthfx</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Orthodox Christian digital resources - Building PWAs for prayer and scripture
              </p>
              <Button variant="outline" asChild className="w-full">
                <a
                  href="https://github.com/orthfx"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on GitHub
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>boringprotocol</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Decentralized VPN on Solana - Contributing to Web3 infrastructure
              </p>
              <Button variant="outline" asChild className="w-full">
                <a
                  href="https://github.com/boringprotocol"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on GitHub
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Education */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Education & Background</h2>
        <p className="text-muted-foreground">
          Self-taught developer with extensive experience in full-stack web
          development, blockchain integration, and developer tooling. Strong
          focus on building practical, user-facing applications that solve real
          problems.
        </p>
      </section>

      {/* Interests */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Interests</h2>
        <p className="text-muted-foreground">
          Web3 infrastructure, decentralized applications, developer experience,
          AI-assisted development workflows, game development, religious/spiritual
          technology applications
        </p>
      </section>
    </div>
  );
};
