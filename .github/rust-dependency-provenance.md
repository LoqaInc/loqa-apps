# Rust dependency provenance and validation

## Original request and coverage

This carrier covers only [LoqaInc/loqa-apps#11](https://github.com/LoqaInc/loqa-apps/pull/11),
`serde_with` 3.17.0 to 3.22.0, from Dependabot commit
`b32e4c74c6b9bd5d4a53240e6232b9ca98205bf3` on
`dependabot/cargo/src-tauri/serde_with-3.22.0`.

The carrier base is accepted master
`50159f8fc4076fb9a9f8a2d40b49ddc2e1b09803`. Its entire `src-tauri` tree
matches the original request's parent `919ae18b7fd0549c88ee1c290c9942241d4592cf`.
The carrier preserves the original Cargo.lock blob exactly:
`bbe23558e988408f3efaceb68702f97e68f1fc47` (SHA-256 of LF file bytes:
`87d96c2b17ebbea66727ade933c868aa2b37407e6a8d8bdf47ac9662a9eb57c5`).
There is no dependency regeneration or selective transcription.

The complete original delta includes:

- `serde_with` and `serde_with_macros` 3.17.0 to 3.22.0;
- `darling`, `darling_core`, and `darling_macro` 0.21.3 to 0.23.0;
- new `bs58`, `tinyvec`, `tinyvec_macros`, `jiff` and its core/static/time-zone
  packages, `defmt` and its macro/parser packages, and portable atomic packages;
- the original root lock entry's 0.1.1 to 0.2.0 correction and `tokio` edge,
  plus `tokio-macros` 2.6.1, matching the existing Cargo.toml;
- removal of the redundant `windows-core` 0.62.2, `windows-result` 0.4.1,
  and `windows-strings` 0.5.1 entries with the original remaining edge changes.

The ten npm dependency updates already merged through #16 remain untouched.
Original commits and refs are not rewritten or deleted. This document does not
claim that #11 has been merged, closed, or approved.

## Hosted compile contract

`rust-compile.yml` adds ordinary `pull_request` CI targeting master, including
draft PRs, and push CI for master and Mergify queue branches. It runs when
`src-tauri/**` or the workflow changes. The required job evidence is
**Windows locked Rust compile** on the reviewed PR merge tree, and subsequently
on the exact merged master commit. The job logs both the checked-out commit and
Cargo.lock blob, plus the actual Rust and Cargo versions.

The workflow uses a GitHub-hosted `windows-latest` runner, the project's existing
stable Rust channel and `x86_64-pc-windows-msvc` target, a 45-minute timeout, and
this command:

```sh
cargo +stable build --manifest-path src-tauri/Cargo.toml --locked --all-targets --target x86_64-pc-windows-msvc
```

This implements README's contributing requirement to run `cargo build`, with
locked resolution and all Windows targets (including compiling test targets).
It does not execute the application or tests. As with every native Cargo build,
dependency build scripts and procedural macros execute during compilation.

Checkout is the official `actions/checkout` v6 commit already used by accepted
E2E CI, pinned to `d23441a48e516b6c34aea4fa41551a30e30af803`, with persisted
credentials disabled. Job permissions are `contents: read`. No secret or account
is supplied to build commands. There is no application session, production API
request, Tauri release build, installer, signing, deploy, artifact publication,
manual workflow dispatch, or privileged pull-request trigger. The workflow does
not use the existing release workflows. Dependencies and the stable toolchain
are downloaded normally by Cargo and rustup.

Stable is the existing release-workflow and README installation contract; this
change does not invent or certify a minimum supported Rust version. In particular,
it does not validate README's historical Rust 1.77 floor. Linux, macOS, Android,
iOS, packaging, runtime behavior, and desktop E2E are outside this Windows compile
check. A compiler failure remains a failure; removing `--locked`, excluding
failing targets, or replacing compilation with discovery is not an acceptance.

## Local validation and remaining acceptance

Local preparation performed static checks only: parsed Cargo.toml and Cargo.lock,
verified byte equality with #11's lock blob and Rust base equality, and resolved
all 1,956 dependency references uniquely across 607 locked packages. Registry
packages have SHA-256 checksum fields. This checks the lock's internal structure;
Cargo's hosted locked build must verify resolution, downloaded checksums, build
scripts, linking, and compiler compatibility.

The workflow was parsed and its triggers, permissions, pinned checkout, exact
compile command, and unchanged-lock check inspected. `git diff --check` passed.
No local Rust compilation or heavyweight battery ran. At carrier preparation,
hosted compilation and an independent review are pending. A later passing run
must be bound to the reviewed source and actual toolchain before acceptance.
