import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const products = new Set(['highcharts', 'stock', 'maps', 'gantt']);
const require = createRequire(import.meta.url);
const { require: requireTS } = require('tsx/cjs/api');
const { selectVisualSamples: discoverEligibleVisualSamples } = requireTS(
    '../../tests/visual/visual-samples.ts',
    import.meta.url
);
const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

export function selectVisualSamples(
    requestedProducts,
    sampleIds = discoverEligibleVisualSamples(repositoryRoot)
        .map(sample => sample.id)
) {
    const requested = [...new Set(requestedProducts)];
    const unknown = requested.filter(product => !products.has(product));
    if (unknown.length) {
        throw new Error(`Unknown visual sample product: ${unknown.join(', ')}`);
    }

    return sampleIds.filter(id => requested.some(product =>
        id.startsWith(`${product}/`)
    ));
}

function parseProducts(args) {
    const values = [];
    for (let i = 0; i < args.length; ++i) {
        if (args[i] === '--products') {
            if (!args[++i]) {
                throw new Error('--products requires a value');
            }
            values.push(args[i]);
        } else if (args[i].startsWith('--')) {
            throw new Error(`Unknown option: ${args[i]}`);
        } else {
            values.push(args[i]);
        }
    }
    return values.flatMap(value => value.split(/[,;\n]/))
        .map(value => value.trim())
        .filter(Boolean);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    try {
        const requested = parseProducts(process.argv.slice(2));
        process.stdout.write(`${JSON.stringify(selectVisualSamples(requested))}\n`);
    } catch (error) {
        process.stderr.write(`${error.message}\n`);
        process.exitCode = 1;
    }
}
