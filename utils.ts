import fs from 'fs';
import path from 'path';

export function toPascalCase(name: string): string {
  return name
    .trim()
    .replace(/(^|[-_\s/\\])+(.)/g, (_m, _sep, c) => (c ? c.toUpperCase() : ''))
    .replace(/[^A-Za-z0-9]/g, '');
}

export function isDir(p: string) {
  try { return fs.statSync(p).isDirectory(); } catch { return false; }
}

export function subdirs(dir: string): string[] {
  try {
    return fs.readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => path.join(dir, d.name));
  } catch {
    return [];
  }
}

export function findProjectRoot(start: string): string {
  let curr = path.resolve(start);
  const fsRoot = path.parse(curr).root;

  while (curr !== fsRoot) {
    if (
      fs.existsSync(path.join(curr, 'package.json')) ||
      fs.existsSync(path.join(curr, '.git'))
    ) {
      return curr;
    }

    curr = path.dirname(curr);
  }

  // Optional: check the root itself once
  if (
    fs.existsSync(path.join(fsRoot, 'package.json')) ||
    fs.existsSync(path.join(fsRoot, '.git'))
  ) {
    return fsRoot;
  }

  return path.resolve(start);
}


export type FindRouteOptions = {
  targets: string[];
  hubs?: string[];
  includeImmediateChildren?: boolean;
  createIfMissing?: boolean;
};

function joinTarget(base: string, rel: string) {
  return path.join(base, ...rel.split(/[\\/]/).filter(Boolean));
}

export function findRoute(startDir: string, opts: FindRouteOptions): string {
  const {
    targets,
    hubs = ['apps', 'packages', 'modules'],
    includeImmediateChildren = true,
    createIfMissing = false,
  } = opts;

  if (!targets.length) {
    throw new Error('findRoute: opts.targets must contain at least one path');
  }

  const root = findProjectRoot(startDir);
  const candidates: string[] = [];

  for (const t of targets) {candidates.push(joinTarget(root, t));}

  for (const hub of hubs) {
    const hubPath = path.join(root, hub);

    if (!isDir(hubPath)) {continue;}

    for (const workspace of subdirs(hubPath)) {
      for (const t of targets) {candidates.push(joinTarget(workspace, t));}
    }
  }

  if (includeImmediateChildren) {
    for (const child of subdirs(root)) {
      for (const t of targets) {candidates.push(joinTarget(child, t));}
    }
  }

  const seen = new Set<string>();

  for (const c of candidates) {
    if (seen.has(c)) {continue;}

    seen.add(c);

    if (isDir(c)) {return c;}
  }

  const fallback = joinTarget(root, targets[0]);

  if (createIfMissing) {fs.mkdirSync(fallback, { recursive: true });}

  return fallback;
}

export const findPagesRoot = (startDir: string, createIfMissing = false) =>
  findRoute(startDir, { targets: ['pages', 'src/pages'], createIfMissing });

export const findComponentsRoot = (startDir: string, createIfMissing = false) =>
  findRoute(startDir, { targets: ['components', 'src/components'], createIfMissing });

export type HookNameParts = {
  hookFn: string;
  typeBase: string;
  fileBase: string;
  core: string;
};

export function computeHookNames(lastSegment: string): HookNameParts {
  let pascal = toPascalCase(lastSegment);

  if (!pascal) {pascal = 'Hook';}

  let core = pascal.startsWith('Use') ? pascal.slice(3) : pascal;

  if (!core) {core = 'Hook';}

  const hookFn = `use${core}`;
  const typeBase = `Use${core}`;
  const fileBase = hookFn;

  return { hookFn, typeBase, fileBase, core };
}
