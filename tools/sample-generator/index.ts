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

/* eslint-disable no-console */

import type { ControlOptions, SampleGeneratorConfig } from './config.ts';

import colors from 'colors/safe.js';
import { dirname, join } from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';

import { loadExportedTypes } from './load-types.ts';
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
import * as genericHandler from './type-handlers/generic.ts';
import * as numberHandler from './type-handlers/number.ts';
import * as selectHandler from './type-handlers/select.ts';
import * as colorHandler from './type-handlers/color.ts';
import * as textHandler from './type-handlers/text.ts';

const types = await loadExportedTypes('code/highcharts.d.ts')
    .catch(() => {
        console.error(colors.red(
            'Failed to load exported types from code/highcharts.d.ts. ' +
            'Run `gulp jsdoc-dts` first.'
        ));
    });

const executedDirectly = import.meta.url === process.argv[1] ||
    import.meta.url === `file://${process.argv[1]}`;

interface MetaData {
    controlOptions?: ControlOptions;
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

    const keys = path.split('.').map(key => key.replace(/\[(\d+)\]/gu, ''));
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

    const findCommonParts = (paths: string[]): string[] => {
        // Find common prefix parts
        const pathParts = paths.map(path => path.split('.'));
        const minLength = Math.min(...pathParts.map(parts => parts.length));

        const commonParts: string[] = [];
        for (let i = 0; i < minLength; i++) {
            const part = pathParts[0][i];
            if (pathParts.every(parts => parts[i] === part)) {
                // Remove array indices for title
                const cleanedPart = part.replace(/\[\d+\]/gu, '');
                commonParts.push(cleanedPart);
            } else {
                break;
            }
        }
        return commonParts;
    };


    if (paths.length === 0) {
        return 'Demo of various chart options';
    }

    if (paths.length === 1) {
        return `Demo of <em>${
            paths[0].split('=')[0].replace(/\[\d+\]/gu, '')
        }</em>`;
    }

    // Find common prefix parts
    const commonParts = findCommonParts(paths);
    if (commonParts.length > 0) {
        const joined = commonParts.join('.');
        if (paths.length === 2) {
            const rests = paths.map(p => p
                .replace(`${joined}`, '')
                .replace(/^[.[\d\]]+/u, ''));
            return `Demo of <em>${joined}.${rests[0]}</em> and <em>${
                rests[1]
            }</em>`.replace(/\[\d+\]/gu, '');
        }
        return `Demo of <em>${joined}</em> options`.replace(/\[\d+\]/gu, '');
    }

    // Look for related parts, like xAxis, yAxis
    const commonAxisParts = findCommonParts(
        paths.map(path => path.replace(/^(xAxis|yAxis)/u, 'axis'))
    );
    if (commonAxisParts.length > 0) {
        let commonPrefix = '';
        if (commonAxisParts.length > 1) {
            commonPrefix = commonAxisParts.shift() + ' ';
        }
        return `Demo of ${commonPrefix}<em>${
            commonAxisParts.join('.')
        }</em> options`;
    }

    return 'Demo of various chart options';
}

// Function to extend an object with a nested path
function extendObject(base: any, path: string, nodeValue: any) {
    // Merge the path node options into the chart configuration. Support dot
    // notation and bracket notation for arrays.
    const keys = path.split(/\.|\[|\]/u).filter(key => key !== '');
    let current = base;

    keys.forEach((key, i) => {
        let value: any = {};
        if (i === keys.length - 1) {
            value = nodeValue;
        }

        // If the next key is a number, create an array
        const nextKey = keys[i + 1];
        if (
            nextKey &&
            !isNaN(Number(nextKey)) &&
            !Array.isArray(current[key])
        ) {
            current[key] = [];
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
async function generateChartConfig(
    config: SampleGeneratorConfig,
    metaList: MetaList
) {
    const { chartOptionsExtra } = config;
    const paths = metaList.map(meta => meta.path);
    if (!metaList.length && paths) {
        throw new Error(`No nodes found for paths: ${paths.join(', ')}`);
    }

    const chartOptions: any = {};
    for (const optionsTpl of config.templates || ['column', 'categories-4']) {
        const tplModule = await import(`./tpl/chart-options/${optionsTpl}.ts`);
        const tplOptions = tplModule.default;
        Highcharts.merge(true, chartOptions, tplOptions);
    }

    const titlePaths = metaList
        .filter(meta => meta.controlOptions?.inTitle !== false)
        .map(meta => meta.path);
    Highcharts.merge(true, chartOptions, {
        title: { text: generateTitle(titlePaths) }
    });

    if (chartOptionsExtra) {
        Highcharts.merge(true, chartOptions, chartOptionsExtra);
    }

    if (config.dataFile) {
        Highcharts.merge(true, chartOptions, {
            series: [{ data: 'data' }]
        });
    }

    for (const { defaultValue, path, overrideValue } of metaList) {
        // Use override value if provided, otherwise use default from tree
        const value = overrideValue !== void 0 ?
            overrideValue :
            defaultValue;

        extendObject(chartOptions, path, value);
    }

    // Order the keys recursively for consistent output. For the top-level,
    // we want 'chart', 'title', 'xAxis', 'yAxis', etc. first. After that,
    // alphabetical order. For nested objects, always alphabetical order.
    function orderKeys(obj: any): any {
        if (Array.isArray(obj)) {
            return obj.map(orderKeys);
        }

        if (obj !== null && typeof obj === 'object') {
            const ordered: any = {};
            const keys = Object.keys(obj);

            // Top-level specific order
            const topLevelOrder = [
                'chart', 'title', 'subtitle', 'xAxis', 'yAxis'
            ];

            keys.sort((a, b) => {
                const aIndex = topLevelOrder.indexOf(a);
                const bIndex = topLevelOrder.indexOf(b);
                if (aIndex !== -1 && bIndex !== -1) {
                    return aIndex - bIndex;
                }
                if (aIndex !== -1) {
                    return -1; // a comes first
                }
                if (bIndex !== -1) {
                    return 1; // b comes first
                }
                return a.localeCompare(b); // Alphabetical order
            });

            for (const key of keys) {
                ordered[key] = orderKeys(obj[key]);
            }
            return ordered;
        }
        return obj;
    }

    const orderedChartOptions = orderKeys(chartOptions);

    return orderedChartOptions;
}

// Helper to compute mainType
function getMainType(node: any) {
    return node?.doclet.type?.names[0].replace('Highcharts.', '');
}

// Build a list of metadata for each path
async function getPathMeta(config: SampleGeneratorConfig): Promise<MetaList> {
    const list: MetaList = [];
    for (const controlOptions of config.controls || config.paths || []) {
        let path: string, overrideValue: any;
        if (typeof controlOptions === 'string') {
            ({ path, overrideValue } = parsePathOverride(controlOptions));
        } else {
            path = controlOptions.path;
            overrideValue = controlOptions.value;
        }
        const node = await findNodeByPath(path);
        if (!node) {
            console.warn(colors.yellow(
                `No node found for path: ${path}, ` +
                'trying to build control anyway.'
            ));
            // continue;
        }

        const mainType = getMainType(node);
        let options: string[] | undefined;
        if (node?.doclet.values) {
            options = JSON.parse(node.doclet.values);
        } else if (
            types[mainType] &&
            Array.isArray(types[mainType]) &&
            types[mainType].length < 4
        ) {
            options = types[mainType];
        }

        const defaultFromDocs = node?.doclet.defaultValue ?? node?.meta.default,
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

        if (executedDirectly) {
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
                console.warn(colors.yellow(
                    `No default value for path: ${path}`
                ));
            }
        }

        list.push({
            path,
            controlOptions: typeof controlOptions === 'object' ?
                controlOptions : void 0,
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
function pickHandler(meta: MetaData) {

    const mainType = meta.mainType || '';

    if (meta.controlOptions?.type === 'text') {
        return { kind: 'text', mod: textHandler } as const;
    }
    if (
        meta.controlOptions?.type === 'boolean' ||
        mainType.toLowerCase() === 'boolean'
    ) {
        return { kind: 'boolean', mod: booleanHandler } as const;
    }
    if (
        meta.controlOptions?.type === 'number' ||
        mainType.toLowerCase() === 'number'
    ) {
        return { kind: 'number', mod: numberHandler } as const;
    }
    if (
        meta.controlOptions?.type === 'color' ||
        mainType.toLowerCase() === 'colorstring' ||
        mainType.toLowerCase() === 'colortype'
    ) {
        return { kind: 'color', mod: colorHandler } as const;
    }
    if (
        mainType.toLowerCase() === 'axistypevalue' &&
        !meta.controlOptions?.options
    ) {
        meta.options ||= ['linear', 'logarithmic', 'datetime', 'category'];
    }
    if (
        meta.controlOptions?.type === 'select' ||
        meta.options ||
        mainType.toLowerCase() === 'dashstylevalue'
    ) {
        return { kind: 'select', mod: selectHandler } as const;
    }
    if (mainType.toLowerCase() === 'string') {
        return { kind: 'text', mod: textHandler } as const;
    }

    // Get it from validvalues. Case: xAxis.gridLineInterpolation.
    if (meta.node?.doclet.type?.names.every(name => (
        typeof name === 'string' &&
        /^"[A-Za-z0-9_]*"$/u.test(name)
    ))) {
        meta.options = meta.node.doclet.type.names.map((name => (
            name.slice(1, -1) // Remove quotes
        )));
        return { kind: 'select', mod: selectHandler } as const;
    }

    /*
    if (typeof value === 'number') {
        return { kind: 'number', mod: numberHandler } as const;
    }
    if (typeof value === 'string') {
        return { kind: 'text', mod: textHandler } as const;
    }
    if (typeof value === 'boolean') {
        return { kind: 'boolean', mod: booleanHandler } as const;
    }
        */
    return { kind: 'generic', mod: genericHandler } as const;
}

// Function to get HTML (one row per path) from template
export async function getDemoHTML(
    config?: SampleGeneratorConfig,
    metaList?: MetaList
) {
    let html = await loadTemplate('demo.html');

    const { factory, modules = [] } = config || {};
    if (factory === 'stockChart' && !modules.includes('modules/stock')) {
        modules.unshift('modules/stock');
    } else if (factory === 'mapChart' && !modules.includes('modules/map')) {
        modules.unshift('modules/map');
    } else if (factory === 'ganttChart' && !modules.includes('modules/gantt')) {
        modules.unshift('modules/gantt');
    }

    if (modules.length > 0) {
        const moduleScripts = modules.map(
            moduleName => `<script src="https://code.highcharts.com/${moduleName}.js"></script>`
        ).join('\n');
        html = html.replace(
            '<script src="https://code.highcharts.com/highcharts.js"></script>',
            '<script src="https://code.highcharts.com/highcharts.js"></script>\n' +
                moduleScripts
        );
    }

    // Collect unique handler types and generate functions once
    const handlerTypes = new Set<string>();
    const controls: string[] = [];

    for (const meta of metaList) {
        const handler = pickHandler(meta);

        // Add function if not already added
        if (!handlerTypes.has(handler.kind)) {
            handlerTypes.add(handler.kind);
        }

        // Add call for this specific path
        controls.push(handler.mod.getHTML(
            meta.controlOptions || { path: meta.path },
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
    const description = config.controlsDescription ?
        `<highcharts-group-description>
        ${config.controlsDescription}
      </highcharts-group-description>
      ` :
        '';


    // Add the config
    if (controls.length > 0) {
        html = html.replace(
            '<!-- CONTROLS_PLACEHOLDER -->',
            `<highcharts-controls>
    <highcharts-group header="Update options">
      ${description}${controls.join('\n      ')}
    </highcharts-group>
  </highcharts-controls>`
        );
    }
    return html;
}

// Function to get TS (one listener per path)
export async function getDemoTS(
    config: SampleGeneratorConfig,
    metaList: MetaList
) {

    const { dataFile, factory = 'chart' } = config;

    let chartOptions = JSON.stringify(
        await generateChartConfig(config, metaList),
        null,
        4
    );

    // Fix data file reference
    if (dataFile) {
        chartOptions = chartOptions
            .replace(/"data": "data"/u, '"data": data')
            .replace(/\n/gu, '\n    ');
    }

    // Replace double quotes with single quotes for strings
    chartOptions = chartOptions.replace(/"([^"]+)":/gu, '$1:') // Keys
        // eslint-disable-next-line quotes
        .replace(/: "([^"]+)"/gu, ": '$1'") // String values
        .replace(
            /\[([^\]]*)"([^"]+)"([^\]]*)\]/gu,
            // Array elements - replace all double quotes with single quotes
            match => match.replace(/"/gu, '\'')
        );

    // For arrays of objects, put the open brace on the same line and reindent
    // the inner properties. Make no distinction between single lines/objects
    // and multiple lines/objects.
    //
    // Example:
    // - Input:
    //     series: [
    //         {
    //             type: 'line',
    //             data: [1, 2, 3]
    //         },
    //         {
    //             type: 'line',
    //             data: [4, 5, 6]
    //         }
    //     ]
    // - Output:
    //     series: [{
    //         type: 'line',
    //         data: [1, 2, 3]
    //     }, {
    //         type: 'line',
    //         data: [4, 5, 6]
    //     }]
    const origChartOptions = chartOptions;
    chartOptions = chartOptions.replace(
        /\[\s*\{\s*([\s\S]*?)\s*\}\s*(,\s*\{\s*([\s\S]*?)\s*\}\s*)*\]/gu,
        match => {
            const indentMatch = match.match(/(^|\n)([ \t]*)[^\n]*$/u);
            const indent = indentMatch ? indentMatch[2] : '';
            const innerIndent = indent + '    ';
            const objects = match
                .slice(1, -1)
                .split(/\},\s*\{\s*/u)
                .map(objStr =>
                    objStr
                        .replace(/^\s*\{\s*/u, '')
                        .replace(/\s*\}\s*$/u, '')
                        .trim());

            let result = '[{';
            for (let i = 0; i < objects.length; i++) {
                const objLines = objects[i]
                    .split('\n')
                    .map((line, i) => {
                        if (!i) {
                            return innerIndent + line.trim();
                        }
                        return line.replace(/^ {4}/u, '');
                    });
                result += '\n' + objLines.join('\n') + '\n' + indent + '}';
                if (i < objects.length - 1) {
                    result += ', {';
                }
            }
            result += ']';
            return result;
        }
    );

    // Failed to properly indent nested objects, revert to original
    if (/\[\n\s*\{/u.test(chartOptions)) {
        chartOptions = origChartOptions;
    }

    // For arrays of numbers, put them on one line. If the total line width,
    // including the indentation, exceeds 80 chars, break after commas.
    // - Example input 1, single line:
    //     data: [
    //         29.9,
    //         71.5,
    //         106.4,
    //         129.2
    //     ]
    // - Example output 1:
    //     data: [29.9, 71.5, 106.4, 129.2]
    // - Example input 2, multiple lines:
    //     data: [
    //         29.9,
    //         71.5,
    //         106.4,
    //         129.2,
    //         144,
    //         176,
    //         135.6,
    //         148.5,
    //         216.4,
    //         194.1,
    //         95.6
    //     ]
    // - Example output 2:
    //     data: [
    //         29.9, 71.5, 106.4, 129.2, 144, 176,
    //         135.6, 148.5, 216.4, 194.1, 95.6
    //     ]
    chartOptions = chartOptions.replace(
        /\[\s*((?:-?\d+(?:\.\d+)?\s*,\s*)*-?\d+(?:\.\d+)?)\s*\]/gu,
        (_match, p1, offset, string) => {
            const indentMatch = string
                .substring(0, offset)
                .match(/(^|\n)([ \t]*)[^\n]*$/u);
            const indent = indentMatch ? indentMatch[2] : '';
            const indentWithKey = (indentMatch?.[0] || '')
                .replace(/^[\n\r]+/u, '');
            const numbers = p1.replace(/\s+/gu, ' ').split(', ');
            const singleLine = `[${numbers.join(', ')}]`;
            const maxLineLength = 80;

            // 79 because we want to allow for a comma after the array
            if (indentWithKey.length + singleLine.length <= maxLineLength - 1) {
                return singleLine;
            }

            // Break into multiple lines
            const lineIndent = indent + '    ';
            let multiLine = '[\n' + lineIndent;
            let currentLine = '';

            for (let i = 0; i < numbers.length; i++) {
                const isLast = i === numbers.length - 1;
                const numStr = numbers[i] + (isLast ? '' : ', ');
                const testLine = currentLine + numStr;

                if (
                    lineIndent.length + testLine.length > maxLineLength &&
                    currentLine
                ) {
                    multiLine += currentLine.trimEnd() + '\n' + lineIndent;
                    currentLine = numStr;
                } else {
                    currentLine += numStr;
                }
            }

            if (currentLine) {
                multiLine += currentLine;
            }
            multiLine += '\n' + indent + ']';
            return multiLine;
        }
    );

    // Similarly, for arrays of strings, put them on one line. If the total line
    // width, including the indentation, exceeds 80 chars, break after commas.
    // - Example input 1, single line:
    //     categories: [
    //         'Apples',
    //         'Bananas',
    //         'Oranges',
    //         'Pears'
    //     ]
    // - Example output 1:
    //     categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
    // - Example input 2, multiple lines:
    //     categories: [
    //         'January',
    //         'February',
    //         'March',
    //         'April',
    //         'May',
    //         'June',
    //         'July',
    //         'August',
    //         'September',
    //         'October',
    //         'November',
    //         'December'
    //     ]
    // - Example output 2:
    //     categories: [
    //         'January', 'February', 'March', 'April', 'May', 'June',
    //         'July', 'August', 'September', 'October', 'November', 'December'
    //     ]
    chartOptions = chartOptions.replace(
        /\[\s*('(?:[^'\\]|\\.)*'\s*,\s*)*'(?:[^'\\]|\\.)*'\s*\]/gu,
        (_match, _p1, offset, string) => {
            const indentMatch = string
                .substring(0, offset)
                .match(/(^|\n)([ \t]*)[^\n]*$/u);
            const indent = indentMatch ? indentMatch[2] : '';
            const strings = _match
                .slice(1, -1)
                .split(',')
                .map(s => s.trim());
            const singleLine = `[${strings.join(', ')}]`;
            if ((indent.length + singleLine.length) <= 80) {
                return singleLine;
            }

            // Break into multiple lines
            const maxLineLength = 80;
            const lineIndent = indent + '    ';
            let multiLine = '[\n' + lineIndent;
            let currentLine = '';

            for (let i = 0; i < strings.length; i++) {
                const isLast = i === strings.length - 1;
                const str = strings[i] + (isLast ? '' : ', ');
                const testLine = currentLine + str;

                if (
                    lineIndent.length + testLine.length > maxLineLength &&
                    currentLine
                ) {
                    multiLine += currentLine.trimEnd() + '\n' + lineIndent;
                    currentLine = str;
                } else {
                    currentLine += str;
                }
            }

            if (currentLine) {
                multiLine += currentLine;
            }
            multiLine += '\n' + indent + ']';
            return multiLine;
        }
    );

    // For long strings, break into multiple lines at spaces
    chartOptions = chartOptions.replace(
        /: '([^']+)'/gu,
        (_match, p1, offset, string) => {
            const indentMatch = string
                .substring(0, offset)
                .match(/(^|\n)([ \t]*)[^\n]*$/u);
            const indent = indentMatch ? indentMatch[2] : '';
            const indentWithKey = (indentMatch?.[0] || '')
                .replace(/^[\n\r]+/u, '');

            // Check if the total line length exceeds 80 characters
            if (indentWithKey.length + `: '${p1}'`.length <= 80) {
                return _match;
            }

            const words = p1.split(' ');
            /* eslint-disable-next-line quotes */
            let result = ": '";
            let currentLine = '';

            for (let i = 0; i < words.length; i++) {
                const isLast = i === words.length - 1;
                const word = words[i] + (isLast ? '' : ' ');
                const testLine = currentLine + word;

                if (
                    indentWithKey.length + result.length + testLine.length >
                        80 &&
                    currentLine
                ) {
                    /* eslint-disable-next-line quotes */
                    result += currentLine + "' +\n" + indent + "       '";
                    currentLine = word;
                } else {
                    currentLine += word;
                }
            }

            if (currentLine) {
                result += currentLine;
            }
            /* eslint-disable-next-line quotes */
            result += "'";
            return result;
        }
    );

    let ts = '';

    if (dataFile) {
        ts += [
            '(async () => {',
            '',
            '    const data = await fetch(',
            `        'https://www.highcharts.com/samples/data/${dataFile}'`,
            '    ).then(response => response.json());'
        ].join('\n') + '\n\n    ';
    }

    ts += `Highcharts.${factory}('container', ${chartOptions});\n`
        // Some cases, for example tooltip.borderWidth, have defaultValue as
        // "undefined" in tree.json
        .replace(/"undefined"/gu, 'undefined');

    if (dataFile) {
        ts += '\n})();\n';
    }

    return ts;
}

// Function to get CSS from template
export async function getDemoCSS() {
    const css = await loadTemplate('demo.css');
    return css;
}

export async function getDemoDetails(config: SampleGeneratorConfig) {
    let details = await loadTemplate('demo.details');

    const paths = config.controls ?
        config.controls
            .filter(control => control.inTitle !== false)
            .map(control => control.path) :
        config.paths || [];

    details = details
        .replace('Highcharts Demo', generateTitle(paths))
        .replace(/<em>/gu, '')
        .replace(/<\/em>/gu, '');

    return details;
}

// Function to save the generated configuration to Highcharts Samples
export async function saveDemoFile(config: SampleGeneratorConfig) {
    const metaList = await getPathMeta(config);
    if (!metaList.length && config.paths) {
        throw new Error(`No nodes found for paths: ${config.paths.join(', ')}`);
    }

    // Build all assets in parallel based on per-path mainTypes
    const [html, css, ts, details] = await Promise.all([
        getDemoHTML(config, metaList),
        getDemoCSS(),
        getDemoTS(config, metaList),
        getDemoDetails(config)
    ]);

    const outputDir = join(
        dirname(fileURLToPath(import.meta.url)),
        '../../samples/',
        config.output
    );

    await fs.mkdir(
        outputDir,
        { recursive: true }
    );

    // Write all files in parallel
    await Promise.all([
        fs.writeFile(join(outputDir, 'demo.html'), html),
        fs.writeFile(join(outputDir, 'demo.css'), css),
        fs.writeFile(join(outputDir, 'demo.details'), details)
    ]);

    // If demo.ts is successfully written, delete demo.js if it exists
    try {
        await fs.unlink(join(outputDir, 'demo.js'));
        if (executedDirectly) {
            console.log(colors.blue('Deleted obsolete demo.js file.'));
        }
    } catch {
        // File does not exist, no action needed
    }

    // Format the generated demo.ts file with ESLint
    if (executedDirectly) {
        console.log(colors.blue('Formatting demo.ts with ESLint...'));
    }

    /*
    const eslint = new ESLint({ fix: true });
    const results = await eslint.lintText(
        ts, {
            filePath: `${outputDir}/demo.ts`
        }
    );

    if (results[0].output) {
        await fs.writeFile(`${outputDir}/demo.ts`, results[0].output);
    } else {
        await fs.writeFile(`${outputDir}/demo.ts`, results[0].source);
        console.error(
            colors.red(results[0].messages.map(msg => msg.message).join('\n'))
        );
    }
    */
    await fs.writeFile(join(outputDir, 'demo.ts'), ts);


    if (executedDirectly) {
        console.log(colors.green('Demo files generated successfully.'));
    }
}

// Run the sample generator with the specified config, but only when this
// file is executed directly (not imported as a module)
if (executedDirectly) {
    await saveDemoFile(config);
}
