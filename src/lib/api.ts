const API_BASE = import.meta.env.DEV ? '/api' : 'http://localhost:3001/api';

export async function updateGitHubData(repo?: string) {
  const endpoint = repo ? '/github/update' : '/github/update-all';
  const body = repo ? { repo } : {};

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update GitHub data');
  }

  return response.json();
}

export async function updateOGData(repo: string) {
  const response = await fetch(`${API_BASE}/og/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ repo }),
  });

  if (!response.ok) {
    let errorMessage = 'Failed to update OG data';

    // Get response text first (can only read body once)
    const responseText = await response.text();

    try {
      const error = JSON.parse(responseText);
      errorMessage = error.error || errorMessage;

      // Log detailed error info for debugging
      if (error.stderr) {
        console.error('Python stderr:', error.stderr);
      }
      if (error.stdout) {
        console.log('Python stdout:', error.stdout);
      }
    } catch (e) {
      // If response isn't JSON, log the raw text
      console.error('Non-JSON response:', responseText);
      errorMessage = 'Server returned invalid response. Check console for details.';
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function toggleHidden(repo: string, hidden: boolean) {
  const response = await fetch(`${API_BASE}/project/toggle-hidden`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ repo, hidden }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to toggle hidden status');
  }

  return response.json();
}

export async function deleteProject(repo: string) {
  const response = await fetch(`${API_BASE}/project/delete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ repo }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete project');
  }

  return response.json();
}

