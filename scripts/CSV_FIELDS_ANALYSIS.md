# CSV Fields Analysis - GitHub Data Integration

## Summary

After updating the frontend to use GitHub-derived data, here's the analysis of which fields are redundant and can be removed or are now optional.

## Fields Replaced by GitHub Data

### ✅ Fully Replaced (Can Remove)
- **`Language`** → Replaced by **`Primary Language`** (from GitHub API)
  - The frontend now uses `Primary Language` with fallback to `Language`
  - **Recommendation**: Remove `Language` column after confirming all repos have `Primary Language` populated

### 🔄 Prefer GitHub, Keep as Fallback
These fields are now **preferred from GitHub** but kept as fallbacks for manual overrides:

1. **`Notes`** → Prefer **`Description`** (from GitHub)
   - Frontend shows: `project.Description || project.Notes`
   - **Recommendation**: Keep `Notes` for manual curation/overrides, but prioritize `Description`

2. **`Key Tags`** → Prefer **`Topics`** (from GitHub)
   - Frontend shows: `project.Topics || project["Key Tags"]`
   - **Recommendation**: Keep `Key Tags` for manual curation, but prioritize `Topics` from GitHub

3. **`Live URL`** → Prefer **`Homepage`** (from GitHub)
   - Frontend shows: `project.Homepage || project["Live URL"]`
   - **Recommendation**: Keep `Live URL` if it differs from GitHub homepage (e.g., custom domain)

## Fields Already Using GitHub Data ✅

These fields are already populated from GitHub and working correctly:
- `Stars` - GitHub stargazers count
- `Forks` - GitHub forks count
- `Watchers` - GitHub watchers count (now displayed in ProjectDetail)
- `Open Issues` - GitHub open issues count (now displayed in ProjectDetail)
- `Description` - GitHub repository description
- `Topics` - GitHub topics/tags
- `License` - GitHub license (SPDX ID)
- `Homepage` - GitHub homepage URL
- `Last Updated` - GitHub updated_at timestamp
- `Primary Language` - GitHub primary language
- `Language Breakdown` - GitHub language percentages
- `Created At` - GitHub created_at timestamp
- `Pushed At` - GitHub pushed_at timestamp
- `HTML URL` - GitHub repository URL
- `Clone URL`, `Git URL`, `SSH URL` - GitHub clone URLs
- `Social Preview URL` - GitHub Open Graph image URL
- `README URL`, `README Size (bytes)`, `README Name`, `Has README` - README info
- `Subscribers`, `Network Count`, `Contributors Count`, `Releases Count` - Additional stats
- `Latest Release Tag`, `Latest Release Name`, `Latest Release Date` - Release info

## Fields That Should Stay (Manual Curation)

These fields are **not** from GitHub and require manual curation:

### Project Classification
- `Project Type` - app, library, tool, game, website, etc.
- `Status` - active, archived, needs-work
- `Resume Worthy` - yes/no flag
- `Featured Project` - yes/no flag
- `Archive Candidate` - yes/no flag

### Tech Stack Details
- `Framework` - React, Next.js, etc.
- `Styling` - Tailwind, CSS, etc.
- `Backend` - Node.js, Python, etc.
- `Database` - postgres, none, etc.
- `Blockchain` - Solana, none, etc.

### Feature Flags
- `PWA` - Progressive Web App flag
- `Has Tests` - Test coverage flag
- `Has CI/CD` - CI/CD flag
- `Wallet Integration` - Web3 wallet integration
- `Deployment Platform` - Vercel, Netlify, etc.

### Manual Metadata
- `Local` - Whether repo exists locally
- `Updated` - Manual update tracking
- `Documentation` - Documentation quality
- `README Quality` - README quality rating
- `Demo Ready` - Demo readiness flag

## Migration Recommendations

### Phase 1: Safe to Remove Now
1. **`Language`** - After confirming `Primary Language` is populated for all repos

### Phase 2: Keep as Overrides (Optional)
2. **`Notes`** - Keep for manual curation, but GitHub `Description` is primary
3. **`Key Tags`** - Keep for manual curation, but GitHub `Topics` is primary  
4. **`Live URL`** - Keep if different from GitHub `Homepage`

### Phase 3: Future Consideration
- Consider removing `Notes`, `Key Tags`, and `Live URL` if GitHub data is sufficient
- Monitor usage to see if manual overrides are actually needed

## Frontend Changes Made

### Projects.tsx
- ✅ Uses `Primary Language` with fallback to `Language`
- ✅ Uses `Description` with fallback to `Notes`
- ✅ Uses `Topics` with fallback to `Key Tags`
- ✅ Uses `Homepage` with fallback to `Live URL`
- ✅ Search now includes `Description` and `Topics`

### ProjectDetail.tsx
- ✅ Uses `Primary Language` with fallback to `Language`
- ✅ Uses `Description` with fallback to `Notes`
- ✅ Shows `Topics` (preferred) or `Key Tags` (fallback)
- ✅ Uses `Homepage` with fallback to `Live URL`
- ✅ Added `Watchers` and `Open Issues` to stats

### Home.tsx
- ✅ Uses `Primary Language` with fallback to `Language`
- ✅ Uses `Description` with fallback to `Notes`
- ✅ Uses `Topics` with fallback to `Key Tags`
- ✅ Uses `Homepage` with fallback to `Live URL`

