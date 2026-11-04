import { describe, it } from 'node:test';
import { deepStrictEqual, ok, strictEqual, throws } from 'node:assert';
import { createRequire } from 'node:module';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const require = createRequire(import.meta.url);
const {
    collectDemosForConfig,
    createDemoIndexContent,
    escapeHTML,
    normalizeCategory,
    parseDemoDetails,
    renderDemoIndexContent
} = require('../gulptasks/lib/demoIndex.js');

async function writeDemo(root, slug, details) {
    const demoDir = join(root, slug);

    await mkdir(demoDir, { recursive: true });
    await writeFile(join(demoDir, 'demo.details'), details);
}

describe('demoIndex metadata parsing', () => {
    it('parses demo.details YAML frontmatter markers', () => {
        const details = parseDemoDetails(`---
name: Line chart
tags:
  - Highcharts demo
categories:
  - Line charts:
      priority: 1
...
`);

        strictEqual(details.name, 'Line chart');
        deepStrictEqual(details.tags, ['Highcharts demo']);
        deepStrictEqual(details.categories, [{
            'Line charts': {
                priority: 1
            }
        }]);
    });

    it('throws on malformed metadata', () => {
        throws(() => parseDemoDetails(`---
name: [
...
`));
    });

    it('normalizes string categories with default priority', () => {
        deepStrictEqual(normalizeCategory('General'), {
            name: 'General',
            priority: 99
        });
    });

    it('normalizes object categories with explicit priority', () => {
        deepStrictEqual(normalizeCategory({
            'Line charts': {
                priority: 1
            }
        }), {
            name: 'Line charts',
            priority: 1
        });
    });
});

describe('demoIndex demo collection', () => {
    it('groups demos by configured category and product tag', async () => {
        const root = await mkdtemp(join(tmpdir(), 'hc-demo-index-'));

        try {
            await writeDemo(root, 'beta-chart', `---
name: Beta
tags:
  - Highcharts demo
categories:
  - Line charts:
      priority: 1
...
`);
            await writeDemo(root, 'alpha-chart', `---
name: Alpha
tags:
  - Highcharts demo
categories:
  - Line charts:
      priority: 1
...
`);
            await writeDemo(root, 'gamma-chart', `---
name: Gamma
tags:
  - Highcharts demo
categories:
  - Line charts
...
`);
            await writeDemo(root, 'stock-only', `---
name: Stock only
tags:
  - Highcharts Stock demo
categories:
  - Line charts
...
`);
            await writeDemo(root, 'incomplete', `---
name: Incomplete
authors:
  - Example Author
js_wrap: b
...
`);
            await mkdir(join(root, 'missing-details'), { recursive: true });

            const grouped = collectDemosForConfig(root, {
                categories: ['Line charts'],
                filter: {
                    tags: ['Highcharts demo']
                }
            });

            deepStrictEqual(grouped.map(group => group.category), ['Line charts']);
            deepStrictEqual(grouped[0].demos.map(demo => demo.slug), [
                'alpha-chart',
                'beta-chart',
                'gamma-chart'
            ]);
        } finally {
            await rm(root, { recursive: true, force: true });
        }
    });

    it('ignores demo categories that are not configured for the product', async () => {
        const root = await mkdtemp(join(tmpdir(), 'hc-demo-index-'));

        try {
            await writeDemo(root, 'mixed-categories', `---
name: Mixed categories
tags:
  - Highcharts demo
categories:
  - General
  - Line charts:
      priority: 1
...
`);

            const grouped = collectDemosForConfig(root, {
                categories: ['Line charts'],
                filter: {
                    tags: ['Highcharts demo']
                }
            });

            deepStrictEqual(grouped, [{
                category: 'Line charts',
                demos: [{
                    name: 'Mixed categories',
                    slug: 'mixed-categories',
                    priority: 1
                }]
            }]);
        } finally {
            await rm(root, { recursive: true, force: true });
        }
    });

    it('includes the demo.details path in parse errors', async () => {
        const root = await mkdtemp(join(tmpdir(), 'hc-demo-index-'));

        try {
            await writeDemo(root, 'broken-demo', `---
name: [
...
`);

            throws(
                () => collectDemosForConfig(root, {
                    categories: ['Line charts'],
                    filter: {
                        tags: ['Highcharts demo']
                    }
                }),
                error => /broken-demo[\\/]demo\.details/u.test(error.message)
            );
        } finally {
            await rm(root, { recursive: true, force: true });
        }
    });
});

describe('demoIndex HTML rendering', () => {
    it('renders static category headings and package-local links', () => {
        const html = renderDemoIndexContent([
            {
                category: 'A & B',
                demos: [
                    {
                        name: '<Unsafe>',
                        slug: 'unsafe',
                        priority: 99
                    }
                ]
            }
        ]);

        ok(html.includes('<h2 class="sidebar-category">A &amp; B</h2>'));
        ok(html.includes('href="examples/unsafe/index.html"'));
        ok(html.includes('&lt;Unsafe&gt;'));
        strictEqual(html.includes('<button'), false);
    });

    it('escapes HTML in demo names', () => {
        strictEqual(escapeHTML('A & <B> "demo"'), 'A &amp; &lt;B&gt; &quot;demo&quot;');
    });
});

describe('demoIndex product-level API', () => {
    it('creates index HTML from source path and demo config', async () => {
        const root = await mkdtemp(join(tmpdir(), 'hc-demo-index-root-'));

        try {
            const sourcePath = join(root, 'samples', 'highcharts', 'demo');
            const configPath = join(root, 'samples', 'demo-config.js');

            await mkdir(join(root, 'samples'), { recursive: true });
            await writeDemo(sourcePath, 'line-chart', `---
name: Line chart
tags:
  - Highcharts demo
categories:
  - Line charts:
      priority: 1
...
`);
            await writeFile(configPath, `module.exports = {
    Highcharts: {
        categories: ['Line charts'],
        filter: { tags: ['Highcharts demo'] },
        path: '/'
    }
};`);

            const html = createDemoIndexContent({
                productPath: 'highcharts',
                sourcePath,
                demoConfigPath: configPath
            });

            ok(html.includes('href="examples/line-chart/index.html"'));
            ok(html.includes('Line charts'));
        } finally {
            await rm(root, { recursive: true, force: true });
        }
    });
});
