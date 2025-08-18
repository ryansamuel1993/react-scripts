#!/usr/bin/env node
/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import process, { stdin as input, stdout as output } from 'node:process';
import { createInterface } from 'node:readline/promises';
import { findProjectRoot, isDir } from '@utils';

const program = new Command();

const FOLDERS = ['pages', 'features', 'components', 'hooks', 'context', 'services'] as const;

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function detectBase(startDir: string) {
  const root = findProjectRoot(startDir);
  const src = path.join(root, 'src');

  if (isDir(src)) {return { base: src, root, usedSrc: true };}

  return { base: root, root, usedSrc: false };
}

async function confirmProceed(message: string) {
  const rl = createInterface({ input, output });
  const ans = (await rl.question(`${message} [y/N]: `)).trim().toLowerCase();
  rl.close();

  return ans === 'y' || ans === 'yes';
}

type Opts = {
  root: string;
  yes: boolean;
  dryRun: boolean;
};

program
  .name('create-folders')
  .description('Create pages, features, components, hooks, context, and services under src/ (or project root if src not found).')
  .option('-r, --root <dir>', 'Start directory to locate the repo root', process.cwd())
  .option('-y, --yes', 'Skip prompt and proceed in project root if src/ is missing', false)
  .option('--dry-run', 'Preview without creating anything', false)
  .action(async (opts: Opts) => {
    try {
      const start = path.isAbsolute(opts.root) ? opts.root : path.resolve(opts.root);
      const { base, root, usedSrc } = detectBase(start);

      if (!usedSrc && !opts.yes) {
        const proceed = await confirmProceed(
          `No "src" folder found at ${root}.\nCreate folders directly in project root instead?`
        );

        if (!proceed) {
          console.log('Aborted.');
          process.exit(1);
        }
      }

      const target = usedSrc ? base : root;

      const created: string[] = [];
      const existed: string[] = [];

      for (const folder of FOLDERS) {
        const dir = path.join(target, folder);

        if (fs.existsSync(dir)) {
          existed.push(dir);
        } else {
          if (!opts.dryRun) {ensureDir(dir);}

          created.push(dir);
        }
      }

      console.log(`\nBase directory: ${target}`);

      if (opts.dryRun) {console.log('(dry run) No changes were made.\n');}

      if (created.length) {
        console.log('✅ Created:');
        created.forEach((d) => console.log(`  - ${d}`));
      } else {
        console.log('✅ Nothing to create (all folders already exist).');
      }

      if (existed.length) {
        console.log('\nℹ️ Already existed:');
        existed.forEach((d) => console.log(`  - ${d}`));
      }

      console.log('');
    } catch (err) {
      console.error(`❌ ${err instanceof Error ? err.message : String(err)}`);
      process.exit(1);
    }
  });

program.parse(process.argv);
