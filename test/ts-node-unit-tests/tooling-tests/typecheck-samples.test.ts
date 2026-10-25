import { deepStrictEqual, throws } from 'node:assert';
import { test } from 'node:test';
import {
    copyFileSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
    resolveTsgoBinary,
    resolveTypeScript,
    typecheckSamples
} from '../../../tools/gulptasks/typecheck-samples.js';

const products = ['highcharts', 'stock', 'maps', 'gantt'];

function withFixture(
    run: (root: string) => void,
    options: { declarations?: boolean } = {}
): void {
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
        run(root);
    } finally {
        process.chdir(previousDirectory);
        rmSync(root, { recursive: true, force: true });
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

test('resolves a tsgo binary from the configured environment override', () => {
    const root = mkdtempSync(join(tmpdir(), 'typecheck-samples-tsgo-'));
    const previous = process.env.HIGHCHARTS_TYPECHECK_TSGO;
    const binaryPath = join(root, 'tsgo-stub');

    try {
        writeFileSync(binaryPath, '#!/bin/sh\nexit 0\n');
        process.env.HIGHCHARTS_TYPECHECK_TSGO = binaryPath;
        deepStrictEqual(resolveTsgoBinary(), {
            name: 'tsgo',
            binary: process.execPath,
            args: [binaryPath]
        });
    } finally {
        if (previous === undefined) {
            delete process.env.HIGHCHARTS_TYPECHECK_TSGO;
        } else {
            process.env.HIGHCHARTS_TYPECHECK_TSGO = previous;
        }
        rmSync(root, { recursive: true, force: true });
    }
});

test('uses the standard TypeScript API for config parsing when tsgo is not available', () => {
    const actual = require('typescript');
    const previous = process.env.HIGHCHARTS_TYPECHECK_TSGO;

    try {
        delete process.env.HIGHCHARTS_TYPECHECK_TSGO;
        deepStrictEqual(resolveTypeScript(), actual);
    } finally {
        if (previous === undefined) {
            delete process.env.HIGHCHARTS_TYPECHECK_TSGO;
        } else {
            process.env.HIGHCHARTS_TYPECHECK_TSGO = previous;
        }
    }
});

test('uses the product configs and declarations for all four products', () => {
    withFixture(() => {
        for (const product of products) {
            typecheckSamples({ path: `samples/${product}/demo/demo.ts` });
        }
    });
});

test('uses inherited compilerOptions from extended tsconfig files without converting lib names', () => {
    withFixture(root => {
        const directory = join(root, 'samples/highcharts/demo/nested');
        mkdirSync(directory, { recursive: true });
        writeFileSync(join(directory, 'tsconfig.json'), JSON.stringify({
            extends: '../../../tsconfig.json',
            files: ['../../../tsglobal.d.ts', 'demo.ts']
        }, null, 2));
        writeFileSync(join(directory, 'demo.ts'), `
            declare namespace Highcharts {
                interface ChartOptions {
                    custom?: string;
                }
            }
            Highcharts.chart('container', { value: 1, custom: 'works' });
        `);

        typecheckSamples({ path: 'samples/highcharts/demo/nested/demo.ts' });
    });
});

test('isolates globals between demos and emits no files', () => {
    withFixture(root => {
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

        typecheckSamples();
        deepStrictEqual(findEmittedFiles(root), []);
    });
});

test('supports compiling multiple demos together in batch mode', () => {
    withFixture(root => {
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

        throws(
            () => typecheckSamples({ serial: true, path: 'samples/highcharts/*/demo.ts' }),
            /Sample typechecking failed/
        );
    });
});

test('throws for a real demo type error', () => {
    withFixture(root => {
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

        throws(() => typecheckSamples(), /Sample typechecking failed/);
    });
});

test('does not leak namespace augmentations between demos', () => {
    withFixture(root => {
        const directory = join(root, 'samples/highcharts/leak');
        mkdirSync(directory, { recursive: true });
        writeFileSync(join(directory, 'demo.ts'), `
            Highcharts.chart('container', { value: 1, custom: 'leaked' });
        `);

        throws(() => typecheckSamples(), /Sample typechecking failed/);
    });
});

test('--path skips an unrelated failing demo', () => {
    withFixture(root => {
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

        typecheckSamples({ path: 'samples/highcharts/demo/demo.ts' });
    });
});

test('--path preserves brace globs', () => {
    withFixture(() => {
        typecheckSamples({
            path: 'samples/{highcharts,stock}/demo/demo.ts'
        });
    });
});

test('repeated --path selections include failures in every selected product', () => {
    withFixture(root => {
        writeFileSync(join(root, 'samples/stock/demo/demo.ts'),
            "Highcharts.chart('container', { value: 'not a number' });");

        throws(() => typecheckSamples({
            path: [
                'samples/maps/demo/demo.ts',
                'samples/{highcharts,stock}/demo/demo.ts'
            ]
        }), /Sample typechecking failed/);
    });
});

test('fails when no demo.ts matches --path', () => {
    withFixture(() => {
        throws(() => typecheckSamples({ path: 'samples/missing/**/demo.ts' }),
            /No demo\.ts samples matched/);
    });
});

test('fails when generated declarations are missing', () => {
    withFixture(() => {
        throws(() => typecheckSamples(), /Build declarations first/);
    }, { declarations: false });
});
