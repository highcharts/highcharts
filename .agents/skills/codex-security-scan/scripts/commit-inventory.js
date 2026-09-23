'use strict';

const { spawnSync } = require('node:child_process');
const {
    accessSync, constants, existsSync, lstatSync, realpathSync, statSync
} = require('node:fs');
const {
    delimiter, dirname, isAbsolute, join, relative, resolve, sep
} = require('node:path');
const { devNull } = require('node:os');

const usage = 'Usage: node commit-inventory.js --repo <path> ' +
    '--base <revision> [--head <revision>]\n' +
    'Read-only JSON inventory; head defaults to HEAD. Requires Node >=22 ' +
    'and Git with --no-lazy-fetch support.\n' +
    'Includes all base..head commits, oldest-first topological order.\n' +
    'Ready identifies a first-parent pair, not a completed security scan.\n';

function options(args) {
    if (args.length === 1 && args[0] === '--help') {
        return null;
    }
    const result = {};
    for (let i = 0; i < args.length; i += 2) {
        const key = args[i];
        const value = args[i + 1];
        if (
            !['--repo', '--base', '--head'].includes(key) ||
            Object.hasOwn(result, key) || !value || value.startsWith('-') ||
            value.includes('\0')
        ) {
            throw new Error('Invalid arguments; use --help');
        }
        result[key] = value;
    }
    if (!result['--repo'] || !result['--base']) {
        throw new Error('--repo and --base are required');
    }
    return result;
}

function gitExecutable(repo) {
    // Establish the checkout boundary without executing anything from PATH.
    // .git may be a directory or a gitfile (including linked worktrees).
    function enclosingRoot(start) {
        let directory = start;
        while (true) {
            if (lstatSync(join(directory, '.git'), { throwIfNoEntry: false })) {
                return directory;
            }
            const parent = dirname(directory);
            if (parent === directory) {
                return null;
            }
            directory = parent;
        }
    }
    if (process.platform === 'win32') {
        throw new Error('Git executable binding requires a POSIX platform');
    }
    const root = enclosingRoot(realpathSync(repo));
    if (!root) {
        throw new Error('Cannot establish the working-tree boundary');
    }
    const roots = [repo, enclosingRoot(repo), root].filter(Boolean);
    function outsideRepository(file) {
        if (roots.some(directory => {
            const suffix = relative(directory, file);
            return suffix === '' || (
                suffix !== '..' && !suffix.startsWith(`..${sep}`) &&
                !isAbsolute(suffix)
            );
        })) {
            throw new Error('Git executable/PATH must be outside the repository');
        }
    }
    const directories = (process.env.PATH || '').split(delimiter);
    if (directories.some(directory => !directory || !isAbsolute(directory))) {
        throw new Error('PATH must contain only trusted absolute directories');
    }
    // Validate every entry, even those after the selected Git executable.
    const candidates = [];
    for (const directory of directories) {
        outsideRepository(resolve(directory));
        try {
            outsideRepository(realpathSync(directory));
            const candidate = join(directory, 'git');
            outsideRepository(candidate);
            const executable = realpathSync(candidate);
            outsideRepository(executable);
            if (statSync(executable).isFile()) {
                accessSync(executable, constants.X_OK);
                candidates.push(executable);
            }
        } catch (error) {
            if (!['ENOENT', 'ENOTDIR'].includes(error.code)) {
                throw error;
            }
        }
    }
    if (!candidates.length) {
        throw new Error('No Git executable in trusted absolute PATH');
    }
    return { executable: candidates[0], root };
}

function inventory(opts) {
    if (Number(process.versions.node.split('.')[0]) < 22) {
        throw new Error('Node >=22 is required');
    }
    if (
        process.env.GIT_REPLACE_REF_BASE !== undefined &&
        process.env.GIT_REPLACE_REF_BASE !== 'refs/replace/'
    ) {
        throw new Error('Conflicting replacement namespace');
    }
    // Explicit --repo wins over inherited repository/config/object-store state.
    const env = Object.fromEntries(Object.entries(process.env).filter(
        ([key]) => !key.toUpperCase().startsWith('GIT_') &&
            !['NODE_OPTIONS', 'NODE_PATH'].includes(key.toUpperCase())
    ));
    Object.assign(env, {
        GIT_OPTIONAL_LOCKS: '0',
        GIT_NO_LAZY_FETCH: '1',
        GIT_NO_REPLACE_OBJECTS: '1',
        GIT_CONFIG_NOSYSTEM: '1',
        GIT_CONFIG_GLOBAL: devNull,
        LC_ALL: 'C'
    });
    const repo = resolve(opts['--repo']);
    const { executable, root } = gitExecutable(repo);
    let cwd = realpathSync(repo);
    function git(args, allowNonancestor = false) {
        const result = spawnSync(executable, [
            '--no-lazy-fetch', '--no-replace-objects',
            '-c', 'core.commitGraph=false',
            '-c', 'core.warnAmbiguousRefs=true', ...args
        ], { cwd, env, maxBuffer: 64 * 1024 * 1024 });
        // Reject warnings as well as failures (notably ambiguous revisions).
        if (
            result.error || result.signal || result.stderr?.length ||
            (result.status !== 0 &&
                !(allowNonancestor && result.status === 1))
        ) {
            throw new Error(`Git ${args[0]} failed or warned; ` +
                'check local history and Git --no-lazy-fetch support');
        }
        return result;
    }
    function text(args) {
        return new TextDecoder('utf-8', { fatal: true }).decode(
            git(args).stdout
        ).replace(/\n$/, '');
    }
    if (text(['rev-parse', '--is-inside-work-tree']) !== 'true') {
        throw new Error('A nonbare working tree is required');
    }
    const repository = realpathSync(text([
        'rev-parse', '--path-format=absolute', '--show-toplevel'
    ]));
    if (repository !== root) {
        throw new Error('Git working-tree boundary differs from filesystem root');
    }
    cwd = repository;
    if (text(['rev-parse', '--is-shallow-repository']) !== 'false') {
        throw new Error('Shallow history is not supported');
    }
    if (text(['for-each-ref', '--format=%(refname)', 'refs/replace/'])) {
        throw new Error('Replacement refs are not supported');
    }
    const grafts = text([
        'rev-parse', '--path-format=absolute', '--git-path', 'info/grafts'
    ]);
    if (existsSync(grafts)) {
        throw new Error('Grafted history is not supported');
    }
    const format = text(['rev-parse', '--show-object-format']);
    const length = { sha1: 40, sha256: 64 }[format];
    if (!length) {
        throw new Error('Unsupported object format');
    }
    const idPattern = new RegExp(`^[0-9a-f]{${length}}$`);
    function id(value) {
        if (!idPattern.test(value)) {
            throw new Error('Invalid commit object ID');
        }
        return value;
    }
    function revision(value) {
        return id(text([
            'rev-parse', '--verify', '--end-of-options', `${value}^{commit}`
        ]));
    }
    const base = revision(opts['--base']);
    const head = revision(opts['--head'] || 'HEAD');
    if (git(['merge-base', '--is-ancestor', base, head], true).status === 1) {
        throw new Error('Base is not an ancestor of head');
    }
    // Walk complete endpoint histories, even for an empty range. Commit graphs
    // are disabled so unavailable commit objects cannot be hidden by a cache.
    const history = text(['rev-list', base, head, '--']);
    const available = new Set(history.split('\n').map(id));
    if (!available.has(base) || !available.has(head)) {
        throw new Error('Incomplete endpoint history');
    }
    const range = text([
        'rev-list', '--reverse', '--topo-order', `${base}..${head}`, '--'
    ]);
    const selected = range ? range.split('\n').map(id) : [];
    if (new Set(selected).size !== selected.length) {
        throw new Error('Duplicate traversal entry');
    }
    const commits = selected.map(commit => {
        if (!available.has(commit) || commit === base) {
            throw new Error('Incomplete range traversal');
        }
        const raw = git(['cat-file', 'commit', commit]).stdout;
        const boundary = raw.indexOf('\n\n');
        if (boundary < 0) {
            throw new Error('Malformed commit object');
        }
        const headers = raw.subarray(0, boundary).toString('latin1').split('\n');
        if (!headers[0].startsWith('tree ')) {
            throw new Error('Malformed commit tree header');
        }
        id(headers.shift().slice(5));
        const parents = [];
        while (headers[0]?.startsWith('parent ')) {
            const parent = id(headers.shift().slice(7));
            if (!available.has(parent)) {
                throw new Error('Missing required parent history');
            }
            parents.push(parent);
        }
        if (
            !headers[0]?.startsWith('author ') ||
            !headers[1]?.startsWith('committer ') ||
            headers.some(line => /^(tree|parent) /.test(line))
        ) {
            throw new Error('Malformed commit headers');
        }
        const firstParent = parents[0] || null;
        if (firstParent && text(['cat-file', '-t', firstParent]) !== 'commit') {
            throw new Error('First parent is not a local commit');
        }
        return {
            commit, parents, firstParent,
            scan: firstParent ? { base: firstParent, head: commit } : null,
            status: firstParent ? 'ready' : 'blocked',
            ...(!firstParent ? { reason: 'root-commit' } : {})
        };
    });
    return { repository, base, head, commits };
}

try {
    const opts = options(process.argv.slice(2));
    process.stdout.write(opts ? JSON.stringify(inventory(opts)) + '\n' : usage);
} catch (error) {
    process.stderr.write(`commit-inventory: ${error.message}\n`);
    process.exitCode = 1;
}
