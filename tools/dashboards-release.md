# Dashboards release preparation

```sh
node tools/dashboards-release.js --plan
node tools/dashboards-release.js
```

Requires Node 22 or later, Highcharts on `master`, and sibling `highcharts-utils` and `dashboards-dist` clones. The shared runner uses Node built-ins and the existing npm/Gulp tasks, so resetting `node_modules` does not stop the script.

Destructive steps show a bold yellow **Approval required:** label and wait for `approve`. Manual checks show a bold cyan **Confirmation required:** label and wait for `done`. Both respect `NO_COLOR`. Unrecognized answers repeat the prompt. Type `cancel` or `no` to stop; failed commands, EOF and Ctrl+C also stop execution. `--plan` prints the workflow without side effects and works without a terminal.

1. **Reset:** Approve removal of `build code cypress js node_modules out tmp`. Cleanup reports progress. Manually reset `dashboards-dist` or commit and push work worth keeping; leave it clean, including untracked files, on `main`. Pull Highcharts with `git pull --ff-only`, then run `npm i` in Highcharts and highcharts-utils. The lockfile is preserved.
2. **Source checks:** Disable Compile on Demand in the utils UI and set `compileOnDemand` and `useMinifiedCode` to `false` in its `config.json`. Verify `highchartsDir` points to this checkout and restart utils. This manual checkpoint also appears when resuming the dry-run phase; the script trusts your confirmation without reading these settings. Build Highcharts with `npx gulp scripts`, confirm the version in `tools/gulptasks/dashboards/build-properties.json`, then run `npm run gcode`, `npm run dtest` and `npm test`.
3. **Distribution checks:** Approve `npx gulp dist --with-deps`. This is the current task for building minified Highcharts, Grid and Dashboards together, preserving dependency code between builds; `--dashboards-all` is not a supported flag. Set `useMinifiedCode` to `true`, keep Compile on Demand disabled, restart utils, and confirm all Dashboards and Grid demos pass. Inspect the versioned Dashboards ZIP under `build/dist/` (unpacked contents are in `build/dist/dashboards`), including its code, declarations and examples, and compare packaged code with `dashboards-dist`.
4. **Release candidate:** For non-bugfix releases or major changes, confirm with `done`; for a bugfix that does not need a candidate, enter `skip`. After approval, the script runs `npx gulp dist-release --product Dashboards`. This pulls/rebases and replaces distribution repository files, then runs npm publication in dry-run mode. It does not commit, tag, push, publish, or execute the suggested publish commands. Review the resulting `dashboards-dist` contents against the ZIP.

Use `--from dry-run` or `--from candidate` to restart after resolving a failure. Earlier prerequisites are your responsibility when resuming. Use `--allow-non-master` to debug on another Highcharts branch; commands operate on the current checkout and approval prompts remain active. Completed steps are not rolled back, and the utils config remains in minified mode.

Validation without running a release:

```sh
node --test tools/gulptasks-tests/grid-release.test.mjs
node tools/dashboards-release.js --help
node tools/dashboards-release.js --plan
node tools/dashboards-release.js < /dev/null # Expected failure
```
