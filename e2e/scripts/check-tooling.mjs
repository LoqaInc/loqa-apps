// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Loqa Contributors
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { globSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const root = fileURLToPath(new URL('../', import.meta.url));
const specs = globSync('specs/**/*.e2e.ts', { cwd: root }).sort();
assert.ok(specs.length > 0, 'No desktop spec files found');

// Exercise the installed native esbuild binary against real sources without
// evaluating wdio.conf.ts or invoking its driver/download lifecycle hooks.
await build({
  absWorkingDir: root,
  entryPoints: ['wdio.conf.ts', ...specs],
  outdir: '.tooling-check',
  write: false,
  bundle: false,
  platform: 'node',
  format: 'cjs',
});

// Use the locked tsx and Mocha tools for real TypeScript spec discovery.
// Mocha's dry-run loads suites but executes neither test bodies nor hooks.
const output = execFileSync(process.execPath, [
  resolve(root, 'node_modules/tsx/dist/cli.mjs'),
  resolve(root, 'node_modules/mocha/bin/mocha.js'),
  '--no-config', '--no-package', '--dry-run', '--fail-zero', '--reporter', 'json',
  ...specs,
], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'], timeout: 60_000 });
const discovered = JSON.parse(output);
assert.ok(discovered.tests.length > 0, 'No desktop tests discovered');
assert.equal(discovered.stats.tests, discovered.tests.length);
console.log(`Transpiled ${specs.length + 1} source files; discovered ${discovered.tests.length} desktop specs.`);
console.log('Discovery only: desktop test bodies and hooks were not executed.');
