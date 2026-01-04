#!/usr/bin/env node

/**
 * Sync Social Preview Images to GitHub
 *
 * This script:
 * 1. Reads projects.csv to get all repos
 * 2. Checks each repo's local directory for .github/social-preview.png
 * 3. Uploads the image to GitHub's social preview via API
 * 4. Optionally generates a report of which repos have/need previews
 *
 * Requirements:
 * - GitHub CLI (gh) installed and authenticated
 * - Local repos must exist in the expected directory structure
 *
 * Usage:
 *   node scripts/sync-social-previews.js [--dry-run] [--repo=owner/name]
 *
 * Options:
 *   --dry-run    Show what would be done without making changes
 *   --repo       Only process a specific repo (format: owner/name)
 *   --help       Show this help message
 */

import { readFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const PROJECTS_DIR = '/Users/josh/Projects';
const CSV_PATH = join(__dirname, '../src/data/projects.csv');
const SOCIAL_PREVIEW_PATHS = [
  '.github/social-preview.png',
  '.github/og-image.png',
  'docs/social-preview.png'
];

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const specificRepo = args.find(arg => arg.startsWith('--repo='))?.split('=')[1];
const showHelp = args.includes('--help');

if (showHelp) {
  console.log(`
Sync Social Preview Images to GitHub

Usage:
  node scripts/sync-social-previews.js [options]

Options:
  --dry-run           Show what would be done without making changes
  --repo=owner/name   Only process a specific repo
  --help              Show this help message

Examples:
  node scripts/sync-social-previews.js --dry-run
  node scripts/sync-social-previews.js --repo=whaleen/video-tiling
  node scripts/sync-social-previews.js
`);
  process.exit(0);
}

// Read and parse CSV
function loadProjects() {
  const csv = readFileSync(CSV_PATH, 'utf-8');
  const { data } = Papa.parse(csv, { header: true });
  return data.filter(row => row.Repo && row['GitHub Org']);
}

// Find repo directory based on org structure
function getRepoPath(repo, githubOrg) {
  const orgDirs = {
    'whaleen': '_whaleen',
    'nothingdao': '_nothingdao',
    'orthfx': '_orthfx',
    'boringprotocol': '_boringprotocol'
  };

  const orgDir = orgDirs[githubOrg.toLowerCase()];
  if (!orgDir) return null;

  return join(PROJECTS_DIR, orgDir, repo);
}

// Find social preview image in repo
function findSocialPreview(repoPath) {
  for (const previewPath of SOCIAL_PREVIEW_PATHS) {
    const fullPath = join(repoPath, previewPath);
    if (existsSync(fullPath)) {
      return { path: fullPath, relativePath: previewPath };
    }
  }
  return null;
}

// Upload image to GitHub via API
function uploadToGitHub(owner, repo, imagePath, dryRun = false) {
  const fullRepoName = `${owner}/${repo}`;

  if (dryRun) {
    console.log(`  [DRY RUN] Would upload: ${imagePath}`);
    return { success: true, dryRun: true };
  }

  try {
    // Use GitHub CLI to update repository settings with social preview
    // Note: GitHub API doesn't have a direct endpoint for social preview images
    // We need to use the GraphQL API or the web upload

    console.log(`  ⚠️  GitHub API limitation: Social preview images must be uploaded via web UI`);
    console.log(`  📝 Manual action needed: https://github.com/${fullRepoName}/settings`);
    console.log(`  🖼️  Image location: ${imagePath}`);

    return {
      success: false,
      reason: 'API limitation',
      manualUrl: `https://github.com/${fullRepoName}/settings`,
      imagePath
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Main execution
async function main() {
  console.log('🔍 Scanning for social preview images...\n');

  const projects = loadProjects();
  const results = {
    found: [],
    notFound: [],
    uploaded: [],
    errors: [],
    needsManualUpload: []
  };

  for (const project of projects) {
    const { Repo: repo, 'GitHub Org': githubOrg, Local: isLocal } = project;

    // Skip if filtering by specific repo
    if (specificRepo && `${githubOrg}/${repo}` !== specificRepo) {
      continue;
    }

    // Skip if not local
    if (isLocal?.toLowerCase() !== 'yes') {
      continue;
    }

    const repoPath = getRepoPath(repo, githubOrg);
    if (!repoPath || !existsSync(repoPath)) {
      continue;
    }

    const preview = findSocialPreview(repoPath);

    if (preview) {
      console.log(`✅ ${githubOrg}/${repo}`);
      console.log(`   Found: ${preview.relativePath}`);

      results.found.push({
        repo: `${githubOrg}/${repo}`,
        path: preview.path,
        relativePath: preview.relativePath
      });

      const uploadResult = uploadToGitHub(githubOrg, repo, preview.path, isDryRun);

      if (uploadResult.success && !uploadResult.dryRun) {
        results.uploaded.push(`${githubOrg}/${repo}`);
      } else if (uploadResult.reason === 'API limitation') {
        results.needsManualUpload.push({
          repo: `${githubOrg}/${repo}`,
          url: uploadResult.manualUrl,
          imagePath: uploadResult.imagePath
        });
      } else if (!uploadResult.success) {
        results.errors.push({
          repo: `${githubOrg}/${repo}`,
          error: uploadResult.error
        });
      }
    } else {
      console.log(`❌ ${githubOrg}/${repo}`);
      console.log(`   No social preview image found`);
      results.notFound.push(`${githubOrg}/${repo}`);
    }

    console.log('');
  }

  // Summary
  console.log('\n📊 Summary\n' + '='.repeat(50));
  console.log(`✅ Found images: ${results.found.length}`);
  console.log(`❌ Missing images: ${results.notFound.length}`);
  console.log(`⚠️  Needs manual upload: ${results.needsManualUpload.length}`);
  console.log(`✓  Uploaded: ${results.uploaded.length}`);
  console.log(`✗  Errors: ${results.errors.length}`);

  if (results.needsManualUpload.length > 0) {
    console.log('\n⚠️  Manual Upload Required\n' + '='.repeat(50));
    results.needsManualUpload.forEach(({ repo, url, imagePath }) => {
      console.log(`\n${repo}`);
      console.log(`  Settings: ${url}`);
      console.log(`  Image: ${imagePath}`);
    });

    console.log('\n💡 Alternative: Use raw.githubusercontent.com URLs in your portfolio:');
    console.log('   https://raw.githubusercontent.com/owner/repo/main/.github/social-preview.png');
  }

  if (results.notFound.length > 0) {
    console.log('\n📝 Repos Missing Social Preview Images\n' + '='.repeat(50));
    results.notFound.forEach(repo => console.log(`  - ${repo}`));
    console.log('\n💡 Create .github/social-preview.png in these repos (1280x640px recommended)');
  }
}

main().catch(console.error);
