# E2E dependency cohort

This carrier combines the ten requested development-lock updates against master
`919ae18b7fd0549c88ee1c290c9942241d4592cf`. It changes no direct dependency
constraints in package.json. Each changed package record, including its resolved
URL, integrity hash, dependency constraints and flags, is copied exactly from the
specified source head. The three overlapping #5/#7 records agree in full.
Untouched package records remain unchanged. Rust #11 is a separate update.

| Original PR | Source head | Required resolution |
| --- | --- | --- |
| [#1](https://github.com/LoqaInc/loqa-apps/pull/1) | `53d174aeb08bba78452ce5874169a3e09eef42db` | basic-ftp 5.3.1 |
| [#3](https://github.com/LoqaInc/loqa-apps/pull/3) | `c9f84ea13d92c40100727ae1d05c5864a4d269f5` | ws 8.21.1 |
| [#5](https://github.com/LoqaInc/loqa-apps/pull/5) | `2f92577d1276a1b55a0bb72b55886fa3d671ea78` | fast-xml-builder 1.3.0, path-expression-matcher 1.6.2, xml-naming 0.3.0 |
| [#6](https://github.com/LoqaInc/loqa-apps/pull/6) | `3c53c122252e45be13ea878d208a73744a098a9e` | esbuild 0.28.1 and its platform packages; tsx 4.23.1 |
| [#7](https://github.com/LoqaInc/loqa-apps/pull/7) | `69ba4ee5adb5efd8afa659515b1060ab869217cf` | fast-xml-parser 5.10.1 and its dependency closure, including the #5 nodes |
| [#8](https://github.com/LoqaInc/loqa-apps/pull/8) | `23a6d08ed8bca4e6527f9637adb86b55752500c2` | lodash 4.18.1 |
| [#12](https://github.com/LoqaInc/loqa-apps/pull/12) | `e338f9c5e4491bf82ab9ea20a33f6e34ef459909` | js-yaml 4.3.2 |
| [#13](https://github.com/LoqaInc/loqa-apps/pull/13) | `0ece74f1c3a660813b458593a178f69fcc81d050` | ip-address 10.7.2 |
| [#14](https://github.com/LoqaInc/loqa-apps/pull/14) | `c25fec9e53d1b611583828dc3a7d942b4c511bc0` | undici 6.29.0 plus cheerio nested undici 7.30.0 |
| [#15](https://github.com/LoqaInc/loqa-apps/pull/15) | `12ad0c13851b72b8e1aaf70b7bcf1f0a07e3714e` | brace-expansion 2.1.7 plus recursive-readdir nested brace-expansion 1.1.21 |

## Validation

The E2E tooling workflow installs the exact lock with npm ci --ignore-scripts,
checks the installed dependency graph, and loads the WDIO CLI help. The small
tooling script transpiles wdio.conf.ts and the desktop spec sources through the
installed native esbuild binary, then loads the specs through the locked tsx
and Mocha tools in dry-run mode. Empty discovery fails. The workflow logs the
Node 24/npm versions and runs on hosted Windows; action revisions are pinned.

These checks prove installability, CLI loading, transpilation and spec discovery.
They do not execute desktop test bodies, hooks, driver downloads, authentication,
or the app. They are not a typecheck or an end-to-end product result. The current
app configuration loads app.loqa.chat, so npm test is outside this isolated job.
Mocha dry-run still loads suite declarations; keep top-level spec code free of
application/network side effects. CI results and independent review are pending.

The workflow runs on matching PRs, master pushes and default Mergify queue-branch
pushes. Adding it does not make its check required in repository protection.
The coordinator must verify the actual run and exact-source review before landing.
A green Mergify summary alone is not dependency validation.

## Original PR disposition

Keep all original branches. The carrier must merge and its requested resolutions
must be verified in the merged tree before closing any original as covered.
Closure notes must link the carrier and exact merge SHA; #5 is not already
superseded merely because its records are included in #7. No branch cleanup or
repository setting/protection change is part of this PR.

The separate Rust update requires a locked native compile of src-tauri, following
the repository README, plus review of its full Cargo.lock closure. This npm
workflow does not validate Rust, run a release workflow, or use signing secrets.

References: [npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci/),
[esbuild build API](https://esbuild.github.io/api/#build),
[Mocha dry-run](https://mochajs.org/running/cli/#--dry-run).
