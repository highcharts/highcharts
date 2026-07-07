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

const SKILLS = [
    {
        name: 'highcharts-js',
        docs: {
            include: [
                'getting-started/',
                'chart-concepts/',
                'chart-and-series-types/',
                'working-with-data/',
                'chart-design-and-style/',
                'export-module/export-module-overview.md',
                'export-module/client-side-export.md',
                'accessibility/accessibility-module-feature-overview.md',
                'advanced-chart-features/boost-module.md',
                'advanced-chart-features/data-sorting.md',
                'advanced-chart-features/highcharts-typescript-declarations.md',
                'advanced-chart-features/internationalization.md',
                'advanced-chart-features/stacking-charts.md'
            ],
            exclude: [
                'react/',
                'stock/',
                'maps/',
                'gantt/',
                'dashboards/',
                'grid/'
            ]
        },
        destinations: [
            {
                path: path.join(repoRoot, '.agents', 'skills', 'highcharts-js')
            },
            {
                path: path.join(repoRoot, '.claude', 'skills', 'highcharts-js')
            },
            {
                path: path.resolve(repoRoot, '..', 'highcharts-dist', '.claude', 'skills', 'highcharts-js'),
                requireParent: path.resolve(repoRoot, '..', 'highcharts-dist', 'package.json')
            }
        ],
        skillMd: `---
name: highcharts-js
description: Use to implement, configure, and troubleshoot core Highcharts JS charts from the bundled Highcharts markdown docs.
---

# Highcharts JS

Use this for core Highcharts JS work: installation, chart setup, options, axes, series, data, styling, accessibility, exporting, and common chart types.

## Workflow

1. Start with \`references/docs/index.md\`.
2. Read only the relevant copied docs before coding.
3. Prefer documented declarative options over imperative runtime mutation.

## Boundaries

- This first version focuses on core Highcharts JS.
- For Stock, Maps, Gantt, Dashboards, Grid, or framework integrations, use product-specific docs or skills.
- For exact option signatures, inspect local TypeScript declarations or the API reference after reading the copied tutorial docs.

## References

- Live docs: https://www.highcharts.com/docs/
- API reference: https://api.highcharts.com/highcharts/
`
    }
];

function printHelp() {
    process.stdout.write([
        'Generate agent skills from docs markdown.',
        '',
        'Usage:',
        '  node tools/generate-doc-skills.js --yes',
        '  node tools/generate-doc-skills.js --yes --skill=highcharts-js',
        '  node tools/generate-doc-skills.js --docs=docs --yes',
        '',
        'Options:',
        '  --docs=<path>       Docs markdown source directory. Default: docs',
        '  --skill=<a,b>       Generate only selected skills. Default: all',
        '  --yes, -y           Replace generated skill directories without prompting',
        '  --self-test         Run the script self-test',
        '  --help, -h          Print this help text'
    ].join('\n') + '\n');
}

function parseArgs(argv) {
    const args = {
        docs: path.join(repoRoot, 'docs'),
        yes: false,
        skills: null,
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
        } else if (arg.startsWith('--skill=')) {
            args.skills = new Set(arg.slice('--skill='.length).split(',').filter(Boolean));
        } else {
            throw new Error(`Unknown option: ${arg}`);
        }
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

function stripContent(markdown) {
    const result = markdown.replace(
        /(^```[^\n]*$[\s\S]*?^```\s*$)|(<iframe[\s\S]*?<\/iframe>)|(^\s*!\[.*?\]\(.*?\)\s*$)|(^\s*<img\b[^>]*\/?>\s*$)/gimu,
        function (match, codeBlock) {
            return codeBlock ? match : '';
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
    fs.writeFileSync(path.join(skillRoot, 'SKILL.md'), skill.skillMd);

    for (const file of files) {
        const source = path.join(docsRoot, file);
        const dest = path.join(docsOut, file);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        const content = fs.readFileSync(source, 'utf8');
        fs.writeFileSync(dest, stripContent(content));
    }

    return {
        root: skillRoot,
        files
    };
}

function publishSkill(skill, generated, yes) {
    const published = [];
    const skipped = [];

    for (const destination of skill.destinations) {
        if (destination.requireParent && !fs.existsSync(destination.requireParent)) {
            skipped.push(destination.path);
            continue;
        }

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
        published,
        skipped
    };
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
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'highcharts-doc-skills-test-'));
    try {
        const docsRoot = path.join(tempRoot, 'docs');
        fs.mkdirSync(path.join(docsRoot, 'react', 'components'), { recursive: true });
        fs.mkdirSync(path.join(docsRoot, 'getting-started'), { recursive: true });
        fs.writeFileSync(path.join(docsRoot, 'react', 'getting-started.md'), '# React start\n');
        fs.writeFileSync(path.join(docsRoot, 'react', 'components', 'chart.md'), '# Chart\n');
        fs.writeFileSync(path.join(docsRoot, 'getting-started', 'installation.md'), '# Install\n');

        // Add a doc with strippable content
        fs.writeFileSync(path.join(docsRoot, 'getting-started', 'with-noise.md'), [
            '# Getting Started',
            '',
            'Some intro text.',
            '',
            '<iframe style="width: 100%; height: 480px; border: none;" src="https://www.highcharts.com/samples/embed/highcharts/demo/line-basic" allow="fullscreen"></iframe>',
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
            skillMd: '# Test skill\n'
        };
        const generated = buildSkill(testSkill, docsRoot, path.join(tempRoot, 'build'));
        const result = publishSkill(testSkill, generated, true);

        assert.deepEqual(generated.files, [
            'getting-started/installation.md',
            'getting-started/with-noise.md'
        ]);
        assert.equal(result.published.length, 1);
        assert.equal(
            fs.readFileSync(path.join(outputRoot, 'test-skill', 'SKILL.md'), 'utf8'),
            '# Test skill\n'
        );

        const stripped = fs.readFileSync(
            path.join(outputRoot, 'test-skill', 'references', 'docs', 'getting-started', 'with-noise.md'),
            'utf8'
        );
        // Strippable content is gone
        assert.equal(stripped.includes('<iframe style='), false, 'iframes should be stripped');
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
    for (const result of results) {
        process.stdout.write(`${result.name}: copied ${result.docs} docs\n`);
        for (const destination of result.published) {
            process.stdout.write(`  published ${path.relative(repoRoot, destination)}\n`);
        }
        for (const destination of result.skipped) {
            process.stdout.write(`  skipped missing ${destination}\n`);
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
