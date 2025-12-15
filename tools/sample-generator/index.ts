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


import { promises as fs } from 'fs';
import { loadExportedTypes } from './load-types.ts';
import { exec } from 'child_process';

// Type handlers
import * as booleanHandler from './type-handlers/boolean.ts';
import * as numberHandler from './type-handlers/number.ts';
import * as arrayHandler from './type-handlers/array-of-strings.ts';
import * as colorHandler from './type-handlers/color.ts';

const types = await loadExportedTypes('code/highcharts.d.ts');

const paths = [
    'yAxis.opposite',
    'yAxis.lineWidth'
];
/*
const paths = [
  'plotOptions.column.borderColor=#333333',
  'plotOptions.column.borderWidth',
  'plotOptions.column.borderRadius'
];
// */

// --- Template helpers -------------------------------------------------------
async function loadTemplate(fileName: string) {
    // Templates live in ./tpl relative to this file
    const path = new URL(`./tpl/${fileName}`, import.meta.url);
    return await fs.readFile(path, 'utf-8');
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
function generateChartConfig(
    metaList: Array<{ path: string; node: any; overrideValue?: any }>
) {
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

    for (const { path, node, overrideValue } of metaList) {
        // Use override value if provided, otherwise use default from tree
        const value = overrideValue !== void 0 ?
            overrideValue :
            (node.doclet.defaultValue ?? node.meta.default);
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
    const list: Array<{
        path: string;
        node: any;
        mainType: string;
        options?: string[];
        defaultValue?: any;
        overrideValue?: any
    }> = [];
    for (const pathDef of inPaths) {
        const { path, overrideValue } = parsePathOverride(pathDef);
        const node = await findNodeByPath(path);
        if (!node) {
            continue;
        }
        const mainType = getMainType(node);
        let options: string[] | undefined;
        if (
            types[mainType] &&
            Array.isArray(types[mainType]) &&
            types[mainType].length < 4
        ) {
            options = types[mainType];
        }
        const defaultValue = node.doclet.defaultValue ?? node.meta.default;
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
        return { kind: 'array', mod: arrayHandler } as const;
    }
    return null;
}

// Function to get HTML (one row per path) from template
export async function getDemoHTML(
    metaList: Array<{
        path: string;
        mainType: string;
        options?: string[];
        defaultValue?: any;
        overrideValue?: any
    }>
) {
    const PLACEHOLDER = '<!--CONTROLS-->';
    let template = await loadTemplate('demo.html');

    let controlsHTML = '';
    for (const meta of metaList) {
        const handler = pickHandler(meta);
        if (!handler) {
            continue;
        }

        // Pass default value for array handlers (use override value if
        // available)
        if (handler.kind === 'array') {
            const valueToUse = meta.overrideValue !== void 0 ?
                meta.overrideValue :
                meta.defaultValue;
            controlsHTML += handler.mod.getHTML(
                meta.path,
                meta.options,
                valueToUse
            );
        } else {
            controlsHTML += handler.mod.getHTML(meta.path);
        }
    }

    // If the placeholder exists, replace it; otherwise append controls at the
    // end
    if (controlsHTML !== '') {
        controlsHTML = `<table>\n${controlsHTML}\n</table>\n`;
    }
    if (template.includes(PLACEHOLDER)) {
        template = template.replace(PLACEHOLDER, controlsHTML);
    } else {
        template += controlsHTML;
    }

    return template;
}

// Function to get TS (one listener per path)
export async function getDemoTS(metaList: Array<{
        path: string;
        mainType: string;
        options?: string[];
        defaultValue?: any;
        overrideValue?: any
    }>) {
    let ts = `Highcharts.chart('container', ${JSON.stringify(
        await generateChartConfig(metaList as any),
        null,
        2
    )});\n` // Some cases, for example tooltip.borderWidth, have defaultValue as
    // "undefined" in tree.json
        .replace(/"undefined"/gu, 'undefined');

    // Collect unique handler types and generate functions once
    const handlerTypes = new Set<string>();
    const handlerCalls: string[] = [];

    for (const meta of metaList) {
        const handler = pickHandler(meta);
        if (!handler) {
            continue;
        }

        // Add function if not already added
        if (!handlerTypes.has(handler.kind)) {
            handlerTypes.add(handler.kind);
            // ts += handler.mod.getTSFunction();
        }

        // Add call for this specific path
        handlerCalls.push(handler.mod.getTSCall(meta.path, meta.overrideValue));
    }

    // Add all the calls
    if (handlerCalls.length > 0) {
        ts += `
// GUI components for demo purpose
`;
        ts += handlerCalls.join('\n');
    }

    // Initialize the preview
    ts += `

DemoKit.updateOptionsPreview();
Highcharts.addEvent(
    Highcharts.Chart,
    'render',
    DemoKit.updateOptionsPreview
);`;

    return ts;
}

// Function to get CSS from template
export async function getDemoCSS(
    metaList: Array<{
        path: string;
        mainType: string;
        options?: string[];
        defaultValue?: any;
        overrideValue?: any
    }>
) {
    const PLACEHOLDER = '/* HANDLER_CSS */';
    let css = await loadTemplate('demo.css');

    // Collect unique handler types and generate CSS once per type
    const handlerTypes = new Set<string>();
    let handlersCSS = '';

    for (const meta of metaList) {
        const handler = pickHandler(meta);
        if (!handler) {
            continue;
        }

        // Add CSS if not already added for this handler type
        if (!handlerTypes.has(handler.kind)) {
            handlerTypes.add(handler.kind);
            handlersCSS += handler.mod.getCSS();
        }
    }

    // If the placeholder exists, replace it; otherwise append
    if (css.includes(PLACEHOLDER)) {
        css = css.replace(PLACEHOLDER, handlersCSS);
    } else {
        css += `\n${handlersCSS}`;
    }

    return css;
}

export async function getDemoDetails() {
    const details = await loadTemplate('demo.details');
    return details;
}

// Function to save the generated configuration to Highcharts Samples
export async function saveDemoFile() {
    const metaList = await getPathMeta(paths);
    if (!metaList.length) {
        throw new Error(`No nodes found for paths: ${paths.join(', ')}`);
    }

    // Build all assets in parallel based on per-path mainTypes
    const [html, css, ts, details] = await Promise.all([
        getDemoHTML(metaList),
        getDemoCSS(metaList),
        getDemoTS(metaList),
        getDemoDetails()
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
                console.log(`ESLint stdout: ${stdout}`);
                resolve(null);
            }
        );
    });
}

await saveDemoFile();
