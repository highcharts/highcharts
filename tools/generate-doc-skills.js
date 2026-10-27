#!/usr/bin/env node
/*
 * Generate skill references from the docs markdown tree.
 */

'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');

function loadSkills(root) {
    const configDir = path.join(__dirname, 'skill-configs');
    const files = fs.readdirSync(configDir)
        .filter(f => f.endsWith('.js'))
        .sort();

    return files.map(f => {
        const skill = require(path.join(configDir, f))(root);
        const required = ['name', 'docs', 'destinations'];
        for (const key of required) {
            if (!skill[key]) {
                throw new Error(`${f}: missing required property "${key}"`);
            }
        }
        return skill;
    });
}

const SKILLS = loadSkills(repoRoot);

function printHelp() {
    process.stdout.write([
        'Generate skill references from docs markdown.',
        'Output: skills/<name>/references/docs/. Authored SKILL.md files are preserved.',
        '',
        'Usage:',
        '  node tools/generate-doc-skills.js --yes',
        '  node tools/generate-doc-skills.js --yes --skill=highcharts-js',
        '  node tools/generate-doc-skills.js --docs=docs --yes',
        '  node tools/generate-doc-skills.js --check',
        '',
        'Options:',
        '  --docs=<path>       Docs markdown source directory. Default: docs',
        '  --skill=<a,b>       Generate only selected skills. Default: all',
        '  --check             Check all generated references without rewriting output',
        '  --yes, -y           Required for generation: confirms reference replacement',
        '  --self-test         Run the script self-test',
        '  --help, -h          Print this help text'
    ].join('\n') + '\n');
}

function parseArgs(argv) {
    const args = {
        docs: path.join(repoRoot, 'docs'),
        yes: false,
        check: false,
        skills: null,
        selfTest: false,
        help: false
    };

    for (const arg of argv) {
        if (arg === '--yes' || arg === '-y') {
            args.yes = true;
        } else if (arg === '--check') {
            args.check = true;
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
        } else if (arg.startsWith('--skill=')) {
            args.skills = new Set(arg.slice('--skill='.length).split(',').filter(Boolean));
        } else {
            throw new Error(`Unknown option: ${arg}`);
        }
    }

    if (args.check && (args.yes || args.skills)) {
        throw new Error('--check validates all skills; omit --yes and --skill.');
    }

    return args;
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
        root: docsOut,
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

function publishSkill(skill, generated, yes) {
    const published = [];

    for (const destination of skill.destinations) {
        readSkillMd(destination.path);
        const references = path.join(destination.path, 'references');
        if (fs.existsSync(references) && !fs.lstatSync(references).isDirectory()) {
            throw new Error(`Expected a references directory: ${references}`);
        }
        const docs = path.join(references, 'docs');
        if (fs.existsSync(docs) && !yes) {
            throw new Error(`Refusing to replace ${path.relative(repoRoot, docs)} without --yes`);
        }
        fs.rmSync(docs, { force: true, recursive: true });
        fs.mkdirSync(references, { recursive: true });
        fs.cpSync(generated.root, docs, { recursive: true });
        published.push(docs);
    }

    if (!published.length) {
        throw new Error(`No publish destination exists for ${skill.name}`);
    }

    return {
        published
    };
}

function sameDirectory(expected, actual) {
    if (!fs.existsSync(actual) || !fs.lstatSync(actual).isDirectory()) {
        return false;
    }
    const entries = fs.readdirSync(expected, { withFileTypes: true });
    if (entries.length !== fs.readdirSync(actual).length) {
        return false;
    }
    return entries.every(entry => {
        const source = path.join(expected, entry.name);
        const destination = path.join(actual, entry.name);
        return entry.isDirectory() ? sameDirectory(source, destination) :
            fs.existsSync(destination) && fs.lstatSync(destination).isFile() &&
            fs.readFileSync(source).equals(fs.readFileSync(destination));
    });
}

function checkSkills(skills, docsRoot, outputRoot) {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'highcharts-doc-skills-check-'));
    const stale = [];
    try {
        for (const skill of skills) {
            const generated = buildSkill(skill, docsRoot, tempRoot);
            const skillRoot = path.join(outputRoot, skill.name);
            readSkillMd(skillRoot);
            const references = path.join(skillRoot, 'references');
            if (!fs.existsSync(references) || !fs.lstatSync(references).isDirectory() ||
                !sameDirectory(generated.root, path.join(references, 'docs'))) {
                stale.push(skill.name);
            }
        }
        const names = new Set(skills.map(skill => skill.name));
        if (fs.existsSync(outputRoot)) {
            for (const entry of fs.readdirSync(outputRoot, { withFileTypes: true })) {
                if ((entry.isDirectory() || entry.isSymbolicLink()) && !names.has(entry.name)) {
                    stale.push(`${entry.name} (no configuration)`);
                }
            }
        }
        if (stale.length) {
            throw new Error(
                `Generated skill references are out of date: ${stale.sort().join(', ')}.\n` +
                'Run npm run generate:skills -- --yes and remove outputs for deleted configurations.'
            );
        }
    } finally {
        fs.rmSync(tempRoot, { force: true, recursive: true });
    }
}

function generate(args) {
    if (!args.yes) {
        throw new Error('Pass --yes to replace generated reference directories.');
    }
    if (!fs.existsSync(args.docs) || !fs.statSync(args.docs).isDirectory()) {
        throw new Error(`Missing docs directory: ${args.docs}`);
    }

    const selected = SKILLS.filter(skill => !args.skills || args.skills.has(skill.name));
    const unknown = args.skills ? [...args.skills].filter(name => !SKILLS.some(skill => skill.name === name)) : [];
    if (unknown.length) {
        throw new Error(`Unknown skill: ${unknown.join(', ')}`);
    }

    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'highcharts-doc-skills-'));
    try {
        return selected.map(skill => {
            const generated = buildSkill(skill, args.docs, tempRoot);
            const result = publishSkill(skill, generated, args.yes);
            return {
                name: skill.name,
                docs: generated.files.length,
                ...result
            };
        });
    } finally {
        fs.rmSync(tempRoot, { force: true, recursive: true });
    }
}

function selfTest() {
    assert.equal(parseArgs(['--check']).check, true);
    assert.throws(() => parseArgs(['--check', '--yes']), /omit --yes and --skill/u);
    assert.throws(() => parseArgs(['--check', '--skill=highcharts-react']), /omit --yes and --skill/u);
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'highcharts-doc-skills-test-'));
    try {
        const docsRoot = path.join(tempRoot, 'docs');
        fs.mkdirSync(path.join(docsRoot, 'react', 'components'), { recursive: true });
        fs.mkdirSync(path.join(docsRoot, 'getting-started'), { recursive: true });
        fs.writeFileSync(path.join(docsRoot, 'react', 'getting-started.md'), '# React start\n');
        fs.writeFileSync(path.join(docsRoot, 'react', 'components', 'chart.md'), '# Chart\n');
        fs.writeFileSync(path.join(docsRoot, 'getting-started', 'installation.md'), '# Install\n');
        fs.writeFileSync(path.join(docsRoot, 'getting-started', 'no-heading.md'), 'Just some text without a heading.\n');
        fs.writeFileSync(path.join(docsRoot, 'getting-started', 'setext-heading.md'), 'Setext Title\n===\n\nSome content.\n');

        // Add a doc with strippable content
        fs.writeFileSync(path.join(docsRoot, 'getting-started', 'with-noise.md'), [
            '# Getting Started',
            '',
            'Some intro text.',
            '',
            '<iframe style="width: 100%; height: 480px; border: none;" src="https://www.highcharts.com/samples/embed/highcharts/demo/line-basic" allow="fullscreen"></iframe>',
            '',
            '   <iframe width="320" height="800" src="https://www.highcharts.com/samples/embed/stock/demo/stock-tools-gui" allow="fullscreen"></iframe>',
            '',
            '![chart screenshot](chart.png)',
            '',
            '   ![indented image](indented.png)',
            '',
            '<img src="diagram.png" alt="diagram"/>',
            '',
            'More useful text.',
            '',
            '',
            '',
            '',
            'After many blank lines.',
            '',
            '```html',
            '<!-- This iframe in a code block should survive -->',
            '<iframe src="example.html"></iframe>',
            '![keep this](keep.png)',
            '```',
            '',
            'End of doc.'
        ].join('\n') + '\n');

        const outputRoot = path.join(tempRoot, 'out');
        const testSkill = {
            name: 'test-skill',
            docs: { include: ['getting-started/'], exclude: [] },
            destinations: [{ path: path.join(outputRoot, 'test-skill') }]
        };
        const skillRoot = path.join(outputRoot, 'test-skill');
        const skillFile = path.join(skillRoot, 'SKILL.md');
        const authoredMarkdown = '---\nname: test-skill\ndescription: Test skill for self-test.\n---\n\n# Test skill\n';
        fs.mkdirSync(path.join(skillRoot, 'references'), { recursive: true });
        fs.writeFileSync(skillFile, authoredMarkdown);
        const customReference = path.join(skillRoot, 'references', 'custom.md');
        fs.writeFileSync(customReference, 'Authored reference.\n');
        fs.mkdirSync(path.join(skillRoot, 'scripts'));
        const customScript = path.join(skillRoot, 'scripts', 'example.js');
        fs.writeFileSync(customScript, '// Authored script.\n');
        const generated = buildSkill(testSkill, docsRoot, path.join(tempRoot, 'build'));
        const result = publishSkill(testSkill, generated, true);

        assert.deepEqual(generated.files, [
            'getting-started/installation.md',
            'getting-started/no-heading.md',
            'getting-started/setext-heading.md',
            'getting-started/with-noise.md'
        ]);
        assert.equal(result.published.length, 1);
        const staleFile = path.join(skillRoot, 'references', 'docs', 'stale.md');
        fs.writeFileSync(staleFile, 'Removed from source docs.\n');
        assert.throws(() => publishSkill(testSkill, generated, false), /without --yes/u);
        assert.ok(fs.existsSync(staleFile), 'refusing replacement must preserve installed files');
        publishSkill(testSkill, generated, true);
        assert.equal(fs.existsSync(staleFile), false, 'replacement must remove stale references');
        const missingOutput = path.join(tempRoot, 'missing-output');
        assert.throws(() => checkSkills([testSkill], docsRoot, missingOutput), /test-skill/u);
        assert.equal(fs.existsSync(missingOutput), false, 'checking must not create output');
        checkSkills([testSkill], docsRoot, outputRoot);

        const installedDoc = path.join(outputRoot, 'test-skill', 'references', 'docs', 'getting-started', 'installation.md');
        fs.writeFileSync(installedDoc, 'Stale content.\n');
        assert.throws(() => checkSkills([testSkill], docsRoot, outputRoot), /test-skill/u);
        assert.equal(fs.readFileSync(installedDoc, 'utf8'), 'Stale content.\n', 'checking must not rewrite output');

        for (const change of [
            () => fs.unlinkSync(installedDoc),
            () => fs.writeFileSync(staleFile, 'Unexpected output.\n'),
            () => fs.mkdirSync(path.join(skillRoot, 'references', 'docs', 'unexpected-directory'))
        ]) {
            publishSkill(testSkill, generated, true);
            change();
            assert.throws(() => checkSkills([testSkill], docsRoot, outputRoot), /test-skill/u);
        }
        publishSkill(testSkill, generated, true);
        assert.throws(() => checkSkills([], docsRoot, outputRoot), /test-skill.*no configuration/u);
        assert.ok(fs.existsSync(installedDoc), 'checking removed configurations must preserve output');
        assert.throws(
            () => checkSkills([{ ...testSkill, name: 'renamed-skill' }], docsRoot, outputRoot),
            /renamed-skill/u
        );
        assert.throws(() => checkSkills([{
            ...testSkill,
            docs: { ...testSkill.docs, exclude: ['getting-started/installation.md'] }
        }], docsRoot, outputRoot), /test-skill/u);

        const editedMarkdown = authoredMarkdown + '\nUpdated instructions.\n';
        fs.writeFileSync(skillFile, editedMarkdown);
        checkSkills([testSkill], docsRoot, outputRoot);
        publishSkill(testSkill, generated, true);
        assert.equal(readSkillMd(skillRoot), editedMarkdown, 'regeneration must preserve edited instructions');
        assert.equal(fs.readFileSync(customReference, 'utf8'), 'Authored reference.\n');
        assert.equal(fs.readFileSync(customScript, 'utf8'), '// Authored script.\n');
        fs.unlinkSync(skillFile);
        assert.throws(() => checkSkills([testSkill], docsRoot, outputRoot), /Missing authored skill file/u);
        assert.throws(() => publishSkill(testSkill, generated, true), /Missing authored skill file/u);
        assert.ok(fs.existsSync(installedDoc), 'a missing entrypoint must not remove references');
        assert.equal(fs.existsSync(skillFile), false, 'generation must not create the authored entrypoint');
        fs.writeFileSync(skillFile, editedMarkdown);

        const references = path.join(skillRoot, 'references');
        const savedReferences = path.join(skillRoot, 'saved-references');
        fs.renameSync(references, savedReferences);
        fs.symlinkSync(savedReferences, references, process.platform === 'win32' ? 'junction' : 'dir');
        assert.throws(() => publishSkill(testSkill, generated, true), /Expected a references directory/u);
        assert.throws(() => checkSkills([testSkill], docsRoot, outputRoot), /test-skill/u);
        assert.ok(fs.existsSync(path.join(savedReferences, 'docs', 'index.md')));
        fs.unlinkSync(references);
        fs.renameSync(savedReferences, references);

        const newDoc = path.join(docsRoot, 'getting-started', 'new.md');
        fs.writeFileSync(newDoc, '# New page\n');
        assert.throws(() => checkSkills([testSkill], docsRoot, outputRoot), /test-skill/u);
        fs.unlinkSync(newDoc);
        fs.unlinkSync(path.join(docsRoot, 'getting-started', 'installation.md'));
        assert.throws(() => checkSkills([testSkill], docsRoot, outputRoot), /test-skill/u);
        fs.writeFileSync(path.join(docsRoot, 'getting-started', 'installation.md'), '# Install\n');
        checkSkills([testSkill], docsRoot, outputRoot);
        assert.equal(readSkillMd(skillRoot), editedMarkdown);

        const stripped = fs.readFileSync(
            path.join(outputRoot, 'test-skill', 'references', 'docs', 'getting-started', 'with-noise.md'),
            'utf8'
        );
        // Strippable content is gone
        assert.equal(stripped.includes('<iframe style='), false, 'raw iframe HTML should be stripped');
        assert.equal(stripped.includes('<iframe width='), false, 'indented raw iframe HTML should be stripped');
        assert.equal(stripped.includes('[Live demo](https://www.highcharts.com/samples/embed/highcharts/demo/line-basic)'), true, 'iframe src should become a demo link');
        assert.equal(stripped.includes('[Live demo](https://www.highcharts.com/samples/embed/stock/demo/stock-tools-gui)'), true, 'indented iframe src should become a demo link');
        assert.equal(stripped.includes('![chart screenshot]'), false, 'markdown images should be stripped');
        assert.equal(stripped.includes('![indented image]'), false, 'indented markdown images should be stripped');
        assert.equal(stripped.includes('<img'), false, 'HTML images should be stripped');
        // Non-strippable content survives
        assert.equal(stripped.includes('# Getting Started'), true, 'headings should survive');
        assert.equal(stripped.includes('Some intro text.'), true, 'prose should survive');
        assert.equal(stripped.includes('More useful text.'), true, 'prose should survive');
        assert.equal(stripped.includes('End of doc.'), true, 'prose should survive');
        // Code block content preserved
        assert.equal(stripped.includes('<iframe src="example.html"></iframe>'), true, 'iframe inside code block should survive');
        assert.equal(stripped.includes('![keep this](keep.png)'), true, 'image inside code block should survive');
        assert.equal(stripped.includes('```html'), true, 'code fence language tag should survive');
        // Blank line collapsing
        assert.equal(stripped.includes('\n\n\n\n'), false, 'should not have 3+ consecutive blank lines');
        // Clean file is unchanged
        const clean = fs.readFileSync(
            path.join(outputRoot, 'test-skill', 'references', 'docs', 'getting-started', 'installation.md'),
            'utf8'
        );
        assert.equal(clean, '# Install\n', 'clean file should be unchanged');

        // Index generation
        const indexContent = fs.readFileSync(
            path.join(outputRoot, 'test-skill', 'references', 'docs', 'index.md'),
            'utf8'
        );
        assert.equal(indexContent.includes('# Topic Index'), true, 'index should have Topic Index heading');
        assert.equal(indexContent.includes('## getting-started'), true, 'index should group by directory');
        assert.equal(indexContent.includes('[Install](getting-started/installation.md)'), true, 'index should link to docs with H1 title');
        assert.equal(indexContent.includes('[Getting Started](getting-started/with-noise.md)'), true, 'index should link to docs with H1 title');
        assert.equal(indexContent.includes('[no-heading](getting-started/no-heading.md)'), true, 'index should fall back to filename when no H1');
        assert.equal(indexContent.includes('[Setext Title](getting-started/setext-heading.md)'), true, 'index should detect Setext H1 headings');

        const sourceDocs = path.join(repoRoot, 'docs');
        for (const [topic, directories] of [
            ['accessibility', ['accessibility', 'sonification']],
            ['data', ['working-with-data']],
            ['exporting', ['export-module']],
            ['js', ['getting-started', 'chart-concepts', 'chart-and-series-types', 'chart-design-and-style']],
            ['react', ['react']]
        ]) {
            const skill = SKILLS.find(item => item.name === `highcharts-${topic}`);
            assert.ok(skill, `${topic} config should be loaded`);
            const expectedDocs = [
                ...directories.flatMap(directory => (
                    listMarkdownFiles(path.join(sourceDocs, directory))
                        .map(file => `${directory}/${file}`)
                )),
                ...(topic === 'js' ? [
                    'accessibility/accessibility-module-feature-overview.md',
                    'advanced-chart-features/boost-module.md',
                    'advanced-chart-features/data-sorting.md',
                    'advanced-chart-features/highcharts-typescript-declarations.md',
                    'advanced-chart-features/internationalization.md',
                    'advanced-chart-features/stacking-charts.md'
                ] : topic === 'react' ? [] : [
                    `react/components/modules/${topic}.md`,
                    'react/getting-started.md',
                    'react/bundling-and-tree-shaking.md'
                ])
            ].sort();
            const built = buildSkill(skill, sourceDocs, path.join(tempRoot, 'build-real'));
            assert.deepEqual(built.files, expectedDocs);
            assert.equal(built.files.some(file => /^(grid|dashboards|morningstar)\//u.test(file)), false);
            const index = fs.readFileSync(
                path.join(built.root, 'index.md'), 'utf8'
            );
            assert.equal(
                index.split('\n').filter(line => line.startsWith('- [')).length,
                expectedDocs.length
            );
            for (const file of expectedDocs) {
                assert.ok(index.includes(`](${file})`), file);
                assert.equal(
                    fs.readFileSync(path.join(built.root, file), 'utf8'),
                    stripContent(fs.readFileSync(path.join(sourceDocs, file), 'utf8')),
                    file
                );
            }
        }

        for (const skill of SKILLS) {
            assert.deepEqual(skill.destinations, [
                { path: path.join(repoRoot, 'skills', skill.name) }
            ]);
            const built = buildSkill(skill, sourceDocs, path.join(tempRoot, 'build-portable'));
            const markdown = readSkillMd(path.join(repoRoot, 'skills', skill.name));
            for (const match of markdown.matchAll(/`(references\/docs\/[^`]+)`/gu)) {
                assert.ok(
                    fs.existsSync(path.join(built.root, match[1].slice('references/docs/'.length))),
                    `${skill.name}: missing ${match[1]}`
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

    if (args.check) {
        checkSkills(SKILLS, args.docs, path.join(repoRoot, 'skills'));
        process.stdout.write(`All ${SKILLS.length} generated skill references are up to date.\n`);
        return;
    }

    const results = generate(args);
    for (const result of results) {
        process.stdout.write(`${result.name}: copied ${result.docs} docs\n`);
        for (const destination of result.published) {
            process.stdout.write(`  published ${path.relative(repoRoot, destination)}\n`);
        }
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
