export interface Project {
  Repo: string;
  Language: string;
  "Last Updated": string;
  "GitHub Org": string;
  Local: string;
  Updated: string;
  Status: string;
  "Live URL": string;
  "Deployment Platform": string;
  PWA: string;
  Framework: string;
  Styling: string;
  Backend: string;
  Database: string;
  Blockchain: string;
  "Wallet Integration": string;
  "Has Tests": string;
  "Has CI/CD": string;
  Documentation: string;
  "README Quality": string;
  "Resume Worthy": string;
  "Featured Project": string;
  "Key Tags": string;
  "Demo Ready": string;
  "Project Type": string;
  "Archive Candidate": string;
  Notes: string;
  // GitHub API fields - Stats
  Stars?: string;
  Forks?: string;
  Watchers?: string;
  Subscribers?: string;
  "Network Count"?: string;
  "Open Issues"?: string;
  "Size (KB)"?: string;
  "Contributors Count"?: string;
  "Releases Count"?: string;
  // GitHub API fields - Dates
  "Created At"?: string;
  "Pushed At"?: string;
  "Latest Release Date"?: string;
  // GitHub API fields - Info
  Description?: string;
  Homepage?: string;
  "Full Name"?: string;
  "Primary Language"?: string;
  "Language Breakdown"?: string;
  Topics?: string;
  // GitHub API fields - Status
  "Is Fork"?: string;
  Archived?: string;
  Disabled?: string;
  Private?: string;
  Visibility?: string;
  // GitHub API fields - Features
  "Has Pages"?: string;
  "Has Issues"?: string;
  "Has Projects"?: string;
  "Has Wiki"?: string;
  "Has Downloads"?: string;
  "Has README"?: string;
  // GitHub API fields - Config
  "Default Branch"?: string;
  License?: string;
  "License Name"?: string;
  // GitHub API fields - URLs
  "HTML URL"?: string;
  "Clone URL"?: string;
  "Git URL"?: string;
  "SSH URL"?: string;
  "Social Preview URL"?: string;
  // GitHub API fields - README
  "README URL"?: string;
  "README Size (bytes)"?: string;
  "README Name"?: string;
  "README Path"?: string;
  // GitHub API fields - Releases
  "Latest Release Tag"?: string;
  "Latest Release Name"?: string;
  // GitHub API fields - Latest Commit
  "Latest Commit Message"?: string;
  "Latest Commit Date"?: string;
  "Latest Commit Author"?: string;
  // Open Graph fields from Homepage
  "OG Title"?: string;
  "OG Description"?: string;
  "OG Image"?: string;
  "OG Type"?: string;
  "OG URL"?: string;
  "OG Site Name"?: string;
  Favicon?: string;
}

export type ProjectStatus = "active" | "archived" | "needs-work" | "";
export type ProjectType = "app" | "library" | "tool" | "game" | "website" | "other" | "";
export type GitHubOrg = "whaleen" | "nothingdao" | "orthfx" | "boringprotocol";
