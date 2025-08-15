#!/usr/bin/env node
/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import process from 'node:process';
import { findProjectRoot, isDir, subdirs, toPascalCase } from '@utils';
const program = new Command();

function findComponentsRoot(startDir: string): string {
  const root = findProjectRoot(startDir);

  const candidates: string[] = [];

  candidates.push(path.join(root, 'components'));
  candidates.push(path.join(root, 'src', 'components'));

  const workspaceHubs = ['apps', 'packages', 'modules'];

  for (const hub of workspaceHubs) {
    const hubPath = path.join(root, hub);

    if (!isDir(hubPath)) {continue;}

    for (const app of subdirs(hubPath)) {
      candidates.push(path.join(app, 'components'));
      candidates.push(path.join(app, 'src', 'components'));
    }
  }

  for (const child of subdirs(root)) {
    candidates.push(path.join(child, 'components'));
    candidates.push(path.join(child, 'src', 'components'));
  }

  const existing = candidates.find(isDir);

  return existing ?? path.join(root, 'components');
}

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function write(filePath: string, content: string) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${content.trim()}\n`, { flag: 'w' });
}

function createEmptyComponentFile(componentsRoot: string, componentPath: string) {
  const normalized = componentPath.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');

  if (!normalized) {throw new Error('Component path cannot be empty.');}

  const segments = normalized.split('/').filter(Boolean);
  const last = segments.pop() as string;
  const fileBase = toPascalCase(last); 

  const parentDir = path.join(componentsRoot, ...segments);
  const tsxPath = path.join(parentDir, `${fileBase}.tsx`);

  const tsx = `
import { FC } from 'react';

export type ${fileBase}Props = {
  // TODO: define props
};

export const ${fileBase}: FC<${fileBase}Props> = (_props) => {
  // TODO
  return null;
};

export default ${fileBase};
`;

  write(tsxPath, tsx);

  return tsxPath;
}

program
  .argument('<componentPath>', 'Path under the components folder (e.g., button/alert)')
  .option('-r, --root <dir>', 'Start directory to locate the repo root', process.cwd())
  .action((componentPath: string, opts: { root: string }) => {
    const start = path.isAbsolute(opts.root) ? opts.root : path.resolve(opts.root);
    const componentsRoot = findComponentsRoot(start);
    ensureDir(componentsRoot);

    const created = createEmptyComponentFile(componentsRoot, componentPath);

    console.log(`Components root: ${componentsRoot}`);
    console.log(`✅ Created: ${created}`);
  });

program.parse(process.argv);
