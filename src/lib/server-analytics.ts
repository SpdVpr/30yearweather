import fs from 'fs';
import path from 'path';

// Store logs outside of src to avoid rebuild loops in dev
const LOG_FILE_PATH = path.join(process.cwd(), 'data', 'api_logs.json');

export interface ApiLog {
  timestamp: string;
  endpoint: string;
  ip: string;
  params: any;
  status: number;
}

// Ensure directory exists
const ensureDir = () => {
  const dir = path.dirname(LOG_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

export async function trackApiRequest(req: Request, endpoint: string, params: any, status: number = 200) {
  try {
    ensureDir();

    // Simple way to get IP in Node env
    const ip = req.headers.get('x-forwarded-for') || 'unknown';

    const logEntry: ApiLog = {
      timestamp: new Date().toISOString(),
      endpoint,
      ip,
      params,
      status
    };

    // Read existing logs (naive implementation for MVP - in prod use DB)
    let logs: ApiLog[] = [];
    if (fs.existsSync(LOG_FILE_PATH)) {
      const raw = fs.readFileSync(LOG_FILE_PATH, 'utf-8');
      try {
        logs = JSON.parse(raw);
      } catch (e) {
        // If corrupted, start fresh
        logs = [];
      }
    }

    // Keep last 1000 logs to prevent infinite growth
    logs.unshift(logEntry);
    if (logs.length > 1000) logs = logs.slice(0, 1000);

    fs.writeFileSync(LOG_FILE_PATH, JSON.stringify(logs, null, 2));

  } catch (error) {
    console.error("Analytics logging failed:", error);
    // Don't crash the API request just because logging failed
  }
}

export async function getApiLogs(): Promise<ApiLog[]> {
  if (!fs.existsSync(LOG_FILE_PATH)) return [];
  try {
    const raw = fs.readFileSync(LOG_FILE_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}
