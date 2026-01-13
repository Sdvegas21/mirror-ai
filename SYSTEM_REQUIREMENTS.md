# EOS Demo Frontend - System Requirements

## Required Software

### 1. Node.js (v18 or higher)
**Required for**: Running the React frontend development server and building the production bundle.

**Installation**:
```bash
# macOS (via Homebrew)
brew install node

# Verify installation
node --version  # Should be v18.x or higher
npm --version   # Should be 9.x or higher
```

**Download**: https://nodejs.org/ (LTS version recommended)

---

### 2. Python 3.13
**Required for**: Running the Flask backend (EOS API server).

**Installation**:
```bash
# macOS (via Homebrew)
brew install python@3.13

# Verify installation
python3.13 --version
```

---

### 3. Git
**Required for**: Cloning repositories and version control.

**Installation**:
```bash
# macOS (via Homebrew)
brew install git

# Verify installation
git --version
```

---

## Backend Dependencies (Python)

The backend requires these packages (installed via `pip`):
- `flask` - Web framework
- `flask-cors` - Cross-origin resource sharing
- `anthropic` - Claude API client
- `python-dotenv` - Environment variable management
- `chromadb` - Vector database for memory
- `numpy` - Numerical operations
- `pandas` - Data manipulation

**Installation**:
```bash
cd /Users/shawncohen/Documents/mirra_project/MIRRA_LLM_BRIDGE_v1
source .venv_313/bin/activate
pip install flask flask-cors anthropic python-dotenv chromadb numpy pandas
```

---

## Frontend Dependencies (Node.js)

The frontend uses React + TypeScript + Vite:
- `react` - UI framework
- `react-dom` - React rendering
- `typescript` - Type safety
- `vite` - Build tool
- `tailwindcss` - Styling
- `@tanstack/react-query` - Data fetching
- `react-router-dom` - Routing
- And other UI component libraries

**Installation**:
```bash
cd /Users/shawncohen/Documents/mirra_project/MIRRA_LLM_BRIDGE_v1/eos_demo_frontend
npm install
```

---

## Environment Variables

### Backend (.env)
Create a `.env` file in the project root:
```bash
ANTHROPIC_API_KEY=your_api_key_here
```

### Frontend (No .env needed)
The frontend connects to `http://localhost:5001` by default (hardcoded in API client).

---

## Port Requirements

- **Backend**: Port `5001` (Flask API)
- **Frontend**: Port `5173` (Vite dev server, auto-increments if busy)

Make sure these ports are available.

---

## Recommended System Specs

- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 500MB for Node modules + Python packages
- **OS**: macOS 10.15+, Linux, or Windows 10+ with WSL

---

## Quick Start Checklist

- [ ] Node.js v18+ installed (`node --version`)
- [ ] Python 3.13 installed (`python3.13 --version`)
- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] `ANTHROPIC_API_KEY` set in environment
- [ ] Backend running on `http://localhost:5001`
- [ ] Frontend running on `http://localhost:5173`

---

## Troubleshooting

### "npm: command not found"
- Node.js not installed or not in PATH
- Solution: `brew install node`

### "python3.13: command not found"
- Python 3.13 not installed
- Solution: `brew install python@3.13`

### "Port 5001 already in use"
- Another process using the port
- Solution: `lsof -ti:5001 | xargs kill -9`

### "CORS error" in browser
- Backend not running or CORS not enabled
- Solution: Check backend logs, ensure `flask-cors` installed

---

## Development Workflow

1. Start backend: `cd eos_demo_backend && ./start.sh`
2. Start frontend: `cd eos_demo_frontend && npm run dev`
3. Open browser: `http://localhost:5173`
4. Test backend: `curl http://localhost:5001/health`
