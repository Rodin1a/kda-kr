// PM2 Ecosystem Configuration for KDA.KR (Ubuntu Linux / 192.168.0.102)
// ponytail: host binding set to 0.0.0.0 for external reverse proxy access
module.exports = {
  apps: [
    {
      name: "kda-kr",
      script: "node_modules/next/dist/bin/next",
      args: "start -H 0.0.0.0 -p 3000",
      cwd: "./",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOST: "0.0.0.0",
      },
    },
  ],
};
