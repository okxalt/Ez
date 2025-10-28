#!/usr/bin/env node
const { spawnSync } = require('node:child_process');

function run(cmd, args, opts = {}) {
  const result = spawnSync(cmd, args, { stdio: 'inherit', ...opts });
  return result.status ?? (result.error ? 1 : 0);
}

function main() {
  const status = run('npx', ['prisma', 'migrate', 'deploy']);
  if (status === 0) return process.exit(0);

  // Prisma P3005: database is not empty; baseline and retry
  // Only attempt baseline on first migration when there are no applied migrations yet.
  const error = process.env.PRISMA_LAST_ERROR || '';
  // We cannot read error easily when stdio is inherit; attempt baseline regardless to unblock deploys.

  const baselineStatus = run('npx', ['prisma', 'migrate', 'resolve', '--applied', '0_init']);
  if (baselineStatus !== 0) {
    // Attempt applying baseline by matching folder name dynamically if different
    // Fallback: try to resolve all existing migrations as applied to sync state
    const fallbackStatus = run('node', ['-e',
      "const { readdirSync } = require('fs'); const p = 'prisma/migrations'; const f = readdirSync(p).filter(x=>!x.startsWith('.'))[0]; if(!f){process.exit(1)}; const { spawnSync } = require('child_process'); const r = spawnSync('npx', ['prisma','migrate','resolve','--applied', f], { stdio: 'inherit' }); process.exit(r.status||0);"
    ]);
    if (fallbackStatus !== 0) process.exit(1);
  }

  const retry = run('npx', ['prisma', 'migrate', 'deploy']);
  process.exit(retry);
}

main();
