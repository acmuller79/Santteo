import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, Plugin} from 'vite';

function saveLogoPlugin(): Plugin {
  return {
    name: 'save-logo-plugin',
    configureServer(server) {
      server.middlewares.use('/api/save-logo', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: Buffer) => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              if (data.image && typeof data.image === 'string' && data.image.startsWith('data:image')) {
                const base64Data = data.image.replace(/^data:image\/\w+;base64,/, '');
                const buffer = Buffer.from(base64Data, 'base64');
                const publicPath = path.resolve(__dirname, 'public/santteo_shield_logo.jpg');
                const srcPath = path.resolve(__dirname, 'src/assets/images/santteo_shield_logo.jpg');
                fs.writeFileSync(publicPath, buffer);
                fs.writeFileSync(srcPath, buffer);
                console.log('Successfully saved official Santtêo logo to disk!');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
                return;
              }
            } catch (err) {
              console.error('Error saving logo in Vite server:', err);
            }
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'invalid data' }));
          });
        } else {
          res.writeHead(405);
          res.end();
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), saveLogoPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
