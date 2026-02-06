/**
 * Sample Generator Setup
 *
 * Loads types and defaults and writes to file
 *
 * Usage:
 * - `gulp scripts && gulp jsdoc-dts && node tools/sample-generator/setup.ts`
 */

/* eslint-disable guard-for-in, no-console, no-underscore-dangle */

import type {
    FlatTreeNode
} from './generator-config.d.ts';

import { promises as fs } from 'fs';
import { loadExportedTypes } from './load-types.ts';
import { join } from 'path';
import colors from 'colors/safe.js';

// Import Highcharts and modules so that we can read default options. If this
// import fails, run `gulp scripts` first.
import Highcharts from '../../code/esm/highcharts.src.js';
import '../../code/esm/highcharts-more.src.js';
import '../../code/esm/highcharts-3d.src.js';
import '../../code/esm/modules/stock.src.js';
import '../../code/esm/modules/map.src.js';
import '../../code/esm/modules/gantt.src.js';

// Get the directory of this file, so that we can write the output files there.
const dirname = new URL('.', import.meta.url).pathname;

const types = await loadExportedTypes('code/highcharts.d.ts')
    .catch(() => {
        console.error(colors.red(
            'Failed to load exported types from code/highcharts.d.ts. ' +
            'Run `gulp jsdoc-dts` first.'
        ));
    });

// Flatten the default options
function flattenOptions(obj: any, prefix = ''): Record<string, any> {
    let result: Record<string, any> = {};
    for (const key in obj) {
        const value = obj[key];
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (typeof value === 'object' && value !== null) {
            result = { ...result, ...flattenOptions(value, newKey) };
        } else {
            result[newKey] = value;
        }
    }
    return result;
}
// Real defaults from actual Highcharts options
const realDefaults = flattenOptions(Highcharts.getOptions());

const treeJson = await fs.readFile(
    join(dirname, '../../build/api/highcharts/tree.json'),
    'utf-8'
);

const tree = JSON.parse(treeJson);
const flat: FlatTreeNode[] = [];
function addChildren(node: any) {

    // Root node
    if (node._meta?.version) {
        Object.values(node).forEach(addChildren);

    //
    } else if (node.meta) {
        const name = node.meta.fullname;
        const extendsPath = node.doclet['extends'];

        let mainType = node.doclet.type?.names[0].replace('Highcharts.', '');

        if (node.children && Object.keys(node.children).length) {
            Object.values(node.children).forEach(addChildren);

            if (!extendsPath) {
                return;
            }
        }

        if (mainType === '*') {
            mainType = void 0;
            if (!extendsPath) {
                return;
            }
        }

        let options: string[] | undefined;
        if (node.doclet.values) {
            options = JSON.parse(node.doclet.values.replace(/'/gu, '"'));

        // Pick up TS types
        } else if (
            types[mainType] &&
            Array.isArray(types[mainType]) &&
            types[mainType].length < 4
        ) {
            options = types[mainType];

        // Pick up the @validvalue doclet
        } else if (node.doclet.type?.names.length > 1) {
            // Keep only string literals
            const opts = node.doclet.type?.names
                .filter((n: string) => n.startsWith('"') && n.endsWith('"'))
                .map((n: string) => n.slice(1, -1));
            if (opts.length) {
                options = opts;
            }
        }

        let defaultValue = realDefaults[name] ?? node.meta.default;
        if (defaultValue === 'undefined') {
            defaultValue = void 0;
        }

        const flatNode: FlatTreeNode = {
            name,
            mainType,
            options,
            default: defaultValue,
            extendsPath
        };

        // Just name, no useful info
        if (Object.values(flatNode).filter(v => v !== void 0).length === 1) {
            return;
        }

        flat.push(flatNode);
    }
}

addChildren(tree);
await fs.writeFile(
    join(dirname, 'flat-tree.json'),
    JSON.stringify(flat, null, 2),
    'utf-8'
);
console.log(colors.green(
    `Setup complete! Wrote ${flat.length} entries to flat-tree.json`
));
