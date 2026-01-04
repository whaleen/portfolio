#!/usr/bin/env node

/**
 * Distribute Social Preview Image to All Repos
 *
 * Copies the template social preview image from earth repo to all local repos in CSV
 */

import { readFileSync, existsSync, mkdirSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const PROJECTS_DIR = '/Users/josh/Projects';
const CSV_PATH = join(__dirname, '../src/data/projects.csv');
const SOURCE_IMAGE = '/Users/josh/Projects/_nothingdao/earth/.github/social-preview.png';

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');

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

// Copy social preview to repo
function copySocialPreview(repoPath, repo, dryRun = false) {
  const githubDir = join(repoPath, '.github');
  const destPath = join(githubDir, 'social-preview.png');

  // Skip if already exists
  if (existsSync(destPath)) {
    return { skipped: true, reason: 'already exists' };
  }

  if (dryRun) {
    return { success: true, dryRun: true, path: destPath };
  }

  try {
    // Create .github directory if it doesn't exist
    if (!existsSync(githubDir)) {
      mkdirSync(githubDir, { recursive: true });
    }

    // Copy the file
    copyFileSync(SOURCE_IMAGE, destPath);
    return { success: true, path: destPath };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Main execution
async function main() {
  console.log('📋 Distributing social preview images...\n');

  if (isDryRun) {
    console.log('🔍 DRY RUN - No files will be copied\n');
  }

  // Check source image exists
  if (!existsSync(SOURCE_IMAGE)) {
    console.error(`❌ Source image not found: ${SOURCE_IMAGE}`);
    process.exit(1);
  }

  const projects = loadProjects();
  const results = {
    copied: [],
    skipped: [],
    notLocal: [],
    errors: []
  };

  for (const project of projects) {
    const { Repo: repo, 'GitHub Org': githubOrg, Local: isLocal } = project;

    // Skip if not local
    if (isLocal?.toLowerCase() !== 'yes') {
      results.notLocal.push(`${githubOrg}/${repo}`);
      continue;
    }

    const repoPath = getRepoPath(repo, githubOrg);
    if (!repoPath || !existsSync(repoPath)) {
      console.log(`⚠️  ${githubOrg}/${repo} - Directory not found`);
      continue;
    }

    const result = copySocialPreview(repoPath, repo, isDryRun);

    if (result.skipped) {
      console.log(`⏭️  ${githubOrg}/${repo} - ${result.reason}`);
      results.skipped.push(`${githubOrg}/${repo}`);
    } else if (result.success) {
      const icon = isDryRun ? '🔍' : '✅';
      const action = isDryRun ? 'Would copy to' : 'Copied to';
      console.log(`${icon} ${githubOrg}/${repo} - ${action} .github/social-preview.png`);
      results.copied.push(`${githubOrg}/${repo}`);
    } else if (!result.success) {
      console.log(`❌ ${githubOrg}/${repo} - Error: ${result.error}`);
      results.errors.push({ repo: `${githubOrg}/${repo}`, error: result.error });
    }
  }

  // Summary
  console.log('\n📊 Summary\n' + '='.repeat(50));
  console.log(`${isDryRun ? '🔍 Would copy' : '✅ Copied'}: ${results.copied.length}`);
  console.log(`⏭️  Skipped (already exists): ${results.skipped.length}`);
  console.log(`📍 Not local: ${results.notLocal.length}`);
  console.log(`❌ Errors: ${results.errors.length}`);

  if (results.errors.length > 0) {
    console.log('\n❌ Errors\n' + '='.repeat(50));
    results.errors.forEach(({ repo, error }) => {
      console.log(`  ${repo}: ${error}`);
    });
  }

  if (!isDryRun && results.copied.length > 0) {
    console.log('\n✨ Next Steps:\n');
    console.log('1. Review the copied images in each repo');
    console.log('2. Commit the changes:');
    console.log('   git add .github/social-preview.png');
    console.log('   git commit -m "Add social preview placeholder"');
    console.log('   git push');
    console.log('\n3. Test with the sync script:');
    console.log('   npm run social:scan');
  }
}

main().catch(console.error);
