import { defineConfig, loadEnv } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};
  return {
    server: {
      host: process.env.VITE_HOST ?? '0.0.0.0',
      port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    },
    preview: {
      allowedHosts: process.env.VITE_CLOUD_HOST ? [process.env.VITE_CLOUD_HOST] : [],
      host: '0.0.0.0',
    },
  };
});
