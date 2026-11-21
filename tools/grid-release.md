# Grid release preparation

Run from a terminal with Node 22 or later:

```sh
node tools/grid-release.js --plan
node tools/grid-release.js
```

The script uses Node built-ins so it can start without `node_modules` and continue after deleting it. It calls the existing npm and Gulp tasks. It requires the Highcharts checkout on `master` and sibling `highcharts-utils`, `grid-lite-dist` and `grid-pro-dist` repositories. The Grid distribution repositories must be on `main`, with no untracked or uncommitted files.

For debugging on another Highcharts branch, use `node tools/grid-release.js --allow-non-master`. This bypasses the Highcharts branch, clean-worktree and remote-commit checks. Approval prompts and manual checkpoints remain active, and commands (including `git pull --ff-only`) operate on your current checkout. You can combine it with `--from dry-run` or `--from candidate`.

Type `approve` before deletion or replacement of generated files and distribution repository contents. These prompts start with a bold yellow `Approval required:` label in terminals (set `NO_COLOR` to disable color). Type `done` after each manual task, marked with a bold cyan `Confirmation required:` label. Unrecognized answers repeat the prompt. Type `cancel` or `no` to stop; EOF, Ctrl+C and failed commands also stop the script. There is no automatic approval option. Non-interactive runs can use `--plan`, which only prints the checklist.

After reset approval, cleanup reports each directory before and after removal, with a progress message every five seconds for slow removals. Large directories such as `node_modules` can take time. The next confirmation appears once cleanup finishes.

1. **Reset:** Approve deletion of `build code cypress js node_modules out tmp`. Manually reset each distribution repository or commit and push changes worth keeping. Pull Highcharts with `git pull --ff-only`, then install dependencies in Highcharts and highcharts-utils. The lockfile is preserved.
2. **Dry run:** Approve `npx gulp dist`; the script runs it to build Highcharts and its declarations. Verify/update the Grid version in `tools/gulptasks/grid/build-properties.json`. Build Grid and Highcharts, run `npm run gtest`, then build the Grid distribution. Set `useMinifiedCode` to `true` in the utils config (the script checks this) and verify `highchartsDir` points to this checkout. Rebuild Highcharts and compile. Restart the utils server and check all Lite/Pro demos, then inspect both release ZIPs under `build/dist/`.
3. **Release candidate (Dev team):** Confirm dry-run checks passed, then approve `npx gulp dist-release --product Grid`. This task pulls/rebases and replaces contents in both distribution repositories. Changes remain local, without committing, tagging or pushing.

After fixing a failure, restart a phase with `--from dry-run` or `--from candidate`. Earlier phases are not rechecked automatically: only resume when their prerequisites are still valid. If source or version changed, repeat the dry run. This script does not roll back completed commands; review local changes after stopping. The utils configuration remains in minified mode.

Validation (does not run a release):

```sh
node --test tools/gulptasks-tests/grid-release.test.mjs
node tools/grid-release.js --help
node tools/grid-release.js --plan
node tools/grid-release.js < /dev/null # Expected failure
```

Normal runs require a clean Highcharts checkout, including untracked files. Before builds or candidate preparation, the script fetches `origin/master` and requires `HEAD` to match it. It checks again after version confirmation and before copying the candidate. Commit and push version changes before continuing. The debugging override permits local changes and unpushed commits; use it only for local testing.
