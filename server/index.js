import express from 'express';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Update single repo
app.post('/api/github/update', async (req, res) => {
  const { repo } = req.body;

  if (!repo) {
    return res.status(400).json({ error: 'Repo parameter is required (e.g., "whaleen/astrds" or "astrds")' });
  }

  try {
    const scriptPath = join(__dirname, '../scripts/fetch-github-data.py');
    const args = ['--repo', repo];

    const pythonProcess = spawn('python3', [scriptPath, ...args], {
      cwd: join(__dirname, '..'),
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        res.json({
          success: true,
          message: `Successfully updated ${repo}`,
          output: stdout
        });
      } else {
        res.status(500).json({
          success: false,
          error: `Script failed with code ${code}`,
          stderr: stderr,
          stdout: stdout
        });
      }
    });

    pythonProcess.on('error', (error) => {
      res.status(500).json({
        success: false,
        error: `Failed to spawn process: ${error.message}`
      });
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update all repos
app.post('/api/github/update-all', async (req, res) => {
  try {
    const scriptPath = join(__dirname, '../scripts/fetch-github-data.py');

    const pythonProcess = spawn('python3', [scriptPath], {
      cwd: join(__dirname, '..'),
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        res.json({
          success: true,
          message: 'Successfully updated all repos',
          output: stdout
        });
      } else {
        res.status(500).json({
          success: false,
          error: `Script failed with code ${code}`,
          stderr: stderr,
          stdout: stdout
        });
      }
    });

    pythonProcess.on('error', (error) => {
      res.status(500).json({
        success: false,
        error: `Failed to spawn process: ${error.message}`
      });
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update OG data for single repo
app.post('/api/og/update', async (req, res) => {
  const { repo } = req.body;

  if (!repo) {
    return res.status(400).json({ error: 'Repo parameter is required (e.g., "whaleen/astrds" or "astrds")' });
  }

  try {
    const scriptPath = join(__dirname, '../scripts/fetch-og-data.py');
    const args = ['--repo', repo];

    const pythonProcess = spawn('python3', [scriptPath, ...args], {
      cwd: join(__dirname, '..'),
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        res.json({
          success: true,
          message: `Successfully updated OG data for ${repo}`,
          output: stdout
        });
      } else {
        // Check if dependencies are missing
        if (stderr.includes('ModuleNotFoundError') || stderr.includes('ImportError')) {
          res.status(500).json({
            success: false,
            error: 'Missing Python dependencies. Run: pip3 install requests beautifulsoup4',
            stderr: stderr,
            stdout: stdout
          });
        } else {
          res.status(500).json({
            success: false,
            error: `Script failed with code ${code}`,
            stderr: stderr,
            stdout: stdout
          });
        }
      }
    });

    pythonProcess.on('error', (error) => {
      res.status(500).json({
        success: false,
        error: `Failed to spawn process: ${error.message}`
      });
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Toggle project hidden status
app.post('/api/project/toggle-hidden', async (req, res) => {
  const { repo, hidden } = req.body;

  if (!repo) {
    return res.status(400).json({ error: 'Repo parameter is required (e.g., "whaleen/astrds" or "astrds")' });
  }

  try {
    const scriptPath = join(__dirname, '../scripts/toggle-hidden.py');
    const args = ['--repo', repo, '--hidden', hidden ? 'yes' : 'no'];

    const pythonProcess = spawn('python3', [scriptPath, ...args], {
      cwd: join(__dirname, '..'),
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        res.json({
          success: true,
          message: `Successfully toggled hidden status for ${repo}`,
          output: stdout
        });
      } else {
        res.status(500).json({
          success: false,
          error: `Script failed with code ${code}`,
          stderr: stderr,
          stdout: stdout
        });
      }
    });

    pythonProcess.on('error', (error) => {
      res.status(500).json({
        success: false,
        error: `Failed to spawn process: ${error.message}`
      });
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete project
app.post('/api/project/delete', async (req, res) => {
  const { repo } = req.body;

  if (!repo) {
    return res.status(400).json({ error: 'Repo parameter is required (e.g., "whaleen/astrds")' });
  }

  try {
    const scriptPath = join(__dirname, '../scripts/delete-project.py');
    const args = ['--repo', repo];

    const pythonProcess = spawn('python3', [scriptPath, ...args], {
      cwd: join(__dirname, '..'),
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        res.json({
          success: true,
          message: `Successfully deleted ${repo}`,
          output: stdout
        });
      } else {
        res.status(500).json({
          success: false,
          error: `Script failed with code ${code}`,
          stderr: stderr,
          stdout: stdout
        });
      }
    });

    pythonProcess.on('error', (error) => {
      res.status(500).json({
        success: false,
        error: `Failed to spawn process: ${error.message}`
      });
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
});

