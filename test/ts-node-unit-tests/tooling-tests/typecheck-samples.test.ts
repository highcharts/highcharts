import { deepStrictEqual, rejects } from 'node:assert';
import { test } from 'node:test';
import {
    copyFileSync, mkdirSync, mkdtempSync, readdirSync, writeFileSync
} from 'node:fs';
import { rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { typecheckSamples } from '../../../tools/gulptasks/typecheck-samples.js';

const products = ['highcharts', 'stock', 'maps', 'gantt'];

async function withFixture(
    run: (root: string) => Promise<void>,
    options: { declarations?: boolean } = {}
): Promise<void> {
    const root = mkdtempSync(join(tmpdir(), 'typecheck-samples-'));
    const previousDirectory = process.cwd();

    try {
        mkdirSync(join(root, 'samples'), { recursive: true });
        mkdirSync(join(root, 'code'), { recursive: true });

        if (options.declarations !== false) {
            writeFileSync(join(root, 'code/highcharts.d.ts'), `
                export = Highcharts;
                export as namespace Highcharts;
                declare namespace Highcharts {
                    interface ChartOptions {
                        value: number;
                    }
                    function chart(
                        container: string,
                        options: ChartOptions
                    ): void;
                }
            `);
        }

        writeFileSync(join(root, 'samples/tsglobal.d.ts'),
            "import '../code/highcharts';\n");
        copyFileSync(join(__dirname, '../../../samples/tsconfig.json'),
            join(root, 'samples/tsconfig.json'));

        for (const product of products) {
            const directory = join(root, 'samples', product, 'demo');
            mkdirSync(directory, { recursive: true });
            copyFileSync(
                join(__dirname, `../../../samples/tsconfig.${product}.json`),
                join(root, `samples/tsconfig.${product}.json`)
            );
            writeFileSync(join(root, 'samples', product, `${product}.d.ts`),
                `declare const ${product}Sample: '${product}';\n`);
            writeFileSync(join(directory, 'demo.ts'), `
                declare namespace Highcharts {
                    interface ChartOptions {
                        custom?: string;
                    }
                }
                const product: typeof ${product}Sample = '${product}';
                Highcharts.chart('container', { value: 1, custom: 'works' });
            `);
        }

        process.chdir(root);
        await run(root);
    } finally {
        process.chdir(previousDirectory);
        // The native compiler may briefly retain its working directory on Windows.
        await rm(root, { recursive: true, force: true, maxRetries: 10 });
    }
}

function findEmittedFiles(directory: string): string[] {
    return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
        const file = join(directory, entry.name);
        if (entry.isDirectory()) {
            return findEmittedFiles(file);
        }
        return /\.(?:js|js\.map|tsbuildinfo)$/i.test(entry.name) ? [file] : [];
    });
}

test('uses the product configs and declarations for all four products', async () => {
    await withFixture(async () => {
        for (const product of products) {
            await typecheckSamples({ path: `samples/${product}/demo/demo.ts` });
        }
    });
});

test('isolates globals between demos and emits no files', async () => {
    await withFixture(async root => {
        for (const sample of ['first', 'second']) {
            const directory = join(root, 'samples/highcharts', sample);
            mkdirSync(directory, { recursive: true });
            writeFileSync(join(directory, 'demo.ts'), `
                declare namespace Highcharts {
                    interface ChartOptions {
                        custom?: string;
                    }
                }
                const duplicate = 1;
                Highcharts.chart('container', {
                    value: duplicate,
                    custom: 'works'
                });
            `);
        }

        await typecheckSamples();
        deepStrictEqual(findEmittedFiles(root), []);
    });
});

test('throws for a real demo type error', async () => {
    await withFixture(async root => {
        writeFileSync(join(root, 'samples/maps/demo/demo.ts'), `
            declare namespace Highcharts {
                interface ChartOptions {
                    custom?: string;
                }
            }
            Highcharts.chart('container', {
                value: 'not a number',
                custom: 'works'
            });
        `);

        await rejects(() => typecheckSamples(), /Sample typechecking failed/);
    });
});

test('does not leak namespace augmentations between demos', async () => {
    await withFixture(async root => {
        const directory = join(root, 'samples/highcharts/leak');
        mkdirSync(directory, { recursive: true });
        writeFileSync(join(directory, 'demo.ts'), `
            Highcharts.chart('container', { value: 1, custom: 'leaked' });
        `);

        await rejects(() => typecheckSamples(), /Sample typechecking failed/);
    });
});

test('--path skips an unrelated failing demo', async () => {
    await withFixture(async root => {
        const failingDemo = join(root, 'samples/highcharts/unrelated/demo.ts');
        mkdirSync(join(root, 'samples/highcharts/unrelated'), { recursive: true });
        writeFileSync(failingDemo, `
            declare namespace Highcharts {
                interface ChartOptions {
                    custom?: string;
                }
            }
            Highcharts.chart('container', {
                value: 'not a number',
                custom: 'works'
            });
        `);

        await typecheckSamples({ path: 'samples/highcharts/demo/demo.ts' });
    });
});

test('--path preserves brace globs', async () => {
    await withFixture(async () => {
        await typecheckSamples({
            path: 'samples/{highcharts,stock}/demo/demo.ts'
        });
    });
});

test('repeated --path selections include failures in every selected product', async () => {
    await withFixture(async root => {
        writeFileSync(join(root, 'samples/stock/demo/demo.ts'),
            "Highcharts.chart('container', { value: 'not a number' });");

        await rejects(() => typecheckSamples({
            path: [
                'samples/maps/demo/demo.ts',
                'samples/{highcharts,stock}/demo/demo.ts'
            ]
        }), /Sample typechecking failed/);
    });
});

test('fails when no demo.ts matches --path', async () => {
    await withFixture(async () => {
        await rejects(() => typecheckSamples({ path: 'samples/missing/**/demo.ts' }),
            /No demo\.ts samples matched/);
    });
});

test('fails when generated declarations are missing', async () => {
    await withFixture(async () => {
        await rejects(() => typecheckSamples(), /Build declarations first/);
    }, { declarations: false });
});

test('fails for a malformed product config', async () => {
    await withFixture(async root => {
        writeFileSync(join(root, 'samples/tsconfig.maps.json'), '{');

        await rejects(() => typecheckSamples(), /Sample typechecking failed/);
    });
});

test('fails for a demo syntax error', async () => {
    await withFixture(async root => {
        writeFileSync(join(root, 'samples/maps/demo/demo.ts'), 'const = ;');

        await rejects(() => typecheckSamples(), /Sample typechecking failed/);
    });
});
