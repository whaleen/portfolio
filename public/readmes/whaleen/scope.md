# Scope

To run the Scope, first install the npm dependencies:

```bash
pnpm install
```

Next, run the development server:

```bash
pnpm run dev
```

Finally, open [http://localhost:3000](http://localhost:3000) in your browser to view the website.

graph TD
A[Next.js App]
B[NextAuth.js]
C[Supabase Database]
D[Twilio (SMS)]
E[SendGrid (Email)]
F[Nex Health API]
G[Appointment Data]
H[Providers & Institutions]
I[Patients]

    %% Authentication
    A -->|Uses| B
    B -->|Authenticates| H
    B -->|Authenticates| I

    %% Data Storage
    A -->|Stores Data| C
    C -->|Holds Appointment Data| G

    %% Data Flow from Nex Health
    F -->|Fetch Daily Data| G
    G -->|Data for Communication| A

    %% Communication Flow
    A -->|Sends SMS| D
    A -->|Sends Email| E

    %% Interaction for Follow-up
    G -->|For Follow-up Actions| A
    A -->|Communicates with Providers & Patients| H
    A -->|Communicates with Patients| I
