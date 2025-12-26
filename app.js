const http = require('http');
const os = require('os');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');

  res.end(`
🚀 Node.js App Running in Docker!

📦 Environment Details:
- Node Version : ${process.version}
- Platform     : ${process.platform}
- Hostname     : ${os.hostname()}
- CPU Cores    : ${os.cpus().length}
- Total Memory : ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB

🌐 Request Details:
- Method       : ${req.method}
- URL          : ${req.url}
- Client IP    : ${req.socket.remoteAddress}

⏰ Server Time :
- ${new Date().toISOString()}

🎯 Deployment:
- Port         : ${process.env.PORT || 3000}
- Environment  : ${process.env.NODE_ENV || 'development'}

CI/CD Status:
- Deployed via GitHub Actions ✔
`);
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running at http://0.0.0.0:${port}/`);
});
