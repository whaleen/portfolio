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
 * Check if a repo has a social preview image
 * Since images are downloaded automatically by fetch-github-data.py,
 * we'll always return true and let the image component handle errors gracefully
 * @param org - GitHub organization
 * @param repo - Repository name
 * @returns true - always attempt to load, component handles errors
 */
export function hasSocialPreview(org: string, repo: string): boolean {
  return !!(org && repo);
}
