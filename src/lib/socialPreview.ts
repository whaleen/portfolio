/**
 * Social Preview Image Utilities
 */

/**
 * Generate the local path for a repo's social preview image
 * Images are stored in public/social-previews/{org}/{repo}.png
 * @param org - GitHub organization (e.g., "whaleen", "nothingdao")
 * @param repo - Repository name
 * @returns Local path to the social preview image
 */
export function getSocialPreviewUrl(
  org: string,
  repo: string
): string {
  if (!org || !repo) return "";

  return `/social-previews/${org}/${repo}.png`;
}

/**
 * List of repos that have social preview images
 * This can be auto-generated or manually maintained
 */
export const REPOS_WITH_SOCIAL_PREVIEW = [
  "whaleen/video-tiling",
  "whaleen/ephemeral-text",
  "nothingdao/earth",
  "nothingdao/studio-sites",
  "nothingdao/shadcn-solana",
  "orthfx/orthfx",
  "orthfx/jpb",
  "orthfx/orthodox-reader",
  "orthfx/orthobot",
  "orthfx/orthodox-nkjv",
];

/**
 * Check if a repo has a social preview image
 * @param org - GitHub organization
 * @param repo - Repository name
 * @returns true if the repo has a social preview
 */
export function hasSocialPreview(org: string, repo: string): boolean {
  const fullName = `${org}/${repo}`;
  return REPOS_WITH_SOCIAL_PREVIEW.includes(fullName);
}
