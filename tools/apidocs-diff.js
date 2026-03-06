// @ts-check

const ChildProcess = require('node:child_process');
const Fs = require('node:fs');
const Os = require('node:os');
const Path = require('node:path');

const TREE_FILE_PATTERN = /^tree.*\.json$/u;
const IGNORED_META_FIELDS = ['commit', 'date'];

/**
 * @typedef {{
 *   command: 'compare'|'make-reference'|'compare-reference',
 *   base: string,
 *   output: string,
 *   referenceDir: string,
 *   currentDir: (string|undefined),
 *   githubOutput: (string|undefined),
 *   fetchBase: boolean,
 *   help: boolean
 * }} CliOptions
 */

/**
 * Throw an error with a clear message.
 * @param {string} message Error message.
 * @return {never} This function always throws.
 */
function fail(message) {
    throw new Error(message);
}

/**
 * Get the value for a command line option.
 * @param {string[]} argv Parsed raw CLI arguments.
 * @param {string} token Option flag currently being parsed.
 * @param {number} index Index where the option value should exist.
 * @return {string} Option value.
 */
function requireValue(argv, token, index) {
    const value = argv[index];
    if (!value || value.startsWith('-')) {
        fail(`Missing value for ${token}`);
    }
    return value;
}

/**
 * Parse command line arguments.
 * @param {string[]} argv Raw process arguments.
 * @return {CliOptions} Parsed script options.
 */
function parseCli(argv) {
    /** @type {CliOptions} */
    const options = {
        command: 'compare',
        base: 'origin/master',
        output: '/tmp/changes.md',
        referenceDir: '.apidocs-diff-reference',
        currentDir: void 0,
        githubOutput: void 0,
        fetchBase: false,
        help: false
    };

    let index = 2;
    if (argv[index] && !argv[index].startsWith('-')) {
        const command = argv[index];
        if (
            command !== 'compare' &&
            command !== 'make-reference' &&
            command !== 'compare-reference'
        ) {
            fail(`Unknown command: ${command}`);
        }
        options.command = command;
        index += 1;
    }

    while (index < argv.length) {
        const token = argv[index];
        switch (token) {
            case '--base':
                options.base = requireValue(argv, token, ++index);
                index += 1;
                break;
            case '--output':
            case '--out':
                options.output = requireValue(argv, token, ++index);
                index += 1;
                break;
            case '--reference-dir':
                options.referenceDir = requireValue(argv, token, ++index);
                index += 1;
                break;
            case '--current-dir':
                options.currentDir = requireValue(argv, token, ++index);
                index += 1;
                break;
            case '--github-output':
                options.githubOutput = requireValue(argv, token, ++index);
                index += 1;
                break;
            case '--fetch-base':
                options.fetchBase = true;
                index += 1;
                break;
            case '--help':
            case '-h':
                options.help = true;
                index += 1;
                break;
            default:
                fail(`Unknown option: ${token}`);
        }
    }

    return options;
}

/**
 * Execute a command synchronously and validate its exit code.
 * @param {string} command
 *   Executable name.
 * @param {string[]} args
 *   Command arguments.
 * @param {{
 *   cwd?: string,
 *   input?: string,
 *   capture?: boolean,
 *   allowedStatus?: number[]
 * }} [options] Execution settings.
 * @return {ChildProcess.SpawnSyncReturns<string>} Spawn result.
 */
function run(command, args, options = {}) {
    const {
        cwd,
        input,
        capture = false,
        allowedStatus = [0]
    } = options;

    const result = ChildProcess.spawnSync(command, args, {
        cwd,
        env: {
            ...process.env,
            CI: 'true'
        },
        stdio: capture ? ['pipe', 'pipe', 'pipe'] : 'inherit',
        encoding: 'utf8',
        input
    });

    if (result.error) {
        throw result.error;
    }

    if (!allowedStatus.includes(result.status || 0)) {
        const stderr = (result.stderr || '').trim();
        const stdout = (result.stdout || '').trim();
        const details = stderr || stdout;
        throw new Error(
            `Command failed: ${command} ${args.join(' ')}${
                details ? `\n${details}` : ''
            }`
        );
    }

    return result;
}

/**
 * Fetch the configured base reference from origin.
 * @param {string} repoRoot Repository root path.
 * @param {string} base Base branch or ref.
 * @return {void} Nothing.
 */
function fetchBaseRef(repoRoot, base) {
    const baseRef = base.startsWith('origin/') ? base.slice(7) : base;
    run('git', ['fetch', '--depth=1', 'origin', baseRef], { cwd: repoRoot });
}

/**
 * List tree JSON files in a directory.
 * @param {string} directory Directory path to scan.
 * @return {string[]} Sorted tree file names.
 */
function listTreeFiles(directory) {
    if (!Fs.existsSync(directory)) {
        return [];
    }

    return Fs.readdirSync(directory, { withFileTypes: true })
        .filter(entry => entry.isFile() && TREE_FILE_PATTERN.test(entry.name))
        .map(entry => entry.name)
        .sort();
}

/**
 * Copy a file or symbolic link to a target path.
 * @param {string} sourcePath Absolute source path.
 * @param {string} targetPath Absolute destination path.
 * @return {void} Nothing.
 */
function copyPath(sourcePath, targetPath) {
    const sourceStat = Fs.lstatSync(sourcePath);

    Fs.mkdirSync(Path.dirname(targetPath), { recursive: true });

    if (sourceStat.isSymbolicLink()) {
        const linkTarget = Fs.readlinkSync(sourcePath);
        Fs.symlinkSync(linkTarget, targetPath);
        return;
    }

    Fs.copyFileSync(sourcePath, targetPath);
}

/**
 * Copy generated tree files from one directory to another.
 * @param {string} sourceDirectory Directory containing source tree files.
 * @param {string} targetDirectory Destination directory for tree files.
 * @return {string[]} Copied tree file names.
 */
function copyTreeFiles(sourceDirectory, targetDirectory) {
    Fs.mkdirSync(targetDirectory, { recursive: true });

    for (const fileName of listTreeFiles(targetDirectory)) {
        Fs.rmSync(Path.join(targetDirectory, fileName), { force: true });
    }

    const files = listTreeFiles(sourceDirectory);
    for (const fileName of files) {
        copyPath(
            Path.join(sourceDirectory, fileName),
            Path.join(targetDirectory, fileName)
        );
    }

    return files;
}

/**
 * Remove volatile metadata fields from parsed tree JSON.
 * @param {Record<string, any>} parsedTree Parsed tree JSON object.
 * @return {void} Nothing.
 */
function stripIgnoredMetaFields(parsedTree) {
    for (const key of ['meta', '_meta']) {
        const meta = parsedTree[key];
        if (!meta || typeof meta !== 'object' || Array.isArray(meta)) {
            continue;
        }

        for (const field of IGNORED_META_FIELDS) {
            if (Object.prototype.hasOwnProperty.call(meta, field)) {
                delete meta[field];
            }
        }
    }
}

/**
 * Normalize tree JSON files in a snapshot directory before diffing.
 * @param {string} snapshotDirectory Directory containing copied tree JSON files.
 * @return {void} Nothing.
 */
function normalizeSnapshotTrees(snapshotDirectory) {
    for (const fileName of listTreeFiles(snapshotDirectory)) {
        const filePath = Path.join(snapshotDirectory, fileName);
        const originalContent = Fs.readFileSync(filePath, 'utf8');

        try {
            /** @type {Record<string, any>} */
            const parsed = JSON.parse(originalContent);
            if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
                continue;
            }

            stripIgnoredMetaFields(parsed);
            Fs.writeFileSync(filePath, `${JSON.stringify(parsed, null, 4)}\n`, 'utf8');
        } catch {
            // Keep original content when parsing fails.
        }
    }
}

/**
 * Link node_modules from repository root into a worktree.
 * @param {string} repoRoot Repository root path.
 * @param {string} worktreePath Temporary worktree path.
 * @return {void} Nothing.
 */
function linkNodeModules(repoRoot, worktreePath) {
    const source = Path.join(repoRoot, 'node_modules');
    const target = Path.join(worktreePath, 'node_modules');

    if (!Fs.existsSync(source)) {
        fail('Missing node_modules in repository root. Run npm ci first.');
    }

    if (!Fs.existsSync(target)) {
        Fs.symlinkSync(source, target, process.platform === 'win32' ? 'junction' : 'dir');
    }
}

/**
 * Generate tree JSON outputs in a worktree.
 * @param {string} worktreePath Temporary worktree path.
 * @return {void} Nothing.
 */
function generateTrees(worktreePath) {
    const gulpBinary = Path.join(
        worktreePath,
        'node_modules',
        '.bin',
        process.platform === 'win32' ? 'gulp.cmd' : 'gulp'
    );

    if (!Fs.existsSync(gulpBinary)) {
        fail('Unable to find gulp binary. Run npm ci first.');
    }

    run(gulpBinary, ['generate-samples'], { cwd: worktreePath });
    run(gulpBinary, ['jsdoc-dts'], { cwd: worktreePath });
}

/**
 * List untracked files in the repository.
 * @param {string} repoRoot Repository root path.
 * @return {string[]} Untracked repository-relative file paths.
 */
function listUntrackedFiles(repoRoot) {
    const result = ChildProcess.spawnSync(
        'git',
        ['ls-files', '--others', '--exclude-standard', '-z'],
        {
            cwd: repoRoot,
            stdio: ['pipe', 'pipe', 'pipe']
        }
    );

    if (result.error) {
        throw result.error;
    }

    if (result.status !== 0) {
        throw new Error('Unable to read untracked files.');
    }

    return result.stdout
        .toString('utf8')
        .split('\0')
        .filter(Boolean);
}

/**
 * Collect tracked file operations needed to mirror local changes.
 * @param {string} repoRoot Repository root path.
 * @return {Array<{ action: 'copy'|'remove', sourcePath?: string, targetRelativePath: string }>} Operations to apply in the temporary worktree.
 */
function listTrackedWorkingTreeChanges(repoRoot) {
    const result = ChildProcess.spawnSync(
        'git',
        ['diff', '--name-status', '--find-renames', '--find-copies', '-z', 'HEAD'],
        {
            cwd: repoRoot,
            stdio: ['pipe', 'pipe', 'pipe']
        }
    );

    if (result.error) {
        throw result.error;
    }

    if (result.status !== 0) {
        throw new Error('Unable to read tracked working tree changes.');
    }

    const tokens = result.stdout
        .toString('utf8')
        .split('\0')
        .filter(Boolean);
    /** @type {Array<{ action: 'copy'|'remove', sourcePath?: string, targetRelativePath: string }>} */
    const operations = [];

    for (let index = 0; index < tokens.length;) {
        const statusToken = tokens[index++];
        const statusCode = statusToken[0];

        if (statusCode === 'R' || statusCode === 'C') {
            const sourceRelativePath = tokens[index++];
            const targetRelativePath = tokens[index++];

            if (!sourceRelativePath || !targetRelativePath) {
                fail('Unable to parse rename/copy entry from git diff output.');
            }

            if (statusCode === 'R') {
                operations.push({
                    action: 'remove',
                    targetRelativePath: sourceRelativePath
                });
            }

            operations.push({
                action: 'copy',
                sourcePath: Path.resolve(repoRoot, targetRelativePath),
                targetRelativePath
            });

            continue;
        }

        const targetRelativePath = tokens[index++];

        if (!targetRelativePath) {
            fail('Unable to parse file entry from git diff output.');
        }

        if (statusCode === 'D') {
            operations.push({
                action: 'remove',
                targetRelativePath
            });
            continue;
        }

        operations.push({
            action: 'copy',
            sourcePath: Path.resolve(repoRoot, targetRelativePath),
            targetRelativePath
        });
    }

    return operations;
}

/**
 * Resolve a relative path safely inside a temporary worktree.
 * @param {string} worktreePath Absolute temporary worktree path.
 * @param {string} relativePath Repository-relative file path.
 * @return {string} Absolute path constrained to the worktree.
 */
function getSafeTargetPath(worktreePath, relativePath) {
    const targetPath = Path.resolve(worktreePath, relativePath);
    if (!targetPath.startsWith(`${worktreePath}${Path.sep}`)) {
        fail(`Refusing to write outside worktree: ${relativePath}`);
    }
    return targetPath;
}

/**
 * Apply local tracked and untracked changes to a temporary worktree.
 * @param {string} repoRoot Repository root path.
 * @param {string} worktreePath Absolute temporary worktree path.
 * @return {void} Nothing.
 */
function applyLocalChanges(repoRoot, worktreePath) {
    process.stdout.write('Applying local working tree changes to temporary worktree...\n');

    const trackedOperations = listTrackedWorkingTreeChanges(repoRoot);
    const untrackedFiles = listUntrackedFiles(repoRoot);

    process.stdout.write(
        `Syncing ${trackedOperations.length} tracked change(s) and ${untrackedFiles.length} untracked file(s)...\n`
    );

    for (const operation of trackedOperations) {
        const targetPath = getSafeTargetPath(
            worktreePath,
            operation.targetRelativePath
        );

        if (operation.action === 'remove') {
            Fs.rmSync(targetPath, { recursive: true, force: true });
            continue;
        }

        if (!operation.sourcePath || !Fs.existsSync(operation.sourcePath)) {
            Fs.rmSync(targetPath, { recursive: true, force: true });
            continue;
        }

        copyPath(operation.sourcePath, targetPath);
    }

    for (const relativePath of untrackedFiles) {
        const sourcePath = Path.resolve(repoRoot, relativePath);
        const targetPath = getSafeTargetPath(worktreePath, relativePath);

        copyPath(sourcePath, targetPath);
    }
}

/**
 * Create a detached temporary worktree for a specific git ref.
 * @param {string} repoRoot Repository root path.
 * @param {string} tempRoot Temporary parent directory for worktrees.
 * @param {string} name Subdirectory name for the worktree.
 * @param {string} gitRef Git ref to check out in detached mode.
 * @param {string[]} cleanupWorktrees List of worktrees to remove during cleanup.
 * @return {string} Absolute path to the created worktree.
 */
function createWorktree(repoRoot, tempRoot, name, gitRef, cleanupWorktrees) {
    const worktreePath = Path.join(tempRoot, name);
    run(
        'git',
        ['worktree', 'add', '--detach', worktreePath, gitRef],
        { cwd: repoRoot }
    );
    cleanupWorktrees.push(worktreePath);
    linkNodeModules(repoRoot, worktreePath);
    return worktreePath;
}

/**
 * Build baseline tree snapshots from a specific git ref.
 * @param {string} repoRoot Repository root path.
 * @param {string} tempRoot Temporary parent directory for worktrees.
 * @param {string} gitRef Git ref used for the baseline snapshot.
 * @param {string} targetSnapshot Directory where generated tree files are copied.
 * @param {string[]} cleanupWorktrees List of worktrees to remove during cleanup.
 * @return {string[]} Generated tree file names copied to the snapshot directory.
 */
function buildSnapshotFromRef(repoRoot, tempRoot, gitRef, targetSnapshot, cleanupWorktrees) {
    const worktreePath = createWorktree(
        repoRoot,
        tempRoot,
        'base-worktree',
        gitRef,
        cleanupWorktrees
    );
    generateTrees(worktreePath);
    return copyTreeFiles(worktreePath, targetSnapshot);
}

/**
 * Build current tree snapshots from HEAD plus local working changes.
 * @param {string} repoRoot Repository root path.
 * @param {string} tempRoot Temporary parent directory for worktrees.
 * @param {string} targetSnapshot Directory where generated tree files are copied.
 * @param {string[]} cleanupWorktrees List of worktrees to remove during cleanup.
 * @return {string[]} Generated tree file names copied to the snapshot directory.
 */
function buildSnapshotFromWorkingTree(repoRoot, tempRoot, targetSnapshot, cleanupWorktrees) {
    const worktreePath = createWorktree(
        repoRoot,
        tempRoot,
        'current-worktree',
        'HEAD',
        cleanupWorktrees
    );

    applyLocalChanges(repoRoot, worktreePath);
    generateTrees(worktreePath);

    return copyTreeFiles(worktreePath, targetSnapshot);
}

/**
 * Create a git-style diff between two snapshot directories.
 * @param {string} tempRoot Working directory where diff command executes.
 * @param {string} leftDirectory Left snapshot directory name.
 * @param {string} rightDirectory Right snapshot directory name.
 * @return {string} Unified diff output or an empty string when identical.
 */
function createDiff(tempRoot, leftDirectory, rightDirectory) {
    const result = run(
        'git',
        ['--no-pager', 'diff', '--no-index', '--', leftDirectory, rightDirectory],
        {
            cwd: tempRoot,
            capture: true,
            allowedStatus: [0, 1]
        }
    );

    if (result.status === 0) {
        return '';
    }

    const leftPrefix = `a/${leftDirectory}/`;
    const rightPrefix = `b/${rightDirectory}/`;

    return (result.stdout || '')
        .split(leftPrefix).join('a/')
        .split(rightPrefix).join('b/');
}

/**
 * Write diff output to disk.
 * @param {string} outputPath Absolute file path for the diff output.
 * @param {string} content Diff content to write.
 * @return {void} Nothing.
 */
function writeOutput(outputPath, content) {
    Fs.mkdirSync(Path.dirname(outputPath), { recursive: true });
    Fs.writeFileSync(outputPath, content, 'utf8');
}

/**
 * Append diff-state output for GitHub Actions steps.
 * @param {string | undefined} githubOutputPath Path to the GitHub output file.
 * @param {boolean} hasChanges Whether a non-empty diff was produced.
 * @return {void} Nothing.
 */
function writeGitHubOutput(githubOutputPath, hasChanges) {
    if (!githubOutputPath) {
        return;
    }

    Fs.appendFileSync(githubOutputPath, `has_changes=${hasChanges}\n`, 'utf8');
}

/**
 * Copy stored reference tree files into a snapshot directory.
 * @param {string} referenceDirectory Directory that holds reference tree files.
 * @param {string} targetSnapshot Directory where reference files are copied.
 * @return {string[]} Copied tree file names.
 */
function snapshotReferenceFiles(referenceDirectory, targetSnapshot) {
    if (!Fs.existsSync(referenceDirectory)) {
        fail(`Reference directory does not exist: ${referenceDirectory}`);
    }

    const copiedFiles = copyTreeFiles(referenceDirectory, targetSnapshot);

    if (!copiedFiles.length) {
        fail(`No reference files found in ${referenceDirectory}`);
    }

    return copiedFiles;
}

/**
 * Refresh reference tree files from a generated snapshot.
 * @param {string} sourceSnapshot Snapshot directory containing generated tree files.
 * @param {string} referenceDirectory Destination directory for saved reference files.
 * @return {number} Number of reference files updated.
 */
function updateReferenceFiles(sourceSnapshot, referenceDirectory) {
    Fs.mkdirSync(referenceDirectory, { recursive: true });
    return copyTreeFiles(sourceSnapshot, referenceDirectory).length;
}

/**
 * Execute the selected command and manage temporary resources.
 * @param {CliOptions} options Parsed command line options.
 * @return {Promise<void>} Promise resolved when the command finishes.
 */
async function main(options) {
    if (options.help) {
        process.stdout.write(`${[
            'Usage:',
            '  node tools/apidocs-diff.js [compare] [options]',
            '  node tools/apidocs-diff.js make-reference [options]',
            '  node tools/apidocs-diff.js compare-reference [options]',
            '',
            'Options:',
            '  --base <ref>            Base git ref for compare (default: origin/master)',
            '  --fetch-base            Fetch base ref from origin before compare',
            '  --output, --out <file> Diff output file (default: /tmp/changes.md)',
            '  --reference-dir <dir>   Directory used by make-reference/compare-reference',
            '  --current-dir <dir>     Prepared tree*.json directory for compare-reference',
            '  --github-output <file>  Append has_changes output for GitHub Actions',
            '  --help, -h              Show this help'
        ].join('\n')}\n`);
        return;
    }

    if (options.currentDir && options.command !== 'compare-reference') {
        fail('--current-dir is only supported with compare-reference.');
    }

    const requiresWorkingTree = !(
        options.command === 'compare-reference' && options.currentDir
    );
    const repoRoot = requiresWorkingTree ? run(
        'git',
        ['rev-parse', '--show-toplevel'],
        { capture: true }
    ).stdout.trim() : '';

    const outputPath = Path.resolve(process.cwd(), options.output);
    const referenceDirectory = Path.resolve(process.cwd(), options.referenceDir);
    const currentDirectory = options.currentDir ?
        Path.resolve(process.cwd(), options.currentDir) :
        void 0;
    const tempRoot = Fs.mkdtempSync(Path.join(Os.tmpdir(), 'apidocs-diff-'));
    const cleanupWorktrees = [];

    try {
        if (options.fetchBase && options.command === 'compare') {
            fetchBaseRef(repoRoot, options.base);
        }

        const baseSnapshot = Path.join(tempRoot, 'base');
        const currentSnapshot = Path.join(tempRoot, 'current');
        let diff = '';

        switch (options.command) {
            case 'compare': {
                const baseFiles = buildSnapshotFromRef(
                    repoRoot,
                    tempRoot,
                    options.base,
                    baseSnapshot,
                    cleanupWorktrees
                );
                const currentFiles = buildSnapshotFromWorkingTree(
                    repoRoot,
                    tempRoot,
                    currentSnapshot,
                    cleanupWorktrees
                );

                if (!baseFiles.length && !currentFiles.length) {
                    fail('No tree*.json files were generated.');
                }

                normalizeSnapshotTrees(baseSnapshot);
                normalizeSnapshotTrees(currentSnapshot);

                diff = createDiff(tempRoot, 'base', 'current');
                break;
            }
            case 'make-reference': {
                const currentFiles = buildSnapshotFromWorkingTree(
                    repoRoot,
                    tempRoot,
                    currentSnapshot,
                    cleanupWorktrees
                );

                if (!currentFiles.length) {
                    fail('No tree*.json files were generated from the working tree.');
                }

                const referenceCount = updateReferenceFiles(
                    currentSnapshot,
                    referenceDirectory
                );

                process.stdout.write(
                    `Updated ${referenceCount} reference files in ${referenceDirectory}\n`
                );
                return;
            }
            case 'compare-reference': {
                snapshotReferenceFiles(referenceDirectory, baseSnapshot);

                const currentFiles = currentDirectory ?
                    snapshotReferenceFiles(currentDirectory, currentSnapshot) :
                    buildSnapshotFromWorkingTree(
                        repoRoot,
                        tempRoot,
                        currentSnapshot,
                        cleanupWorktrees
                    );

                if (!currentFiles.length) {
                    fail(
                        currentDirectory ?
                            `No tree*.json files found in ${currentDirectory}` :
                            'No tree*.json files were generated from the working tree.'
                    );
                }

                normalizeSnapshotTrees(baseSnapshot);
                normalizeSnapshotTrees(currentSnapshot);

                diff = createDiff(tempRoot, 'base', 'current');
                break;
            }
            default:
                fail(`Unsupported command: ${options.command}`);
        }

        writeOutput(outputPath, diff);

        const hasChanges = diff.trim().length > 0;
        writeGitHubOutput(options.githubOutput, hasChanges);
        process.stdout.write(
            `${hasChanges ? 'Differences' : 'No differences'} written to ${outputPath}\n`
        );
    } finally {
        for (const worktreePath of cleanupWorktrees.slice().reverse()) {
            try {
                run(
                    'git',
                    ['worktree', 'remove', '--force', worktreePath],
                    { cwd: repoRoot }
                );
            } catch (error) {
                process.stderr.write(
                    `Warning: failed to remove temporary worktree ${worktreePath}: ${String(error)}\n`
                );
            }
        }

        Fs.rmSync(tempRoot, { recursive: true, force: true });
    }
}

main(parseCli(process.argv)).catch(error => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
});
