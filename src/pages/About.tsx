export const About = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-14">
      <header className="space-y-4 pt-10">
        <h1 className="text-5xl font-semibold tracking-tight">About</h1>
        <p className="text-xl text-muted-foreground">
          Full-stack developer with strong Web3/Solana experience.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Summary</h2>
        <p className="text-muted-foreground leading-8">
          I build production software with a focus on React, TypeScript,
          developer tooling, and practical product delivery. A substantial part
          of my work has been in decentralized apps and the Solana ecosystem,
          but my core approach is product engineering across the stack.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Technical Focus</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold">Frontend</h3>
            <p className="text-muted-foreground">
              React, Next.js, Vite, TypeScript, JavaScript, Tailwind CSS
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Backend and Tooling</h3>
            <p className="text-muted-foreground">
              Node.js, PostgreSQL, GitHub Actions, CLI development, AI/LLM tools
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Web3</h3>
            <p className="text-muted-foreground">
              Solana, Web3.js, wallet adapters, smart contract integration
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Additional Stack</h3>
            <p className="text-muted-foreground">
              Python, Rust, Tauri, Jekyll, 11ty
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Organizations</h2>
        <ul className="divide-y divide-border border-y border-border">
          <li className="py-4">
            <p className="font-medium">nothingdao</p>
            <p className="text-sm text-muted-foreground">
              Web3 and Solana product work
            </p>
          </li>
          <li className="py-4">
            <p className="font-medium">orthfx</p>
            <p className="text-sm text-muted-foreground">
              Orthodox Christian digital resources and PWAs
            </p>
          </li>
          <li className="py-4">
            <p className="font-medium">boringprotocol</p>
            <p className="text-sm text-muted-foreground">
              Decentralized VPN and network tooling
            </p>
          </li>
        </ul>
      </section>

      <section className="space-y-3 pb-4">
        <h2 className="text-2xl font-semibold">Working Style</h2>
        <p className="text-muted-foreground leading-8">
          I prefer clear requirements, direct communication, and iterative
          delivery. I focus on maintainable code, useful documentation, and
          reliable product behavior.
        </p>
      </section>
    </div>
  );
};
