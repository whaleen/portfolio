import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import fetch from 'node-fetch';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORTFOLIO_DIR = path.join(__dirname, '../');
const DATA_OUTPUT_PATH = path.join(PORTFOLIO_DIR, '_data/projects.json');
const COLOPHON_OUTPUT_PATH = path.join(PORTFOLIO_DIR, '_data/colophon.json');
const PUBLIC_SOCIAL_DIR = path.join(PORTFOLIO_DIR, 'public/social-previews');

const TARGETS = ['whaleen', 'nothingdao', 'orthfx', 'boringprotocol'];

if (!fs.existsSync(path.dirname(DATA_OUTPUT_PATH))) fs.mkdirSync(path.dirname(DATA_OUTPUT_PATH), { recursive: true });
if (!fs.existsSync(PUBLIC_SOCIAL_DIR)) fs.mkdirSync(PUBLIC_SOCIAL_DIR, { recursive: true });

async function runGhApi(endpoint) {
    try {
        const result = execSync(`gh api ${endpoint}`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
        return JSON.parse(result);
    } catch (error) {
        return null;
    }
}

async function fetchFileContent(org, repo, filePath) {
    const data = await runGhApi(`/repos/${org}/${repo}/contents/${filePath}`);
    if (data && data.content) {
        return Buffer.from(data.content, 'base64').toString('utf8');
    }
    return null;
}

async function runGhGraphql(query) {
    try {
        const result = execSync(`gh api graphql -f query='${query.replace(/\n/g, " ")}'`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
        return JSON.parse(result);
    } catch (error) {
        return null;
    }
}

async function downloadFile(url, destPath) {
    if (!url) return null;
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 0) return true;
    try {
        const response = await fetch(url);
        if (!response.ok) return null;
        const buffer = await response.arrayBuffer();
        fs.writeFileSync(destPath, Buffer.from(buffer));
        return true;
    } catch (error) {
        return null;
    }
}

async function getReposForTarget(target) {
    console.log(`🔍 Listing repositories for ${target}...`);
    try {
        const result = execSync(`gh repo list ${target} --limit 100 --json name,owner,description,stargazerCount,forkCount,primaryLanguage,url,homepageUrl,updatedAt,pushedAt,isArchived,repositoryTopics,defaultBranchRef`, { encoding: 'utf8' });
        return JSON.parse(result).map(repo => ({
            name: repo.name,
            org: repo.owner.login,
            description: repo.description,
            stars: repo.stargazerCount,
            forks: repo.forkCount,
            language: repo.primaryLanguage?.name || null,
            topics: repo.repositoryTopics?.map(t => t.name) || [],
            url: repo.url,
            homepage: repo.homepageUrl,
            updatedAt: repo.updatedAt,
            pushedAt: repo.pushedAt,
            archived: repo.isArchived,
            category: repo.owner.login,
            defaultBranch: repo.defaultBranchRef?.name || 'main'
        }));
    } catch (error) {
        return [];
    }
}

function rewriteRelativeUrls(content, org, repo, branch) {
    if (!content) return "";
    const baseUrl = `https://raw.githubusercontent.com/${org}/${repo}/${branch}`;
    const linkBaseUrl = `https://github.com/${org}/${repo}/blob/${branch}`;
    content = content.replace(/!\[(.*?)\]\((?!http|https|\/|#)(.*?)\)/g, (match, alt, p) => `![${alt}](${baseUrl}/${p})`);
    content = content.replace(/<img(.*?)src=["'](?!http|https|\/|#)(.*?)["'](.*?)>/g, (match, attr1, p, attr2) => `<img${attr1}src="${baseUrl}/${p}"${attr2}>`);
    content = content.replace(/\[(.*?)\]\((?!http|https|\/|#)(.*?)\)/g, (match, text, p) => `[${text}](${linkBaseUrl}/${p})`);
    return content;
}

async function enrichRepo(repo) {
    const { org, name, defaultBranch } = repo;
    console.log(`  📡 Enriching ${org}/${name}...`);

    const graphqlQuery = `{ repository(owner: "${org}", name: "${name}") { openGraphImageUrl } }`;
    const graphqlData = await runGhGraphql(graphqlQuery);
    const socialPreviewUrl = graphqlData?.data?.repository?.openGraphImageUrl || "";

    let localSocialPath = '';
    if (socialPreviewUrl && !socialPreviewUrl.includes('avatars')) {
        const orgDir = path.join(PUBLIC_SOCIAL_DIR, org);
        if (!fs.existsSync(orgDir)) fs.mkdirSync(orgDir, { recursive: true });
        const dest = path.join(orgDir, `${name}.png`);
        const success = await downloadFile(socialPreviewUrl, dest);
        if (success) localSocialPath = `/public/social-previews/${org}/${name}.png`;
    }

    const readmeData = await runGhApi(`/repos/${org}/${name}/readme`);
    let readmeContent = "";
    if (readmeData && readmeData.content) {
        readmeContent = Buffer.from(readmeData.content, 'base64').toString('utf8');
        readmeContent = rewriteRelativeUrls(readmeContent, org, name, defaultBranch);
    }

    return {
        ...repo,
        github: {
            ...repo,
            socialPreviewUrl: localSocialPath || socialPreviewUrl,
            readme: readmeContent
        }
    };
}

async function sync() {
    let allRepos = [];
    for (const target of TARGETS) {
        const repos = await getReposForTarget(target);
        allRepos = allRepos.concat(repos);
    }
    
    const enrichedProjects = [];
    for (const repo of allRepos) {
        const enriched = await enrichRepo(repo);
        enrichedProjects.push(enriched);
    }

    // Fetch structured colophon data from dotfiles
    console.log(`📡 Fetching Colophon from whaleen/dotfiles...`);
    const colophonYaml = await fetchFileContent('whaleen', 'dotfiles', 'colophon.yaml');
    const colophon = colophonYaml ? yaml.load(colophonYaml) : {};

    enrichedProjects.sort((a, b) => new Date(b.pushedAt) - new Date(a.pushedAt));
    fs.writeFileSync(DATA_OUTPUT_PATH, JSON.stringify(enrichedProjects, null, 2));
    fs.writeFileSync(COLOPHON_OUTPUT_PATH, JSON.stringify(colophon, null, 2));
    console.log(`✅ Synced ${enrichedProjects.length} projects and Colophon data.`);
}

sync().catch(console.error);
