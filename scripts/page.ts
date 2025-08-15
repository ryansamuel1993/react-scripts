#!/usr/bin/env node
/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import process from 'node:process';
import { findPagesRoot } from '@utils'; 

const program = new Command();

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function write(filePath: string, content: string, force = false) {
  if (!force && fs.existsSync(filePath)) {
    throw new Error(`File already exists: ${filePath} (use --force to overwrite)`);
  }

  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${content.trim()}\n`, { flag: 'w' });
}

function normalizeRoute(input: string): string[] {
  const norm = input.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');

  if (!norm) {throw new Error('Route path cannot be empty.');}

  return norm.split('/').filter(Boolean);
}

function makePageContent() {
  return `
import { ReactElement } from 'react';

const Page = () => {
  return (
    <div>
      {/* TODO: page content */}
    </div>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <div>{page}</div>;
};

export default Page;
`;
}

type Opts = { root: string; force: boolean };

program
  .name('make-next-page')
  .description('Create a Next.js pages route folder with index.tsx.')
  .argument('<routePath>', 'Route (e.g., "customer" or "dashboard/settings")')
  .option('-r, --root <dir>', 'Start directory to locate the repo root', process.cwd())
  .option('-f, --force', 'Overwrite existing file if present', false)
  .action((routePath: string, opts: Opts) => {
    try {
      const start = path.isAbsolute(opts.root) ? opts.root : path.resolve(opts.root);
      const pagesRoot = findPagesRoot(start, /* createIfMissing */ true); 
      ensureDir(pagesRoot);

      const segments = normalizeRoute(routePath);
      const routeDir = path.join(pagesRoot, ...segments);
      const filePath = path.join(routeDir, 'index.tsx');

      const content = makePageContent();
      write(filePath, content, opts.force);

      console.log(`Pages root: ${pagesRoot}`);
      console.log(`✅ Created: ${filePath}`);
    } catch (err) {
      console.error(`❌ ${err instanceof Error ? err.message : String(err)}`);
      process.exit(1);
    }
  });

program.parse(process.argv);
