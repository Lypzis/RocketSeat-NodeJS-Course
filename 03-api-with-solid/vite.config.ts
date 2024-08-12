import { defineConfig } from 'vitest/config';
import tsConfigPaths from 'vite-tsconfig-paths';

// for vitest to recognize paths started by @
export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    environmentMatchGlobs: [['src/http/controllers/**', 'prisma']],
    dir: 'src',
  },
});
