'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { createHash } = require('node:crypto');
const fs = require('node:fs');
const { devNull, tmpdir } = require('node:os');
const path = require('node:path');
const { test } = require('node:test');

const cli = path.join(__dirname, 'commit-inventory.js');
const env = Object.fromEntries(Object.entries(process.env).filter(
    ([key]) => !key.toUpperCase().startsWith('GIT_')
));
Object.assign(env, {
    GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: devNull,
    GIT_OPTIONAL_LOCKS: '0', GIT_NO_LAZY_FETCH: '1',
    GIT_AUTHOR_NAME: 'Fixture', GIT_AUTHOR_EMAIL: 'fixture@example.invalid',
    GIT_COMMITTER_NAME: 'Fixture',
    GIT_COMMITTER_EMAIL: 'fixture@example.invalid',
    GIT_AUTHOR_DATE: '2026-01-01T00:00:00Z',
    GIT_COMMITTER_DATE: '2026-01-01T00:00:00Z'
});

function git(repo, args, input) {
    const result = spawnSync('git', ['-C', repo, ...args], {
        env, encoding: 'utf8', input
    });
    assert.equal(result.status, 0, result.stderr);
    return result.stdout.trim();
}

function fixture(t) {
    const root = fs.mkdtempSync(path.join(tmpdir(), 'commit-inventory-test-'));
    t.after(() => fs.rmSync(root, { recursive: true, force: true }));
    const repo = path.join(root, 'repo with spaces');
    fs.mkdirSync(repo);
    git(repo, ['init', '--initial-branch=main']);
    git(repo, ['config', 'commit.gpgSign', 'false']);
    git(repo, ['config', 'core.hooksPath', path.join(root, 'no-hooks')]);
    fs.writeFileSync(path.join(repo, 'tracked'), 'initial\n');
    git(repo, ['add', 'tracked']);
    git(repo, ['commit', '-m', 'root']);
    const base = git(repo, ['rev-parse', 'HEAD']);
    return { root, repo, base };
}

function commit(repo, message) {
    git(repo, ['commit', '--allow-empty', '-m', message]);
    return git(repo, ['rev-parse', 'HEAD']);
}

function run(args, extraEnv = {}, cwd = tmpdir()) {
    return spawnSync(process.execPath, [cli, ...args], {
        cwd, env: { ...env, ...extraEnv }, encoding: 'utf8'
    });
}

function success(repo, base, head, extraEnv, cwd) {
    const args = ['--repo', repo, '--base', base];
    if (head !== undefined) {
        args.push('--head', head);
    }
    const result = run(args, extraEnv, cwd);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stderr, '');
    assert.ok(result.stdout.endsWith('\n'));
    const data = JSON.parse(result.stdout);
    assert.deepEqual(Object.keys(data), ['repository', 'base', 'head', 'commits']);
    assert.equal(result.stdout, JSON.stringify(data) + '\n');
    return data;
}

function failure(args, extraEnv, pattern) {
    const result = run(args, extraEnv);
    assert.notEqual(result.status, 0);
    assert.equal(result.stdout, '');
    assert.match(result.stderr, pattern || /^commit-inventory: .+\n$/);
}

function snapshot(repo) {
    const files = {};
    function walk(dir) {
        for (const name of fs.readdirSync(dir).sort()) {
            const file = path.join(dir, name);
            const stat = fs.lstatSync(file);
            if (stat.isDirectory()) {
                walk(file);
            } else {
                files[path.relative(repo, file)] = {
                    mode: stat.mode,
                    content: stat.isSymbolicLink() ? fs.readlinkSync(file) :
                        createHash('sha256').update(fs.readFileSync(file))
                            .digest('hex')
                };
            }
        }
    }
    walk(repo);
    return files;
}

test('linear, explicit/default head, empty commits/range, deterministic, read-only', t => {
    const { repo, base } = fixture(t);
    const first = commit(repo, 'empty first');
    const head = commit(repo, 'empty second');
    fs.writeFileSync(path.join(repo, 'tracked'), 'staged\n');
    git(repo, ['add', 'tracked']);
    fs.appendFileSync(path.join(repo, 'tracked'), 'unstaged\n');
    fs.writeFileSync(path.join(repo, 'untracked'), 'untracked');
    const before = snapshot(repo);
    const data = success(repo, base);
    assert.deepEqual(data, {
        repository: fs.realpathSync(repo), base, head,
        commits: [
            { commit: first, parents: [base], firstParent: base,
                scan: { base, head: first }, status: 'ready' },
            { commit: head, parents: [first], firstParent: first,
                scan: { base: first, head }, status: 'ready' }
        ]
    });
    assert.deepEqual(success(repo, base, head), data);
    assert.deepEqual(success(repo, base), data);
    assert.deepEqual(success(repo, head).commits, []);
    assert.equal(success(repo, base, first).commits.length, 1);
    failure(['--repo', repo, '--base', 'missing']);
    assert.deepEqual(snapshot(repo), before);
});

test('merge includes side branches, preserves topo sequence and all parent order', t => {
    const { repo, base } = fixture(t);
    git(repo, ['checkout', '-b', 'side']);
    const side = commit(repo, 'side');
    git(repo, ['checkout', '-b', 'other', base]);
    const other = commit(repo, 'other');
    git(repo, ['checkout', 'main']);
    const main = commit(repo, 'main');
    git(repo, ['merge', '--no-ff', 'side', 'other', '-m', 'octopus']);
    const head = git(repo, ['rev-parse', 'HEAD']);
    const data = success(repo, base);
    const expected = git(repo, [
        'rev-list', '--reverse', '--topo-order', `${base}..${head}`, '--'
    ]).split('\n');
    assert.deepEqual(data.commits.map(entry => entry.commit), expected);
    assert.deepEqual(new Set(expected), new Set([side, other, main, head]));
    assert.deepEqual(data.commits.at(-1).parents, [main, side, other]);
    assert.deepEqual(data.commits.at(-1).scan, { base: main, head });
});

test('selected unrelated root is blocked after unrelated-history merge', t => {
    const { repo, base } = fixture(t);
    git(repo, ['checkout', '--orphan', 'unrelated']);
    const root = commit(repo, 'unrelated root');
    git(repo, ['checkout', 'main']);
    git(repo, ['merge', '--allow-unrelated-histories', '--no-ff',
        'unrelated', '-m', 'join']);
    const data = success(repo, base);
    assert.deepEqual(data.commits[0], {
        commit: root, parents: [], firstParent: null, scan: null,
        status: 'blocked', reason: 'root-commit'
    });
});

test('rejects nonancestor, missing refs and ambiguous branch/tag names', t => {
    const { repo, base } = fixture(t);
    const head = commit(repo, 'next');
    failure(['--repo', repo, '--base', head, '--head', base], {}, /not an ancestor/);
    for (const args of [
        ['--base', 'missing'], ['--base', base, '--head', 'missing']
    ]) {
        failure(['--repo', repo, ...args]);
    }
    git(repo, ['tag', 'collision', base]);
    git(repo, ['branch', 'collision', head]);
    git(repo, ['config', 'core.warnAmbiguousRefs', 'false']);
    failure(['--repo', repo, '--base', 'collision']);
    failure(['--repo', repo, '--base', base, '--head', 'collision']);
});

test('missing required parent and incomplete empty-range history fail closed', t => {
    const { repo, base } = fixture(t);
    const first = commit(repo, 'first');
    const head = commit(repo, 'head');
    git(repo, ['commit-graph', 'write', '--reachable']);
    const object = path.join(repo, '.git', 'objects', first.slice(0, 2), first.slice(2));
    fs.unlinkSync(object);
    const before = snapshot(repo);
    failure(['--repo', repo, '--base', base]);
    failure(['--repo', repo, '--base', head]);
    assert.deepEqual(snapshot(repo), before);
});

test('rejects shallow, replacement refs, grafts, conflicting replacement env', t => {
    const { repo, base } = fixture(t);
    const head = commit(repo, 'head');
    const args = ['--repo', repo, '--base', base];
    const shallow = git(repo, ['rev-parse', '--git-path', 'shallow']);
    fs.writeFileSync(path.resolve(repo, shallow), base + '\n');
    failure(args, {}, /Shallow/);
    fs.unlinkSync(path.resolve(repo, shallow));
    git(repo, ['replace', head, base]);
    failure(args, {}, /Replacement/);
    git(repo, ['replace', '-d', head]);
    const grafts = path.resolve(repo, git(repo, ['rev-parse', '--git-path', 'info/grafts']));
    fs.writeFileSync(grafts, head + '\n');
    failure(args);
    fs.unlinkSync(grafts);
    failure(args, { GIT_REPLACE_REF_BASE: 'refs/hidden/' }, /namespace/);
    assert.equal(success(repo, base, undefined, {
        GIT_REPLACE_REF_BASE: 'refs/replace/'
    }).head, head);
});

test('linked worktree, subdirectory, spaces and inherited Git redirection', t => {
    const { repo, root, base } = fixture(t);
    const head = commit(repo, 'head');
    const linked = path.join(root, 'linked worktree');
    git(repo, ['worktree', 'add', '--detach', linked, head]);
    const sub = path.join(linked, 'nested directory');
    fs.mkdirSync(sub);
    const unrelated = path.join(root, 'unrelated');
    fs.mkdirSync(unrelated);
    git(unrelated, ['init', '--bare']);
    const redirected = {
        GIT_DIR: unrelated, GIT_COMMON_DIR: unrelated,
        GIT_WORK_TREE: unrelated, GIT_INDEX_FILE: path.join(root, 'bad-index'),
        GIT_NAMESPACE: 'wrong', GIT_OBJECT_DIRECTORY: path.join(root, 'missing'),
        GIT_ALTERNATE_OBJECT_DIRECTORIES: path.join(root, 'missing'),
        GIT_SHALLOW_FILE: path.join(root, 'missing'),
        GIT_CONFIG_COUNT: '1', GIT_CONFIG_KEY_0: 'core.bare',
        GIT_CONFIG_VALUE_0: 'true', GIT_CONFIG_PARAMETERS: "'core.bare=true'",
        GIT_OPTIONAL_LOCKS: '1', GIT_NO_LAZY_FETCH: '0'
    };
    const before = snapshot(root);
    const data = success(sub, base, undefined, redirected, unrelated);
    assert.equal(data.repository, fs.realpathSync(linked));
    assert.equal(data.head, head);
    assert.deepEqual(snapshot(root), before);
    failure(['--repo', unrelated, '--base', base]);
    const grafts = path.resolve(linked, git(linked, [
        'rev-parse', '--git-path', 'info/grafts'
    ]));
    fs.writeFileSync(grafts, head + '\n');
    failure(['--repo', sub, '--base', base]);
});

test('strict CLI, shell metacharacters are data, help requires no Git', t => {
    const { repo, root, base } = fixture(t);
    const args = ['--repo', repo, '--base', base];
    for (const malformed of [
        [], ['--help', '--base', base], ['--repo', repo], ['--base', base],
        ['--repo', ''], ['--repo', repo, '--base', ''],
        [...args, '--head'], [...args, '--head', ''],
        [...args, '--head', '--all'], [...args, '--base', base],
        [...args, '--repo', repo], [...args, '--head', 'HEAD', '--head', 'HEAD'],
        [...args, '--unknown', 'value'], [...args, 'positional'],
        ['--repo', repo, '--base', '--all']
    ]) {
        failure(malformed);
    }
    const marker = path.join(root, 'must-not-exist');
    failure(['--repo', repo, '--base', `HEAD; touch ${marker}`]);
    failure(['--repo', repo, '--base', `$(touch ${marker})`]);
    assert.equal(fs.existsSync(marker), false);
    const weird = 'branch;literal';
    git(repo, ['branch', weird, base]);
    assert.deepEqual(success(repo, weird).commits, []);
    const help = run(['--help'], { PATH: path.join(root, 'no-git') });
    assert.equal(help.status, 0);
    assert.equal(help.stderr, '');
    assert.match(help.stdout, /^Usage:/);
    failure(args, { PATH: path.join(root, 'no-git') });
});

test('Git binding rejects repository executables before they can run', t => {
    const { repo, root, base } = fixture(t);
    const head = commit(repo, 'head');
    const linked = path.join(root, 'linked worktree');
    git(repo, ['worktree', 'add', '--detach', linked, head]);
    const alias = path.join(root, 'checkout alias');
    fs.symlinkSync(repo, alias);
    const marker = path.join(root, 'executed-untrusted-git');
    const fake = `#!${process.execPath}\n` +
        `require('node:fs').writeFileSync(${JSON.stringify(marker)}, 'ran');\n`;
    const trustedGit = fs.realpathSync(env.PATH.split(path.delimiter)
        .filter(directory => path.isAbsolute(directory))
        .map(directory => path.join(directory, 'git'))
        .find(file => {
            try {
                fs.accessSync(file, fs.constants.X_OK);
                return fs.statSync(file).isFile();
            } catch {
                return false;
            }
        }));
    const trustedPath = path.dirname(trustedGit);
    const maliciousPaths = [
        '', '.', 'node_modules/.bin', `:${trustedPath}`,
        `${trustedPath}:`, `${trustedPath}::${trustedPath}`,
        `${trustedPath}:.`
    ];
    for (const checkout of [repo, linked]) {
        const bin = path.join(checkout, 'node_modules', '.bin');
        fs.mkdirSync(bin, { recursive: true });
        fs.writeFileSync(path.join(bin, 'git'), fake, { mode: 0o755 });
        fs.writeFileSync(path.join(checkout, 'git'), fake, { mode: 0o755 });
        const subdir = path.join(checkout, 'nested', 'subdirectory');
        fs.mkdirSync(subdir, { recursive: true });
        const externalBin = path.join(root, path.basename(checkout) + '-bin');
        fs.mkdirSync(externalBin);
        fs.symlinkSync(path.join(bin, 'git'), path.join(externalBin, 'git'));
        const directoryAlias = externalBin + '-alias';
        fs.symlinkSync(bin, directoryAlias);
        const outsideGitLink = path.join(checkout, 'trusted-git-link');
        fs.mkdirSync(outsideGitLink);
        fs.symlinkSync(trustedGit, path.join(outsideGitLink, 'git'));
        for (const input of [checkout, subdir]) {
            for (const PATH of [
                ...maliciousPaths, bin, `${bin}:${trustedPath}`,
                `${trustedPath}:${bin}`, externalBin, directoryAlias,
                outsideGitLink
            ]) {
                // Include target cwd: relative/empty PATH must never resolve it.
                const result = run(['--repo', input, '--base', base],
                    { PATH }, checkout);
                assert.notEqual(result.status, 0, PATH);
                assert.equal(result.stdout, '', PATH);
                assert.match(result.stderr, /PATH|outside the repository/);
                assert.equal(fs.existsSync(marker), false, PATH);
            }
            const data = success(input, base, undefined,
                { PATH: trustedPath });
            assert.equal(data.repository, fs.realpathSync(checkout));
            assert.equal(data.head, head);
        }
    }
    failure(['--repo', alias, '--base', base], {
        PATH: path.join(alias, 'node_modules', '.bin')
    }, /outside the repository/);
    assert.equal(success(alias, base, undefined, {
        PATH: trustedPath
    }).head, head);
    assert.equal(fs.existsSync(marker), false);

    // An operator-trusted external wrapper can observe the child environment.
    const wrapper = path.join(root, 'trusted-tools');
    fs.mkdirSync(wrapper);
    fs.writeFileSync(path.join(wrapper, 'git'), `#!${process.execPath}\n` +
        'if (process.env.NODE_OPTIONS || process.env.NODE_PATH) ' +
        'process.exit(99);\n' +
        'const r = require("node:child_process").spawnSync(' +
        `${JSON.stringify(trustedGit)}, process.argv.slice(2), ` +
        '{stdio: "inherit"});\nprocess.exit(r.status ?? 98);\n',
    { mode: 0o755 });
    assert.equal(success(repo, base, undefined, {
        PATH: wrapper, NODE_OPTIONS: '--no-warnings', NODE_PATH: '/unused'
    }).head, head);
});
