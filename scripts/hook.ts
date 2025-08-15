#!/usr/bin/env node
/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import process from 'node:process';
import { computeHookNames, findProjectRoot, isDir, subdirs } from '@utils';

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

function normalizePath(input: string): string[] {
  const norm = input.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');

  if (!norm) {throw new Error('Hook path cannot be empty.');}

  return norm.split('/').filter(Boolean);
}

function findHooksRoot(startDir: string): string {
  const root = findProjectRoot(startDir);
  const candidates: string[] = [];

  // prefer existing top-level hooks first (adjust order if you want src/hooks as default)
  candidates.push(path.join(root, 'hooks'));
  candidates.push(path.join(root, 'src', 'hooks'));

  const hubs = ['apps', 'packages', 'modules'];

  for (const hub of hubs) {
    const hubPath = path.join(root, hub);

    if (!isDir(hubPath)) {continue;}

    for (const ws of subdirs(hubPath)) {
      candidates.push(path.join(ws, 'hooks'));
      candidates.push(path.join(ws, 'src', 'hooks'));
    }
  }

  for (const child of subdirs(root)) {
    candidates.push(path.join(child, 'hooks'));
    candidates.push(path.join(child, 'src', 'hooks'));
  }

  const found = candidates.find(isDir);

  if (found) {return found;}

  // 👇 ensure the fallback is actually created
  const fallback = path.join(root, 'hooks'); // or path.join(root, 'src', 'hooks') if you prefer
  fs.mkdirSync(fallback, { recursive: true });

  return fallback;
}

function makeHookContent(hookFn: string, typeBase: string) {
  return `
import { useCallback, useMemo, useRef, useState } from 'react';

export type ${typeBase}Options = {
  // TODO: add hook config
};

export type ${typeBase}Return = {
 
};

export const ${hookFn} = (): ${typeBase}Return => {
 

  return {
     
  };
};

export default ${hookFn};
`;
}

type Opts = { root: string; force: boolean; ext: 'ts' | 'tsx' };

program
  .name('make-hook')
  .description('Create a typed React hook file under the top-level hooks folder')
  .argument('<hookPath>', 'Hook path (e.g., "something" or "auth/verification" or "useUser")')
  .option('-r, --root <dir>', 'Start directory to locate the repo root', process.cwd())
  .option('-f, --force', 'Overwrite existing file if present', false)
  .option('--ext <ext>', 'File extension (ts or tsx)', 'tsx')
  .action((hookPath: string, opts: Opts) => {
    try {
      const start = path.isAbsolute(opts.root) ? opts.root : path.resolve(opts.root);
      const hooksRoot = findHooksRoot(start);
      ensureDir(hooksRoot);

      const segments = normalizePath(hookPath);
      const last = segments.pop() as string;
      const { hookFn, typeBase, fileBase } = computeHookNames(last);

      const destDir = path.join(hooksRoot, ...segments);
      const filePath = path.join(destDir, `${fileBase}.${opts.ext}`);

      const content = makeHookContent(hookFn, typeBase);
      write(filePath, content, opts.force);

      console.log(`Hooks root: ${hooksRoot}`);
      console.log(`✅ Created: ${filePath}`);
    } catch (err) {
      console.error(`❌ ${err instanceof Error ? err.message : String(err)}`);
      process.exit(1);
    }
  });

program.parse(process.argv);
