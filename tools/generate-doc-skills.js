#!/usr/bin/env node
/*
 * Generate agent skills from the docs markdown tree.
 */

'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');

function validateStringList(file, field, value) {
    if (!Array.isArray(value) || !value.every(item => typeof item === 'string')) {
        throw new Error(`${file}: skillMd.${field} must be an array of strings`);
    }
}

function validateSkillMd(file, skillMd) {
    if (typeof skillMd === 'string') {
        return;
    }
    if (!skillMd || typeof skillMd !== 'object') {
        throw new Error(`${file}: skillMd must be a string or structured object`);
    }
    for (const key of ['description', 'title', 'scope']) {
        if (typeof skillMd[key] !== 'string' || !skillMd[key]) {
            throw new Error(`${file}: skillMd.${key} must be a non-empty string`);
        }
    }
    for (const key of ['workflow', 'boundaries', 'references']) {
        validateStringList(file, key, skillMd[key]);
    }
}

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
        if (!skill.skillMd) {
            throw new Error(`${f}: missing required property "skillMd"`);
        }
        validateSkillMd(f, skill.skillMd);
        return skill;
    });
}

const SKILLS = loadSkills(repoRoot);

function printHelp() {
    process.stdout.write([
        'Generate agent skills from docs markdown.',
        'Output: skills/<name>/ with bundled reference docs.',
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
        '  --check            Check all generated skills without rewriting output',
        '  --yes, -y           Required for generation: confirms directory replacement',
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


function numberedLines(lines) {
    return lines.map((line, index) => `${index + 1}. ${line}`);
}

function bulletLines(lines) {
    return lines.map(line => `- ${line}`);
}

function renderSkillMd(name, skillMd) {
    if (typeof skillMd === 'string') {
        return skillMd;
    }

    return [
        '---',
        `name: ${name}`,
        `description: ${skillMd.description}`,
        '---',
        '',
        `# ${skillMd.title}`,
        '',
        skillMd.scope,
        '',
        '## Workflow',
        '',
        ...numberedLines(skillMd.workflow),
        '',
        '## Boundaries',
        '',
        ...bulletLines(skillMd.boundaries),
        '',
        '## References',
        '',
        ...bulletLines(skillMd.references),
        ''
    ].join('\n');
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
    fs.writeFileSync(path.join(skillRoot, 'SKILL.md'), renderSkillMd(skill.name, skill.skillMd));

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

function publishSkill(skill, generated, yes) {
    const published = [];

    for (const destination of skill.destinations) {
        if (fs.existsSync(destination.path) && !yes) {
            throw new Error(`Refusing to replace ${path.relative(repoRoot, destination.path)} without --yes`);
        }
        fs.rmSync(destination.path, { force: true, recursive: true });
        fs.mkdirSync(path.dirname(destination.path), { recursive: true });
        fs.cpSync(generated.root, destination.path, { recursive: true });
        published.push(destination.path);
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
            if (!sameDirectory(generated.root, path.join(outputRoot, skill.name))) {
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
                `Generated skills are out of date: ${stale.sort().join(', ')}.\n` +
                'Run npm run generate:skills -- --yes and remove outputs for deleted configurations.'
            );
        }
    } finally {
        fs.rmSync(tempRoot, { force: true, recursive: true });
    }
}

function generate(args) {
    if (!args.yes) {
        throw new Error('Pass --yes to replace generated skill directories.');
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
            destinations: [{ path: path.join(outputRoot, 'test-skill') }],
            skillMd: '---\nname: test-skill\ndescription: Test skill for self-test.\n---\n\n# Test skill\n'
        };
        const generated = buildSkill(testSkill, docsRoot, path.join(tempRoot, 'build'));
        const result = publishSkill(testSkill, generated, true);

        assert.deepEqual(generated.files, [
            'getting-started/installation.md',
            'getting-started/no-heading.md',
            'getting-started/setext-heading.md',
            'getting-started/with-noise.md'
        ]);
        assert.equal(result.published.length, 1);
        const staleFile = path.join(outputRoot, 'test-skill', 'stale.md');
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
            () => fs.mkdirSync(path.join(outputRoot, 'test-skill', 'unexpected-directory'))
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
        assert.throws(
            () => checkSkills([{ ...testSkill, skillMd: `${testSkill.skillMd}Changed instructions.\n` }], docsRoot, outputRoot),
            /test-skill/u
        );

        const newDoc = path.join(docsRoot, 'getting-started', 'new.md');
        fs.writeFileSync(newDoc, '# New page\n');
        assert.throws(() => checkSkills([testSkill], docsRoot, outputRoot), /test-skill/u);
        fs.unlinkSync(newDoc);
        fs.unlinkSync(path.join(docsRoot, 'getting-started', 'installation.md'));
        assert.throws(() => checkSkills([testSkill], docsRoot, outputRoot), /test-skill/u);
        fs.writeFileSync(path.join(docsRoot, 'getting-started', 'installation.md'), '# Install\n');
        checkSkills([testSkill], docsRoot, outputRoot);
        assert.equal(
            fs.readFileSync(path.join(outputRoot, 'test-skill', 'SKILL.md'), 'utf8'),
            '---\nname: test-skill\ndescription: Test skill for self-test.\n---\n\n# Test skill\n'
        );

        const structuredSkill = {
            name: 'structured-skill',
            docs: { include: ['react/'], exclude: [] },
            destinations: [{ path: path.join(outputRoot, 'structured-skill') }],
            skillMd: {
                description: 'Structured skill description.',
                title: 'Structured Skill',
                scope: 'Use this for structured skill generation.',
                workflow: ['Read the index.', 'Read matching docs.'],
                boundaries: ['Use another skill for unrelated work.'],
                references: ['Live docs: https://example.com/']
            }
        };
        const structuredGenerated = buildSkill(structuredSkill, docsRoot, path.join(tempRoot, 'build-structured'));
        publishSkill(structuredSkill, structuredGenerated, true);
        assert.equal(
            fs.readFileSync(path.join(outputRoot, 'structured-skill', 'SKILL.md'), 'utf8'),
            [
                '---',
                'name: structured-skill',
                'description: Structured skill description.',
                '---',
                '',
                '# Structured Skill',
                '',
                'Use this for structured skill generation.',
                '',
                '## Workflow',
                '',
                '1. Read the index.',
                '2. Read matching docs.',
                '',
                '## Boundaries',
                '',
                '- Use another skill for unrelated work.',
                '',
                '## References',
                '',
                '- Live docs: https://example.com/',
                ''
            ].join('\n')
        );

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
            const markdown = fs.readFileSync(path.join(built.root, 'SKILL.md'), 'utf8');
            assert.ok(markdown.includes('`references/docs/index.md`'));
            assert.ok(markdown.includes(`name: highcharts-${topic}\n`));
            assert.ok(markdown.includes(`description: ${skill.skillMd.description}\n`));
            if (topic === 'react') {
                assert.deepEqual(skill.docs, { include: ['react/'], exclude: [] });
                for (const rule of [
                    'use the relevant child component first, including JSX children where supported; use chart-level props or the `options` prop only when no child component expresses the behavior',
                    'Drive dynamic values through React state and props',
                    'Use chart instance APIs only when neither declarative route works',
                    'Render series as direct children of `Chart`',
                    'Prefer dedicated series components; use the generic `Series` component when series are dynamic or a dedicated component is impractical',
                    'keep hooks and state in the parent and pass values through props',
                    'verify child support and static parsing behavior before preferring children over chart-level options',
                    'Use dedicated series and module components and import only what the chart renders',
                    'Import a module from `highcharts/es-modules/masters/...` only when no React component exists',
                    'load a complete product bundle only when its feature set is required',
                    'use a `Chart` ref only when the behavior cannot be expressed through child components or chart props/options',
                    'Add \'use client\' to files containing Highcharts components or modules',
                    'keep Highcharts imports and rendering in the client component',
                    'Server code may fetch or stream data into that component but must not instantiate Highcharts'
                ]) {
                    assert.ok(markdown.includes(rule), rule);
                }
            }
            if (topic === 'js') {
                for (const file of [
                    'getting-started/your-first-chart.md',
                    'chart-concepts/series.md',
                    'accessibility/accessibility-module-feature-overview.md'
                ]) {
                    assert.ok(built.files.includes(file), file);
                }
                assert.equal(built.files.some(file => /^(working-with-data|export-module)\//u.test(file)), false);
                for (const route of ['data', 'accessibility', 'exporting']) {
                    assert.ok(markdown.includes(`\`highcharts-${route}\``));
                }
                assert.ok(markdown.includes('Basic `series.data` setup remains in this skill'));
            }
            const index = fs.readFileSync(
                path.join(built.root, 'references', 'docs', 'index.md'), 'utf8'
            );
            assert.equal(
                index.split('\n').filter(line => line.startsWith('- [')).length,
                expectedDocs.length
            );
            for (const file of expectedDocs) {
                assert.ok(index.includes(`](${file})`), file);
                assert.equal(
                    fs.readFileSync(path.join(built.root, 'references', 'docs', file), 'utf8'),
                    stripContent(fs.readFileSync(path.join(sourceDocs, file), 'utf8')),
                    file
                );
            }
        }

        for (const skill of SKILLS) {
            assert.deepEqual(skill.destinations, [
                { path: path.join(repoRoot, 'skills', skill.name) }
            ]);
            assert.match(
                renderSkillMd(skill.name, skill.skillMd),
                /^---\nname: .+\ndescription: .+\n---/u,
                `${skill.name}: skillMd must render name and description frontmatter`
            );
            const built = buildSkill(skill, sourceDocs, path.join(tempRoot, 'build-portable'));
            const markdown = fs.readFileSync(path.join(built.root, 'SKILL.md'), 'utf8');
            for (const match of markdown.matchAll(/`(references\/docs\/[^`]+)`/gu)) {
                assert.ok(fs.existsSync(path.join(built.root, match[1])), `${skill.name}: missing ${match[1]}`);
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
        process.stdout.write(`All ${SKILLS.length} generated skills are up to date.\n`);
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
