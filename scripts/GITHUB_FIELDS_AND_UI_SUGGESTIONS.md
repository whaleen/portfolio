# GitHub API Fields & UI Redesign Suggestions

## Additional GitHub API Fields to Fetch

### Activity & Engagement Metrics
1. **Recent Activity Score** - Calculate from `pushed_at` vs `created_at` to show "actively maintained"
2. **Commit Frequency** - Use `/repos/{owner}/{repo}/commits?per_page=1` to get latest commit info
3. **Latest Commit Message** - From commits endpoint
4. **Latest Commit Author** - Who made the last commit
5. **Days Since Last Commit** - Calculate from `pushed_at`
6. **Pull Requests Count** - Open and closed (requires GraphQL or separate endpoint)
7. **Closed Issues Count** - Total closed issues (shows project maturity)
8. **Issue Resolution Rate** - Closed vs Open ratio

### Community & Collaboration
9. **Contributors List** - Top 3-5 contributors (from `/repos/{owner}/{repo}/contributors`)
10. **Contributor Avatars** - For visual display
11. **Community Health** - Based on issues, PRs, discussions
12. **Discussion Enabled** - If discussions are enabled
13. **Sponsors Count** - If repository has sponsors

### Code Quality & Health
14. **Code Size** - Already have `Size (KB)`, but could add breakdown
15. **File Count** - Total files in repository
16. **Lines of Code** - From languages endpoint (sum all)
17. **Test Coverage** - If available from CI/CD badges
18. **Security Alerts** - `/repos/{owner}/{repo}/vulnerability-alerts` (if enabled)
19. **Dependabot Alerts** - Security dependency alerts

### Release & Versioning
20. **Release Count** - Already have, but could add more detail
21. **Latest Release Downloads** - Download count for latest release
22. **Release Notes Preview** - First 200 chars of latest release body
23. **Pre-release Status** - If latest release is a pre-release
24. **Tag Count** - Total number of tags

### Repository Metadata
25. **Repository ID** - GitHub internal ID
26. **Mirror URL** - If it's a mirror
27. **Template Repository** - If it's marked as a template
28. **Allow Auto Merge** - Auto-merge enabled
29. **Allow Squash Merge** - Merge strategy
30. **Allow Rebase Merge** - Merge strategy
31. **Delete Branch on Merge** - Branch protection setting

### Advanced Features
32. **Actions Enabled** - GitHub Actions usage
33. **Workflow Status** - Latest workflow run status (if any)
34. **Deployments** - Deployment status
35. **Environments** - Environment count
36. **Webhooks** - Webhook count
37. **Secrets** - If repository has secrets (count only, not values)

## UI Redesign Suggestions

### Project Card Enhancements

#### Current Card Structure
```
[Image]
[Title] [Language Badge]
[Org] [Type] [Featured]
[Description]
[Tags]
[Code] [Demo] [Update]
```

#### Enhanced Card Design

**Option 1: Activity-Focused Card**
```
┌─────────────────────────────┐
│ [Social Preview Image]      │
│                              │
├─────────────────────────────┤
│ Repo Name          [Lang] ⭐ │
│ Org • Type • Featured        │
│                              │
│ Description text here...     │
│                              │
│ [Topic] [Topic] [Topic]      │
│                              │
│ 📊 Stats: ⭐12 🍴3 👀5       │
│ 🕐 Updated 2 days ago         │
│                              │
│ [Code] [Demo] [Update]       │
└─────────────────────────────┘
```

**Option 2: Rich Stats Card**
```
┌─────────────────────────────┐
│ [Social Preview]            │
│                              │
│ Repo Name                    │
│ Org • Type                   │
│                              │
│ Description...               │
│                              │
│ ┌─────────────────────────┐ │
│ │ ⭐ 12  🍴 3  👀 5       │ │
│ │ 📋 2 issues  🔄 1 PR     │ │
│ │ 👥 3 contributors        │ │
│ └─────────────────────────┘ │
│                              │
│ [Topics...]                  │
│                              │
│ [Code] [Demo] [Update]       │
└─────────────────────────────┘
```

**Option 3: Activity Indicator Card**
```
┌─────────────────────────────┐
│ [Image]                     │
│                              │
│ Repo Name          [Lang]    │
│                              │
│ Description...               │
│                              │
│ 🟢 Active • Last commit: 2d │
│                              │
│ Stats: ⭐12 🍴3              │
│                              │
│ [Topics]                     │
│                              │
│ [Code] [Demo] [Update]       │
└─────────────────────────────┘
```

### Project Detail Page Enhancements

#### Current Sections
- Hero with image
- About (description)
- Tech Stack
- Stats
- Features
- Tags/Topics
- License
- Links

#### Enhanced Detail Page Layout

**New Sections to Add:**

1. **Activity Timeline**
   - Last commit date with relative time
   - Days since last activity
   - Commit frequency indicator
   - Recent commits list (last 3-5)

2. **Community Stats**
   - Contributors with avatars
   - Contributor count
   - Community health score
   - Discussion status

3. **Development Metrics**
   - Code statistics (lines, files)
   - Language breakdown (visual chart)
   - Repository size
   - File structure preview

4. **Release Information**
   - Latest release card
   - Release notes preview
   - Download count
   - Release history link

5. **Project Health**
   - Open/closed issues ratio
   - Pull request activity
   - Security alerts (if any)
   - Test coverage (if available)

6. **Quick Actions Panel**
   - Clone repository (with copy button)
   - Download ZIP
   - View on GitHub
   - Star repository
   - Fork repository

### Visual Enhancements

#### Activity Indicators
- **Active Badge**: Green dot if updated in last 30 days
- **Stale Badge**: Yellow if 30-90 days, red if 90+ days
- **Archived Badge**: Gray if archived

#### Stats Visualization
- **Progress Bars**: For language breakdown
- **Sparklines**: For commit activity over time
- **Icons**: Consistent iconography for all metrics
- **Color Coding**: 
  - Green: Active/Healthy
  - Yellow: Moderate activity
  - Red: Stale/Issues
  - Blue: Information

#### Interactive Elements
- **Hover States**: Show more details on hover
- **Expandable Sections**: Collapsible detailed stats
- **Tooltips**: Explain metrics on hover
- **Copy Buttons**: For clone URLs, etc.

### Responsive Design Considerations

#### Mobile
- Stack stats vertically
- Hide less important metrics
- Larger touch targets
- Simplified card layout

#### Tablet
- 2-column grid for cards
- More stats visible
- Side-by-side comparisons

#### Desktop
- 3-column grid
- Full stats display
- Hover interactions
- Rich tooltips

## Implementation Priority

### Phase 1: High Value, Easy to Implement
1. ✅ Days since last commit (calculate from `pushed_at`)
2. ✅ Activity status badge (active/stale/archived)
3. ✅ Latest commit message preview
4. ✅ Enhanced stats display on cards
5. ✅ Contributor count (already fetching)

### Phase 2: Medium Value, Moderate Effort
6. ⚠️ Contributors list with avatars
7. ⚠️ Closed issues count
8. ⚠️ Pull request count (requires additional API call)
9. ⚠️ Release notes preview
10. ⚠️ Language breakdown visualization

### Phase 3: Nice to Have, More Complex
11. 🔄 Commit activity graph
12. 🔄 Security alerts integration
13. 🔄 Workflow status
14. 🔄 Discussion integration
15. 🔄 Advanced filtering by activity

## Code Examples

### Activity Status Helper
```typescript
function getActivityStatus(pushedAt: string): 'active' | 'stale' | 'archived' {
  if (!pushedAt) return 'stale';
  const daysSince = (Date.now() - new Date(pushedAt).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSince < 30) return 'active';
  if (daysSince < 90) return 'stale';
  return 'archived';
}
```

### Relative Time Display
```typescript
function getRelativeTime(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const diff = now.getTime() - then.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}
```

## Design System Updates Needed

1. **Badge Variants**
   - `active` - Green
   - `stale` - Yellow
   - `archived` - Gray
   - `featured` - Gold (existing)
   - `resume-worthy` - Blue (existing)

2. **Stat Display Component**
   - Icon + Number + Label
   - Compact and inline
   - Tooltip on hover

3. **Activity Indicator**
   - Dot indicator
   - Status text
   - Color coded

4. **Metric Card**
   - Grouped stats
   - Visual hierarchy
   - Responsive grid

