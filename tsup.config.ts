import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    'scripts/component': 'scripts/component.ts',
    'scripts/page': 'scripts/page.ts',
    'scripts/hook': 'scripts/hook.ts'
  },
  format: 'esm',
  platform: 'node',
  target: 'node20',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  dts: false,
  banner: { js: '#!/usr/bin/env node' }
});
