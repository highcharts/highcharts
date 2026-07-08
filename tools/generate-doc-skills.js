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
description: Use to implement, configure, and troubleshoot Highcharts JS charts from the bundled Highcharts markdown docs.
---

# Highcharts JS

Use this for Highcharts JS work: installation, chart setup, options, axes, series, data, styling, and common chart types. Includes accessibility overview, export basics, and selected advanced features.

## Workflow

1. Start with \`references/docs/index.md\` for a topic map, then read relevant docs.
2. Read only the relevant copied docs before coding.
3. Prefer documented declarative options over imperative runtime mutation.

## Boundaries

- For Stock, Maps, Gantt, or Morningstar, use the \`highcharts-stock\`, \`highcharts-maps\`, \`highcharts-gantt\`, or \`highcharts-morningstar\` skill.
- For Dashboards, Grid, React, or Flutter, consult \`docs/<area>/\` directly or the live docs — no generated skill exists yet.
- For exact option signatures, inspect local TypeScript declarations or the API reference after reading the copied tutorial docs.

## References

- Live docs: https://www.highcharts.com/docs/
- API reference: https://api.highcharts.com/highcharts/
`
    },
    {
        name: 'highcharts-stock',
        docs: {
            include: ['stock/'],
            exclude: []
        },
        destinations: [
            { path: path.join(repoRoot, '.agents', 'skills', 'highcharts-stock') },
            { path: path.join(repoRoot, '.claude', 'skills', 'highcharts-stock') },
            {
                path: path.resolve(repoRoot, '..', 'highcharts-dist', '.claude', 'skills', 'highcharts-stock'),
                requireParent: path.resolve(repoRoot, '..', 'highcharts-dist', 'package.json')
            }
        ],
        skillMd: `---
name: highcharts-stock
description: Use to implement, configure, and troubleshoot Highcharts Stock charts from the bundled docs.
---

# Highcharts Stock

Use this for Highcharts Stock work: candlestick, OHLC, HLC, flags, technical indicators, navigator, range selector, data grouping, compare mode, and stock tools.

## Workflow

1. Start with \`references/docs/index.md\` for a topic map, then read relevant docs.
2. Read only the relevant copied docs before coding.
3. Prefer documented declarative options over imperative runtime mutation.

## Boundaries

- For core Highcharts JS concepts (axes, series, styling, accessibility), use the \`highcharts-js\` skill.
- For Morningstar data connectors, use the \`highcharts-morningstar\` skill.
- For Maps or Gantt, use the \`highcharts-maps\` or \`highcharts-gantt\` skill.
- For exact option signatures, inspect local TypeScript declarations or the API reference.

## References

- Live docs: https://www.highcharts.com/docs/stock/
- API reference: https://api.highcharts.com/highstock/
`
    },
    {
        name: 'highcharts-maps',
        docs: {
            include: ['maps/'],
            exclude: []
        },
        destinations: [
            { path: path.join(repoRoot, '.agents', 'skills', 'highcharts-maps') },
            { path: path.join(repoRoot, '.claude', 'skills', 'highcharts-maps') },
            {
                path: path.resolve(repoRoot, '..', 'highcharts-dist', '.claude', 'skills', 'highcharts-maps'),
                requireParent: path.resolve(repoRoot, '..', 'highcharts-dist', 'package.json')
            }
        ],
        skillMd: `---
name: highcharts-maps
description: Use to implement, configure, and troubleshoot Highcharts Maps from the bundled docs.
---

# Highcharts Maps

Use this for Highcharts Maps work: map series, mappoint, mapline, mapbubble, flowmap, tilemap, geoheatmap, tiled web map, projections, GeoJSON/TopoJSON, color axis, and map navigation.

## Workflow

1. Start with \`references/docs/index.md\` for a topic map, then read relevant docs.
2. Read only the relevant copied docs before coding.
3. Prefer documented declarative options over imperative runtime mutation.

## Boundaries

- For core Highcharts JS concepts (axes, series, styling, accessibility), use the \`highcharts-js\` skill.
- For Stock, Gantt, or Morningstar, use the \`highcharts-stock\`, \`highcharts-gantt\`, or \`highcharts-morningstar\` skill.
- For Dashboards or Grid, consult \`docs/<area>/\` directly or the live docs.
- For exact option signatures, inspect local TypeScript declarations or the API reference.

## References

- Live docs: https://www.highcharts.com/docs/maps/
- API reference: https://api.highcharts.com/highmaps/
`
    },
    {
        name: 'highcharts-gantt',
        docs: {
            include: ['gantt/'],
            exclude: []
        },
        destinations: [
            { path: path.join(repoRoot, '.agents', 'skills', 'highcharts-gantt') },
            { path: path.join(repoRoot, '.claude', 'skills', 'highcharts-gantt') },
            {
                path: path.resolve(repoRoot, '..', 'highcharts-dist', '.claude', 'skills', 'highcharts-gantt'),
                requireParent: path.resolve(repoRoot, '..', 'highcharts-dist', 'package.json')
            }
        ],
        skillMd: `---
name: highcharts-gantt
description: Use to implement, configure, and troubleshoot Highcharts Gantt charts from the bundled docs.
---

# Highcharts Gantt

Use this for Highcharts Gantt work: task configuration, dependencies, axis grids, grouping tasks, and milestones.

## Workflow

1. Start with \`references/docs/index.md\` for a topic map, then read relevant docs.
2. Read only the relevant copied docs before coding.
3. Prefer documented declarative options over imperative runtime mutation.

## Boundaries

- For core Highcharts JS concepts (axes, series, styling, accessibility), use the \`highcharts-js\` skill.
- For Stock, Maps, or Morningstar, use the \`highcharts-stock\`, \`highcharts-maps\`, or \`highcharts-morningstar\` skill.
- For Dashboards or Grid, consult \`docs/<area>/\` directly or the live docs.
- For exact option signatures, inspect local TypeScript declarations or the API reference.

## References

- Live docs: https://www.highcharts.com/docs/gantt/
- API reference: https://api.highcharts.com/gantt/
`
    },
    {
        name: 'highcharts-morningstar',
        docs: {
            include: ['morningstar/'],
            exclude: []
        },
        destinations: [
            { path: path.join(repoRoot, '.agents', 'skills', 'highcharts-morningstar') },
            { path: path.join(repoRoot, '.claude', 'skills', 'highcharts-morningstar') },
            {
                path: path.resolve(repoRoot, '..', 'highcharts-dist', '.claude', 'skills', 'highcharts-morningstar'),
                requireParent: path.resolve(repoRoot, '..', 'highcharts-dist', 'package.json')
            }
        ],
        skillMd: `---
name: highcharts-morningstar
description: Use to implement and configure Highcharts Morningstar connectors (standard and DWS variants) from the bundled docs.
---

# Highcharts Morningstar Connectors

Use this for Morningstar connector work: time series (price, OHLCV, growth, returns, dividends, ratings), screeners, risk score, goal analysis, x-ray, security compare, and regulatory news. Covers both standard and DWS connector variants — start with \`references/docs/morningstar/morningstar.md\` to pick the right one.

## Workflow

1. Start with \`references/docs/index.md\` for a topic map, then read relevant docs.
2. Read \`morningstar/morningstar.md\` first to understand standard vs DWS connector variants.
3. Follow the connector constructor → load → table-mapping pattern shown in the docs.

## Boundaries

- For core Highcharts JS concepts (axes, series, styling, accessibility), use the \`highcharts-js\` skill.
- For Highcharts Stock chart types (candlestick, OHLC, navigator, indicators), use the \`highcharts-stock\` skill.
- For Maps or Gantt, use the \`highcharts-maps\` or \`highcharts-gantt\` skill.
- For exact option signatures, inspect local TypeScript declarations or the API reference.

## References

- Live docs: https://www.highcharts.com/docs/morningstar/
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
        '  --yes, -y           Required: confirms overwrite of generated skill directories',
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
    fs.writeFileSync(path.join(skillRoot, 'SKILL.md'), skill.skillMd);

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
        assert.equal(
            fs.readFileSync(path.join(outputRoot, 'test-skill', 'SKILL.md'), 'utf8'),
            '---\nname: test-skill\ndescription: Test skill for self-test.\n---\n\n# Test skill\n'
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

        for (const skill of SKILLS) {
            assert.match(
                skill.skillMd,
                /^---\nname: .+\ndescription: .+\n---/u,
                `${skill.name}: skillMd must have name and description frontmatter`
            );
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
