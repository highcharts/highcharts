/**
 * Sample Generator
 *
 * Generates a Highcharts sample based on specified option paths,
 * creating HTML controls to manipulate those options at runtime.
 *
 * Usage:
 * - Define desired option paths in the `paths` array.
 * - `node tools/sample-generator/index.ts`
 */

import type { SampleGeneratorConfig } from './config.ts';

import colors from 'colors/safe.js';
import { promises as fs } from 'fs';
import { loadExportedTypes } from './load-types.ts';
import { exec } from 'child_process';
import config from './config.ts';

// Import Highcharts and modules so that we can read default options
import Highcharts from '../../code/esm/highcharts.src.js';
import '../../code/esm/highcharts-more.src.js';
import '../../code/esm/highcharts-3d.src.js';
import '../../code/esm/modules/stock.src.js';
import '../../code/esm/modules/map.src.js';
import '../../code/esm/modules/gantt.src.js';

// Type handlers
import * as booleanHandler from './type-handlers/boolean.ts';
import * as numberHandler from './type-handlers/number.ts';
import * as selectHandler from './type-handlers/select.ts';
import * as colorHandler from './type-handlers/color.ts';

const types = await loadExportedTypes('code/highcharts.d.ts');

interface MetaData {
    path: string;
    node: any;
    mainType: string;
    options?: string[];
    defaultValue?: any;
    overrideValue?: any;
}

type MetaList = Array<MetaData>;

const defaultOptions = Highcharts.getOptions();

// --- Template helpers -------------------------------------------------------
async function loadTemplate(fileName: string) {
    // Templates live in ./tpl relative to this file
    const path = new URL(`./tpl/${fileName}`, import.meta.url);
    return await fs.readFile(path, 'utf-8');
}

// Get a nested value from an object given a dot-separated path.
function getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key): any => current?.[key], obj);
}

// Parse override values from path definitions
function parsePathOverride(
    pathDef: string
): { path: string; overrideValue?: any } {
    const equalIndex = pathDef.indexOf('=');
    if (equalIndex === -1) {
        return { path: pathDef };
    }

    const path = pathDef.substring(0, equalIndex);
    const valueStr = pathDef.substring(equalIndex + 1);

    // Parse the value based on common patterns
    let overrideValue: any = valueStr;

    // Boolean values
    if (valueStr === 'true') {
        overrideValue = true;
    } else if (valueStr === 'false') {
        overrideValue = false;

    // Number values (check if it's a valid number)
    } else if (!isNaN(Number(valueStr)) && valueStr.trim() !== '') {
        overrideValue = Number(valueStr);

    // Color values (hex colors starting with #)
    } else if (valueStr.startsWith('#')) {
        overrideValue = valueStr;

    // String values (keep as string)
    } else {
        overrideValue = valueStr;
    }

    return { path, overrideValue };
}

// Load the tree.json file
export async function loadTree() {
    const data = await fs.readFile(
        '../highcharts/build/api/highcharts/tree.json',
        'utf-8'
    );
    return JSON.parse(data);
}

// Find the node with the specified path
export async function findNodeByPath(path: string) {
    const tree = await loadTree();

    const keys = path.split('.');
    let currentNode = tree;

    const extendNode = async (node: any) => {
        if (node.doclet.extends) {
            const parentNode = await findNodeByPath(node.doclet.extends);
            if (parentNode) {
                node.children = { ...parentNode.children, ...node.children };
            }
        }
        return node;
    };

    for (const key of keys) {
        const childNode = (currentNode)[key] || currentNode.children[key];
        if (childNode) {
            currentNode = await extendNode(childNode);
        } else {
            return null;
        }
    }

    return currentNode;
}

// Function to generate sophisticated titles based on path analysis
function generateTitle(paths: string[]): string {
    if (paths.length === 0) {
        return 'Demo of various chart options';
    }

    if (paths.length === 1) {
        return `Demo of <em>${paths[0].split('=')[0]}</em>`;
    }

    // Find common prefix parts
    const pathParts = paths.map(path => path.split('.'));
    const minLength = Math.min(...pathParts.map(parts => parts.length));

    const commonParts: string[] = [];
    for (let i = 0; i < minLength; i++) {
        const part = pathParts[0][i];
        if (pathParts.every(parts => parts[i] === part)) {
            commonParts.push(part);
        } else {
            break;
        }
    }

    if (commonParts.length > 0) {
        return `Demo of <em>${commonParts.join('.')}</em> options`;
    }

    return 'Demo of various chart options';
}

// Function to extend an object with a nested path
function extendObject(base: any, path: string, nodeValue: any) {
    // Merge the path node options into the chart configuration
    const keys = path.split('.');
    let current = base;

    keys.forEach((key, i) => {
        let value: any = {};
        if (i === keys.length - 1) {
            value = nodeValue;
        }
        /* eslint-disable-next-line eqeqeq */
        if (current[key] == null) {
            current[key] = value;
        }
        current = current[key];
    });
    return base;
}

// Generate the chart configuration with the specified paths
function generateChartConfig(metaList: MetaList) {
    const paths = metaList.map(meta => meta.path);
    if (!metaList.length) {
        throw new Error(`No nodes found for paths: ${paths.join(', ')}`);
    }

    const chartOptions: any = {
        title: { text: generateTitle(paths) },
        series: [
            {
                type: 'column',
                data: [1, 3, 2, 4],
                colorByPoint: true
            }
        ]
    };

    for (const { defaultValue, path, overrideValue } of metaList) {
        // Use override value if provided, otherwise use default from tree
        const value = overrideValue !== void 0 ?
            overrideValue :
            defaultValue;

        extendObject(chartOptions, path, value);
    }

    return chartOptions;
}

// Helper to compute mainType
function getMainType(node: any) {
    return node.doclet.type.names[0].replace('Highcharts.', '');
}

// Build a list of metadata for each path
async function getPathMeta(inPaths: string[]) {
    const list: MetaList = [];
    for (const pathDef of inPaths) {
        const { path, overrideValue } = parsePathOverride(pathDef);
        const node = await findNodeByPath(path);
        if (!node) {
            console.error(colors.red(`No node found for path: ${path}`));
            continue;
        }

        const mainType = getMainType(node);
        let options: string[] | undefined;
        if (node.doclet.values) {
            options = JSON.parse(node.doclet.values);
        } else if (
            types[mainType] &&
            Array.isArray(types[mainType]) &&
            types[mainType].length < 4
        ) {
            options = types[mainType];
        }

        const defaultFromDocs = node.doclet.defaultValue ?? node.meta.default,
            defaultFromCode = getNestedValue(defaultOptions, path),
            // If the two defaults are the same, we skip setting it explicitly
            // because the Controls will pick it up from Highcharts defaults
            defaultValue = (
                defaultFromCode === defaultFromDocs &&
                // Except for ColorString, where CSS variables complicate things
                mainType !== 'ColorString'
            ) ?
                void 0 :
                defaultFromDocs;

        if (overrideValue !== void 0) {
            console.log(colors.green(
                `Using override for ${path}: ${overrideValue}`
            ));
        } else if (defaultFromCode !== void 0) {
            console.log(colors.green(
                `Found default from code for ${path}: ${defaultFromCode}`
            ));
        } else if (defaultFromDocs !== void 0) {
            console.log(colors.green(
                `Found default from docs for ${path}: ${defaultFromDocs}`
            ));
        } else {
            console.warn(colors.yellow(`No default value for path: ${path}`));
        }

        list.push({
            path,
            node,
            mainType,
            options,
            defaultValue,
            overrideValue
        });
    }
    return list;
}

// Select handler for a given meta
function pickHandler(meta: { mainType: string; options?: string[] }) {
    if (meta.mainType.toLowerCase() === 'boolean') {
        return { kind: 'boolean', mod: booleanHandler } as const;
    }
    if (meta.mainType.toLowerCase() === 'number') {
        return { kind: 'number', mod: numberHandler } as const;
    }
    if (
        meta.mainType.toLowerCase() === 'colorstring' ||
    meta.mainType.toLowerCase() === 'colortype'
    ) {
        return { kind: 'color', mod: colorHandler } as const;
    }
    if (meta.mainType.toLowerCase() === 'axistypevalue') {
        meta.options = ['linear', 'logarithmic', 'datetime', 'category'];
    }
    if (meta.options) {
        return { kind: 'select', mod: selectHandler } as const;
    }
    return null;
}

// Function to get HTML (one row per path) from template
export async function getDemoHTML(metaList?: MetaList) {
    let html = await loadTemplate('demo.html');

    // Collect unique handler types and generate functions once
    const handlerTypes = new Set<string>();
    const controls: string[] = [];

    for (const meta of metaList) {
        const handler = pickHandler(meta);
        if (!handler) {
            console.error(
                colors.red(
                    `No handler for type: ${meta.mainType} (path: ${meta.path})`
                )
            );
            continue;
        }

        // Add function if not already added
        if (!handlerTypes.has(handler.kind)) {
            handlerTypes.add(handler.kind);
        }

        // Add call for this specific path
        controls.push(handler.mod.getHTML(
            meta.path,
            meta.overrideValue ?? meta.defaultValue,
            meta.options
        ));
    }

    /*
    const header = generateTitle(paths)
        .replace('Demo of ', '')
        .replace('<em>', '')
        .replace('</em>', '');
    */

    // Add the config
    if (controls.length > 0) {
        html = html.replace(
            '<!-- CONTROLS_PLACEHOLDER -->',
            `<highcharts-controls>
    <highcharts-group header="Update options">
      ${controls.join('\n      ')}
    </highcharts-group>
  </highcharts-controls>`
        );
    }
    return html;
}

// Function to get TS (one listener per path)
export async function getDemoTS(metaList: MetaList) {
    const ts = `Highcharts.chart('container', ${JSON.stringify(
        await generateChartConfig(metaList),
        null,
        2
    )});\n` // Some cases, for example tooltip.borderWidth, have defaultValue as
    // "undefined" in tree.json
        .replace(/"undefined"/gu, 'undefined');

    return ts;
}

// Function to get CSS from template
export async function getDemoCSS() {
    const css = await loadTemplate('demo.css');
    return css;
}

export async function getDemoDetails(config: SampleGeneratorConfig) {
    let details = await loadTemplate('demo.details');

    details = details
        .replace('Highcharts Demo', generateTitle(config.paths))
        .replace('<em>', '')
        .replace('</em>', '');

    return details;
}

// Function to save the generated configuration to Highcharts Samples
export async function saveDemoFile(config: SampleGeneratorConfig) {
    const metaList = await getPathMeta(config.paths);
    if (!metaList.length) {
        throw new Error(`No nodes found for paths: ${config.paths.join(', ')}`);
    }

    // Build all assets in parallel based on per-path mainTypes
    const [html, css, ts, details] = await Promise.all([
        getDemoHTML(metaList),
        getDemoCSS(),
        getDemoTS(metaList),
        getDemoDetails(config)
    ]);

    await fs.mkdir(
        '../highcharts/samples/highcharts/studies/sample-gen',
        { recursive: true }
    );

    // Write all files in parallel
    await Promise.all([
        fs.writeFile(
            '../highcharts/samples/highcharts/studies/sample-gen/demo.html',
            html
        ),
        fs.writeFile(
            '../highcharts/samples/highcharts/studies/sample-gen/demo.css',
            css
        ),
        fs.writeFile(
            '../highcharts/samples/highcharts/studies/sample-gen/demo.ts',
            ts
        ),
        fs.writeFile(
            '../highcharts/samples/highcharts/studies/sample-gen/demo.details',
            details
        )
    ]);

    // Format the generated demo.ts file with ESLint
    console.log(colors.blue('Formatting demo.ts with ESLint...'));
    await new Promise((resolve, reject) => {
        exec(
            [
                'npx',
                'eslint',
                '--fix',
                '../highcharts/samples/highcharts/studies/sample-gen/demo.ts'
            ].join(' '),
            (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error formatting demo.ts: ${error.message}`);
                    reject(error);
                    return;
                }
                if (stderr) {
                    console.error(`ESLint stderr: ${stderr}`);
                }
                if (stdout) {
                    console.log(`ESLint stdout: ${stdout}`);
                }
                resolve(null);
            }
        );
    });
    console.log(colors.green('Demo files generated successfully.'));
}

// Run the sample generator with the specified config, but only when this
// file is executed directly (not imported as a module)
if (
    import.meta.url === process.argv[1] ||
    import.meta.url === `file://${process.argv[1]}`
) {
    await saveDemoFile(config);
}
