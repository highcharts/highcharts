#!/usr/bin/env node
/*
 * Build installable documentation skills from authored instructions and docs.
 */

'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const repoRoot = path.resolve(__dirname, '..');

function loadSkills() {
    const configDir = path.join(__dirname, 'skill-configs');
    const files = fs.readdirSync(configDir)
        .filter(f => f.endsWith('.js'))
        .sort();

    return files.map(f => {
        const skill = require(path.join(configDir, f));
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(skill.name) || skill.name.length > 64) {
            throw new Error(`${f}: invalid skill name`);
        }
        for (const key of ['include', 'exclude']) {
            if (!Array.isArray(skill.docs?.[key]) ||
                !skill.docs[key].every(item => typeof item === 'string')) {
                throw new Error(`${f}: docs.${key} must be an array of paths`);
            }
        }
        return skill;
    });
}

const SKILLS = loadSkills();

function printHelp() {
    process.stdout.write([
        'Build complete, installable documentation skills.',
        'Sources: skills/<name>/ and docs/. Output: build/skills/<name>/.',
        '',
        'Usage:',
        '  node tools/generate-doc-skills.js --yes',
        '  node tools/generate-doc-skills.js --yes --output=build/skills-preview',
        '',
        'Options:',
        '  --docs=<path>       Docs markdown source directory. Default: docs',
        '  --output=<path>     Output directory inside build/. Default: build/skills',
        '  --yes, -y           Required: confirms replacement of the output directory',
        '  --self-test         Run the script self-test',
        '  --help, -h          Print this help text'
    ].join('\n') + '\n');
}

function parseArgs(argv) {
    const args = {
        docs: path.join(repoRoot, 'docs'),
        output: path.join(repoRoot, 'build', 'skills'),
        yes: false,
        selfTest: false,
        help: false
    };

    for (const arg of argv) {
        if (arg === '--yes' || arg === '-y') {
            args.yes = true;
        } else if (arg === '--self-test') {
            args.selfTest = true;
        } else if (arg === '--help' || arg === '-h') {
            args.help = true;
        } else if (arg.startsWith('--docs=')) {
            const resolved = path.resolve(arg.slice('--docs='.length));
            if (!resolved.startsWith(repoRoot + path.sep) && resolved !== repoRoot) {
                throw new Error('--docs path must be inside the repo root: ' + resolved);
            }
            args.docs = resolved;
        } else if (arg.startsWith('--output=')) {
            args.output = path.resolve(arg.slice('--output='.length));
        } else {
            throw new Error(`Unknown option: ${arg}`);
        }
    }

    return args;
}

function validateOutput(output, root = repoRoot) {
    if (!output.startsWith(path.join(root, 'build') + path.sep)) {
        throw new Error('--output must be a subdirectory of build/');
    }
    let current = root;
    for (const part of path.relative(root, output).split(path.sep)) {
        current = path.join(current, part);
        const stat = fs.lstatSync(current, { throwIfNoEntry: false });
        if (stat && !stat.isDirectory()) {
            throw new Error(`Output path must contain only directories, without symlinks: ${current}`);
        }
    }
}

function listMarkdownFiles(root) {
    const files = [];

    function walk(directory) {
        for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
            if (entry.name.startsWith('.')) {
                continue;
            }
            if (entry.isSymbolicLink()) {
                continue;
            }

            const absolute = path.join(directory, entry.name);
            if (entry.isDirectory()) {
                walk(absolute);
            } else if (entry.isFile() && entry.name.endsWith('.md')) {
                files.push(path.relative(root, absolute).split(path.sep).join('/'));
            }
        }
    }

    walk(root);
    return files.sort();
}

function matchesFilter(file, filters) {
    return filters.some(filter => {
        if (filter.endsWith('/')) {
            return file.startsWith(filter);
        }
        return file === filter;
    });
}

function selectDocs(docsRoot, skill) {
    return listMarkdownFiles(docsRoot).filter(file => (
        matchesFilter(file, skill.docs.include) &&
        !matchesFilter(file, skill.docs.exclude)
    ));
}
// Note: Only detects fenced code blocks starting at column 0 (^ anchor in
// multiline mode). Indented fences (e.g. inside list items) are not tracked,
// so strippable content inside them may be incorrectly removed. Low risk for
// Highcharts docs which rarely use indented fences.
function stripContent(markdown) {
    const result = markdown.replace(
        /(^```[^\n]*$[\s\S]*?^```\s*$)|(<iframe[\s\S]*?<\/iframe>)|(^\s*!\[.*?\]\(.*?\)\s*$)|(^\s*<img\b[^>]*\/?>\s*$)/gimu,
        function (match, codeBlock, iframeBlock) {
            if (codeBlock) {
                return match;
            }
            if (iframeBlock) {
                const srcMatch = iframeBlock.match(/\bsrc=["']([^"']+)["']/iu);
                return srcMatch ? `[Live demo](${srcMatch[1]})` : '';
            }
            return '';
        }
    );
    return result
        .replace(/\n{4,}/gu, '\n\n\n')
        .replace(/\s+$/u, '') + '\n';
}

function buildSkill(skill, docsRoot, tempRoot) {
    const files = selectDocs(docsRoot, skill);
    if (!files.length) {
        throw new Error(`No docs matched ${skill.name}`);
    }

    const skillRoot = path.join(tempRoot, skill.name);
    const docsOut = path.join(skillRoot, 'references', 'docs');

    fs.mkdirSync(docsOut, { recursive: true });

    for (const file of files) {
        const source = path.join(docsRoot, file);
        const dest = path.join(docsOut, file);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        const content = fs.readFileSync(source, 'utf8');
        fs.writeFileSync(dest, stripContent(content));
    }

    // Generate topic index
    const groups = {};
    for (const file of files) {
        const dest = path.join(docsOut, file);
        const content = fs.readFileSync(dest, 'utf8');
        const h1Match = content.match(/^# (.+)$/mu) ||
            content.match(/^(.+)\n=+\s*$/mu);
        const title = h1Match ? h1Match[1] : path.basename(file, '.md');
        const group = file.split('/')[0];
        if (!groups[group]) {
            groups[group] = [];
        }
        groups[group].push({ file, title });
    }
    const indexLines = ['# Topic Index', ''];
    for (const [group, entries] of Object.entries(groups)) {
        indexLines.push(`## ${group}`, '');
        for (const entry of entries) {
            indexLines.push(`- [${entry.title}](${entry.file})`);
        }
        indexLines.push('');
    }
    fs.writeFileSync(path.join(docsOut, 'index.md'), indexLines.join('\n'));

    return {
        root: skillRoot,
        files
    };
}

function readSkillMd(skillRoot) {
    const file = path.join(skillRoot, 'SKILL.md');
    if (!fs.existsSync(skillRoot) || !fs.lstatSync(skillRoot).isDirectory() ||
        !fs.existsSync(file) || !fs.lstatSync(file).isFile()) {
        throw new Error(`Missing authored skill file: ${file}`);
    }
    return fs.readFileSync(file, 'utf8');
}

function copyAuthored(source, destination, relative = '') {
    fs.mkdirSync(destination, { recursive: true });
    for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
        const file = path.join(relative, entry.name);
        if (file === path.join('references', 'docs')) {
            continue;
        }
        if (entry.name === '.git' || (!entry.isDirectory() && !entry.isFile())) {
            throw new Error(`Unsupported authored resource: ${path.join(source, entry.name)}`);
        }
        const src = path.join(source, entry.name);
        const dest = path.join(destination, entry.name);
        if (entry.isDirectory()) {
            copyAuthored(src, dest, file);
        } else {
            fs.copyFileSync(src, dest);
        }
    }
}

function validateReferences(root, markdown) {
    const references = [
        ...markdown.matchAll(/`(references\/docs\/[^`]+)`/gu),
        ...markdown.matchAll(/\]\((references\/[^\s)#]+)(?:#[^\s)]*)?\)/gu)
    ];
    for (const match of references) {
        const file = path.resolve(root, decodeURIComponent(match[1]));
        if (!file.startsWith(root + path.sep) || !fs.existsSync(file)) {
            throw new Error(`Missing skill reference: ${match[1]}`);
        }
    }
}

function buildDistribution(skills, docsRoot, authoredRoot, output, revision) {
    const names = skills.map(skill => skill.name);
    if (!names.length || new Set(names).size !== names.length) {
        throw new Error('Expected unique skill configurations.');
    }
    for (const entry of fs.readdirSync(authoredRoot, { withFileTypes: true })) {
        if ((entry.isDirectory() || entry.isSymbolicLink()) && !names.includes(entry.name)) {
            throw new Error(`No configuration for authored skill: ${entry.name}`);
        }
    }
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'highcharts-doc-skills-'));
    try {
        const results = skills.map(skill => {
            const source = path.join(authoredRoot, skill.name);
            const markdown = readSkillMd(source);
            const built = buildSkill(skill, docsRoot, tempRoot);
            copyAuthored(source, built.root);
            validateReferences(built.root, markdown);
            return { name: skill.name, docs: built.files.length };
        });
        fs.writeFileSync(path.join(tempRoot, 'source.json'), JSON.stringify({
            repository: 'highcharts/highcharts',
            revision,
            skills: [...names].sort()
        }, null, 2) + '\n');
        fs.rmSync(output, { recursive: true, force: true });
        fs.mkdirSync(path.dirname(output), { recursive: true });
        fs.cpSync(tempRoot, output, { recursive: true });
        return results;
    } finally {
        fs.rmSync(tempRoot, { force: true, recursive: true });
    }
}

function generate(args) {
    if (!args.yes) {
        throw new Error('Pass --yes to replace the generated output directory.');
    }
    validateOutput(args.output);
    const revision = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repoRoot, encoding: 'utf8' }).trim();
    return buildDistribution(SKILLS, args.docs, path.join(repoRoot, 'skills'), args.output, revision);
}

function selfTest() {
    assert.throws(() => parseArgs(['--check']), /Unknown option/u);
    assert.throws(() => parseArgs(['--skill=highcharts-react']), /Unknown option/u);
    assert.throws(() => generate(parseArgs([])), /Pass --yes/u);
    assert.throws(() => validateOutput(path.join(repoRoot, 'skills')), /subdirectory of build/u);
    assert.throws(() => validateOutput(path.join(repoRoot, 'build')), /subdirectory of build/u);
    assert.throws(() => validateOutput(repoRoot), /subdirectory of build/u);
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'highcharts-doc-skills-test-'));
    const docsRoot = path.join(tempRoot, 'docs');
    const authoredRoot = path.join(tempRoot, 'skills');
    const source = path.join(authoredRoot, 'test-skill');
    const output = path.join(tempRoot, 'build', 'skills');
    const revision = 'a'.repeat(40);
    const skill = { name: 'test-skill', docs: { include: ['maps/'], exclude: [] } };
    function build(skills = [skill]) {
        return buildDistribution(skills, docsRoot, authoredRoot, output, revision);
    }
    try {
        fs.mkdirSync(path.join(docsRoot, 'maps'), { recursive: true });
        fs.mkdirSync(path.join(source, 'references', 'docs'), { recursive: true });
        fs.mkdirSync(path.join(source, 'scripts'));
        const markdown = '---\nname: test-skill\ndescription: Test skill.\n---\n\nRead `references/docs/index.md`.\n';
        fs.writeFileSync(path.join(source, 'SKILL.md'), markdown);
        fs.writeFileSync(path.join(source, 'references', 'custom.md'), 'Authored reference.\n');
        fs.writeFileSync(path.join(source, 'scripts', 'example.js'), '// Authored script.\n');
        fs.writeFileSync(path.join(source, 'references', 'docs', 'stale.md'), 'Old generated output.\n');
        fs.writeFileSync(path.join(docsRoot, 'maps', 'start.md'), [
            'Getting started',
            '===',
            '',
            'Useful text.',
            '<iframe src="https://example.com/demo"></iframe>',
            '![remove](image.png)',
            '<img src="image.png"/>',
            '', '', '', '',
            '```html',
            '<iframe src="keep.html"></iframe>',
            '![keep](keep.png)',
            '```'
        ].join('\n') + '\n');
        fs.writeFileSync(path.join(docsRoot, 'maps', 'no-heading.md'), 'No heading.\n');
        fs.writeFileSync(path.join(docsRoot, 'maps', 'other.md'), '# Other\n');
        validateOutput(output, tempRoot);
        assert.deepEqual(build(), [{ name: 'test-skill', docs: 3 }]);
        const bundle = path.join(output, 'test-skill');
        const bundledDocs = path.join(bundle, 'references', 'docs');
        assert.equal(fs.readFileSync(path.join(bundle, 'SKILL.md'), 'utf8'), markdown);
        assert.equal(fs.readFileSync(path.join(bundle, 'references', 'custom.md'), 'utf8'), 'Authored reference.\n');
        assert.equal(fs.readFileSync(path.join(bundle, 'scripts', 'example.js'), 'utf8'), '// Authored script.\n');
        assert.equal(fs.existsSync(path.join(bundledDocs, 'stale.md')), false);
        assert.equal(fs.readFileSync(path.join(source, 'SKILL.md'), 'utf8'), markdown);
        assert.equal(fs.existsSync(path.join(source, 'references', 'docs', 'stale.md')), true);
        const stripped = fs.readFileSync(path.join(bundledDocs, 'maps', 'start.md'), 'utf8');
        assert.ok(stripped.includes('Useful text.'));
        assert.ok(stripped.includes('[Live demo](https://example.com/demo)'));
        assert.ok(stripped.includes('<iframe src="keep.html"></iframe>'));
        assert.ok(stripped.includes('![keep](keep.png)'));
        assert.equal(stripped.includes('![remove]'), false);
        assert.equal(stripped.includes('<img'), false);
        assert.equal(stripped.includes('\n\n\n\n'), false);
        const index = fs.readFileSync(path.join(bundledDocs, 'index.md'), 'utf8');
        assert.ok(index.includes('[Getting started](maps/start.md)'));
        assert.ok(index.includes('[no-heading](maps/no-heading.md)'));
        const metadata = fs.readFileSync(path.join(output, 'source.json'), 'utf8');
        assert.deepEqual(JSON.parse(metadata), {
            repository: 'highcharts/highcharts', revision, skills: ['test-skill']
        });
        fs.writeFileSync(path.join(output, 'orphan.txt'), 'Stale bundle output.');
        build();
        assert.equal(fs.existsSync(path.join(output, 'orphan.txt')), false);
        assert.equal(fs.readFileSync(path.join(output, 'source.json'), 'utf8'), metadata);
        assert.equal(fs.readFileSync(path.join(bundledDocs, 'maps', 'start.md'), 'utf8'), stripped);

        fs.unlinkSync(path.join(docsRoot, 'maps', 'other.md'));
        fs.writeFileSync(path.join(docsRoot, 'maps', 'new.md'), '# New\n');
        build();
        assert.equal(fs.existsSync(path.join(bundledDocs, 'maps', 'other.md')), false);
        assert.ok(fs.existsSync(path.join(bundledDocs, 'maps', 'new.md')));
        fs.writeFileSync(path.join(source, 'SKILL.md'), markdown + '\nUpdated instructions.\n');
        build();
        assert.equal(readSkillMd(bundle), markdown + '\nUpdated instructions.\n');

        fs.unlinkSync(path.join(source, 'SKILL.md'));
        assert.throws(build, /Missing authored skill file/u);
        assert.ok(fs.existsSync(path.join(bundledDocs, 'index.md')), 'failed build must preserve previous output');
        fs.writeFileSync(path.join(source, 'SKILL.md'), markdown + '\nRead [missing](references/missing.md).\n');
        assert.throws(build, /Missing skill reference/u);
        fs.writeFileSync(path.join(source, 'SKILL.md'), markdown);
        assert.throws(() => build([]), /unique skill configurations/u);
        assert.throws(() => build([skill, skill]), /unique skill configurations/u);
        fs.renameSync(source, path.join(authoredRoot, 'renamed-skill'));
        assert.throws(build, /No configuration/u);
        build([{ ...skill, name: 'renamed-skill' }]);
        assert.equal(fs.existsSync(bundle), false, 'renaming a skill must remove its old output');
        const renamedSource = path.join(authoredRoot, 'renamed-skill');
        const link = path.join(renamedSource, 'linked-resource');
        fs.symlinkSync(docsRoot, link, process.platform === 'win32' ? 'junction' : 'dir');
        assert.throws(() => build([{ ...skill, name: 'renamed-skill' }]), /Unsupported authored resource/u);
        fs.unlinkSync(link);
        fs.symlinkSync(docsRoot, path.join(tempRoot, 'build', 'linked'), process.platform === 'win32' ? 'junction' : 'dir');
        assert.throws(() => validateOutput(path.join(tempRoot, 'build', 'linked', 'out'), tempRoot), /symlinks/u);

        for (const configured of SKILLS) {
            const built = buildSkill(configured, path.join(repoRoot, 'docs'), path.join(tempRoot, 'real'));
            const authored = path.join(repoRoot, 'skills', configured.name);
            copyAuthored(authored, built.root);
            validateReferences(built.root, readSkillMd(authored));
            const docs = path.join(built.root, 'references', 'docs');
            const indexText = fs.readFileSync(path.join(docs, 'index.md'), 'utf8');
            assert.equal(indexText.split('\n').filter(line => line.startsWith('- [')).length, built.files.length);
            for (const file of built.files) {
                assert.equal(
                    fs.readFileSync(path.join(docs, file), 'utf8'),
                    stripContent(fs.readFileSync(path.join(repoRoot, 'docs', file), 'utf8'))
                );
            }
        }
    } finally {
        fs.rmSync(tempRoot, { force: true, recursive: true });
    }
}

function main() {
    const args = parseArgs(process.argv.slice(2));

    if (args.help) {
        printHelp();
        return;
    }

    if (args.selfTest) {
        selfTest();
        process.stdout.write('Self-test passed.\n');
        return;
    }

    const results = generate(args);
    process.stdout.write(`Built complete skills in ${path.relative(repoRoot, args.output)}\n`);
    for (const result of results) {
        process.stdout.write(`${result.name}: copied ${result.docs} docs\n`);
    }
}

if (require.main === module) {
    try {
        main();
    } catch (error) {
        process.stderr.write(`${error.message}\n`);
        process.exitCode = 1;
    }
}
