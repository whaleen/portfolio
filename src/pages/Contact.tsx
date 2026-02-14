export const Contact = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-12">
      <header className="space-y-4 pt-10">
        <h1 className="text-5xl font-semibold tracking-tight">Contact</h1>
        <p className="text-xl text-muted-foreground">
          For work inquiries, message me on Telegram or X.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Reach Me</h2>
        <dl className="divide-y divide-border border-y border-border">
          <div className="py-4 grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2">
            <dt className="font-medium">Telegram (preferred)</dt>
            <dd>
              <a
                href="https://t.me/jvaage"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
              >
                @jvaage
              </a>
            </dd>
          </div>
          <div className="py-4 grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2">
            <dt className="font-medium">X</dt>
            <dd>
              <a
                href="https://x.com/4A_6F_73_68"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
              >
                @4A_6F_73_68
              </a>
            </dd>
          </div>
          <div className="py-4 grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2">
            <dt className="font-medium">GitHub</dt>
            <dd>
              <a
                href="https://github.com/whaleen"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
              >
                @whaleen
              </a>
            </dd>
          </div>
          <div className="py-4 grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2">
            <dt className="font-medium">Timezone</dt>
            <dd className="text-muted-foreground">PST (Pacific Standard Time)</dd>
          </div>
        </dl>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Organizations</h2>
        <ul className="divide-y divide-border border-y border-border">
          <li className="py-4">
            <a
              href="https://github.com/nothingdao"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              nothingdao
            </a>
            <p className="text-sm text-muted-foreground">Web3 and Solana tools</p>
          </li>
          <li className="py-4">
            <a
              href="https://github.com/orthfx"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              orthfx
            </a>
            <p className="text-sm text-muted-foreground">
              Orthodox Christian resources
            </p>
          </li>
          <li className="py-4">
            <a
              href="https://github.com/boringprotocol"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              boringprotocol
            </a>
            <p className="text-sm text-muted-foreground">
              Decentralized VPN infrastructure
            </p>
          </li>
        </ul>
      </section>

      <section className="space-y-3 pb-4">
        <h2 className="text-2xl font-semibold">Work</h2>
        <p className="text-muted-foreground">
          I am available for full-time roles, contract work, and project
          collaborations in product engineering, React/TypeScript, developer
          tooling, and Web3/Solana.
        </p>
      </section>
    </div>
  );
};
