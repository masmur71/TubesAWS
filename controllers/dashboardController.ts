import { Request, Response } from 'express';
import pool from '../config/database';
import os from 'os';

export const dashboardController = {
  // GET /api/dashboard/stats
  getStats: async (req: Request, res: Response) => {
    try {
      const [membersCount]: any = await pool.query('SELECT COUNT(*) as total FROM members');
      const [usersCount]: any = await pool.query('SELECT COUNT(*) as total FROM users');
      const [members]: any = await pool.query('SELECT * FROM members ORDER BY id ASC');

      // Log this request
      const startTime = Date.now();
      await pool.query(
        `INSERT INTO server_logs (server_id, server_name, ip_address, user_agent, endpoint, method, status_code, response_time_ms)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          process.env.SERVER_ID || '1',
          process.env.SERVER_NAME || 'WebServer-Instance-1',
          req.ip || req.socket.remoteAddress,
          req.get('User-Agent'),
          req.path,
          req.method,
          200,
          Date.now() - startTime,
        ]
      );

      return res.json({
        stats: {
          totalMembers: membersCount[0].total,
          totalUsers: usersCount[0].total,
        },
        members,
        serverId: process.env.SERVER_ID || '1',
        serverName: process.env.SERVER_NAME || 'WebServer-Instance-1',
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || 'development',
      });
    } catch (err) {
      console.error('Dashboard error:', err);
      return res.json({
        stats: { totalMembers: 0, totalUsers: 0 },
        members: [],
        serverId: process.env.SERVER_ID || '1',
        serverName: process.env.SERVER_NAME || 'WebServer-Instance-1',
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || 'development',
        dbError: true,
      });
    }
  },

  // GET /api/server-info
  serverInfo: (req: Request, res: Response) => {
    res.json({
      success: true,
      serverId: process.env.SERVER_ID || '1',
      serverName: process.env.SERVER_NAME || 'WebServer-Instance-1',
      hostname: os.hostname(),
      timestamp: new Date().toISOString(),
      uptime: process.uptime().toFixed(2),
      memoryUsage: process.memoryUsage(),
    });
  },

  // GET /api/server-logs
  serverLogs: async (req: Request, res: Response) => {
    try {
      const [logs]: any = await pool.query(
        'SELECT * FROM server_logs ORDER BY created_at DESC LIMIT 50'
      );
      res.json({ success: true, logs });
    } catch (err: any) {
      res.json({ success: false, message: err.message });
    }
  },
};

export default dashboardController;
