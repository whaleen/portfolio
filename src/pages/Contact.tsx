import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Contact = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-16">
      <div className="space-y-4 text-center">
        <div className="flex justify-center mb-6">
          <img
            src="/pfp.png"
            alt="Joshua Vaage"
            className="w-32 h-32 rounded-full border-4 border-border shadow-lg"
          />
        </div>
        <h1 className="text-5xl font-bold">Get In Touch</h1>
        <p className="text-2xl text-muted-foreground">
          Feel free to reach out for opportunities, collaborations, or just to say hi
        </p>
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Phone</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="link" asChild className="p-0 h-auto text-lg">
              <a href="tel:9162046014">916 204 6014</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Location</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">PST (Pacific Standard Time)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">GitHub</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="link" asChild className="p-0 h-auto text-lg">
              <a
                href="https://github.com/whaleen"
                target="_blank"
                rel="noopener noreferrer"
              >
                @whaleen
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">X / Twitter</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="link" asChild className="p-0 h-auto text-lg">
              <a
                href="https://x.com/4A_6F_73_68"
                target="_blank"
                rel="noopener noreferrer"
              >
                @4A_6F_73_68
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Organizations */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-center">Organizations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="https://github.com/nothingdao"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-border rounded-lg p-4 hover:border-primary transition-colors text-center"
          >
            <h3 className="font-semibold">nothingdao</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Web3 & Solana Tools
            </p>
          </a>

          <a
            href="https://github.com/orthfx"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-border rounded-lg p-4 hover:border-primary transition-colors text-center"
          >
            <h3 className="font-semibold">orthfx</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Orthodox Christian Resources
            </p>
          </a>

          <a
            href="https://github.com/boringprotocol"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-border rounded-lg p-4 hover:border-primary transition-colors text-center"
          >
            <h3 className="font-semibold">Boring Protocol</h3>
            <p className="text-sm text-muted-foreground mt-1">
            Decentralized VPN on Solana
            </p>
          </a>
        </div>
      </div>

      {/* CTA */}
      <Card className="border-primary/50">
        <CardContent className="pt-6 text-center space-y-4">
          <h2 className="text-3xl font-bold">Looking for opportunities</h2>
          <p className="text-lg text-muted-foreground">
            Open to full-time positions, contract work, and collaborations in Web3,
            React/TypeScript, and developer tooling.
          </p>
          <div className="pt-4">
            <Button size="lg" asChild>
              <a href="tel:9162046014">
                Call Me: 916 204 6014
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
