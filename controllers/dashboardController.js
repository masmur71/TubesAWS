// controllers/dashboardController.js
// Dashboard & Server Info Controller

const pool = require('../config/database');
const os = require('os');

const dashboardController = {
  // GET /dashboard
  index: async (req, res) => {
    try {
      const [membersCount] = await pool.query('SELECT COUNT(*) as total FROM members');
      const [usersCount] = await pool.query('SELECT COUNT(*) as total FROM users');
      const [members] = await pool.query('SELECT * FROM members ORDER BY id ASC');

      // Log this request
      const startTime = Date.now();
      await pool.query(
        `INSERT INTO server_logs (server_id, server_name, ip_address, user_agent, endpoint, method, status_code, response_time_ms)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          process.env.SERVER_ID || '1',
          process.env.SERVER_NAME || 'WebServer-Instance-1',
          req.ip || req.connection.remoteAddress,
          req.get('User-Agent'),
          req.path,
          req.method,
          200,
          Date.now() - startTime,
        ]
      );

      res.render('dashboard', {
        title: 'Dashboard - TUBES Komputasi Awan 2026',
        activePage: 'dashboard',
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
      res.render('dashboard', {
        title: 'Dashboard - TUBES Komputasi Awan 2026',
        activePage: 'dashboard',
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

  // GET /api/server-info - API endpoint untuk AJAX polling
  serverInfo: (req, res) => {
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

  // GET /api/server-logs - API untuk log history
  serverLogs: async (req, res) => {
    try {
      const [logs] = await pool.query(
        'SELECT * FROM server_logs ORDER BY created_at DESC LIMIT 50'
      );
      res.json({ success: true, logs });
    } catch (err) {
      res.json({ success: false, message: err.message });
    }
  },
};

module.exports = dashboardController;
