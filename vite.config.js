import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        projects: resolve(__dirname, 'projects.html'),
        contact: resolve(__dirname, 'contact.html'),
        reports: resolve(__dirname, 'reports.html'),
        certificates: resolve(__dirname, 'certificates.html'),
        resume: resolve(__dirname, 'resume.html')
      }
    }
  }
});
