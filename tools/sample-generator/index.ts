/**
 * Sample Generator
 *
 * Generates a Highcharts sample based on specified option paths,
 * creating HTML controls to manipulate those options at runtime.
 *
 * Usage with gulp:
 * - Define config.ts files in sample directories
 * - If you have changed anything in the Highcharts options structure, working
 *   on new or changed defaults etc., run `gulp sample-generator --setup`.
 * - `gulp sample-generator`
 *
 * Direct usage:
 * - Define desired option paths in the `paths` array.
 * - `node tools/sample-generator/index.ts`
 */

/* eslint-disable no-console, node/no-unpublished-import */

import type {
    ControlOptions,
    Details,
    FlatTreeNode,
    SampleGeneratorConfig
} from './generator-config.d.ts';

import colors from 'colors/safe.js';
import crypto from 'crypto';
import { dirname, join } from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';

import config from './config-example.ts';

// Type handlers
import * as booleanHandler from './type-handlers/boolean.ts';
import * as genericHandler from './type-handlers/generic.ts';
import * as numberHandler from './type-handlers/number.ts';
import * as selectHandler from './type-handlers/select.ts';
import * as colorHandler from './type-handlers/color.ts';
import * as textHandler from './type-handlers/text.ts';
import * as separatorHandler from './type-handlers/separator.ts';
interface MetaData {
    controlOptions?: ControlOptions;
    path?: string;
    node?: FlatTreeNode;
    mainType?: string;
    options?: string[];
    defaultValue?: any;
    overrideValue?: any;
}

type MetaList = Array<MetaData>;

const executedDirectly = import.meta.url === process.argv[1] ||
    import.meta.url === `file://${process.argv[1]}`;

// The precompiled, flattenend abstract of tree.json. Compiled with
// `node tools/sample-generator/setup.ts`.
const flatTree: FlatTreeNode[] = JSON.parse(await fs.readFile(
    join(dirname(fileURLToPath(import.meta.url)), 'flat-tree.json'),
    'utf-8'
));

// The deep merge function from Highcharts
function merge<T>(
    extendOrSource: true | T,
    ...sources: Array<Partial<T> | undefined>
): T {
    let i,
        args = [extendOrSource, ...sources],
        ret = {} as T;
    const doCopy = function (copy: any, original: any): any {
        // An object is replacing a primitive
        if (typeof copy !== 'object') {
            copy = {};
        }

        Object.entries(original).forEach(([key, value]) => {

            // Prototype pollution (#14883)
            if (key === '__proto__' || key === 'constructor') {
                return;
            }

            // Copy the contents of objects, but not arrays or DOM nodes
            if (
                typeof value === 'object' &&
                !Array.isArray(value) &&
                value !== null
            ) {
                copy[key] = doCopy(copy[key] || {}, value);

            // Primitives and arrays are copied over directly
            } else {
                copy[key] = original[key];
            }
        });
        return copy;
    };

    // If first argument is true, copy into the existing object. Used in
    // setOptions.
    if (extendOrSource === true) {
        ret = args[1] as T;
        args = Array.prototype.slice.call(args, 2);
    }

    // For each argument, extend the return
    const len = args.length;
    for (i = 0; i < len; i++) {
        ret = doCopy(ret, args[i]);
    }

    return ret;
}

// Template helpers
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
    const paths = metaList
        .filter(meta => typeof meta.path === 'string')
        .map(meta => meta.path);
    if (!metaList.length && paths) {
        throw new Error(`No nodes found for paths: ${paths.join(', ')}`);
    }

    const chartOptions: any = {};
    for (const optionsTpl of config.templates || ['column', 'categories-4']) {
        const tplModule = await import(`./tpl/chart-options/${optionsTpl}.ts`);
        const tplOptions = tplModule.default;
        merge(true, chartOptions, tplOptions);
    }

    const titlePaths = metaList
        .filter(
            meta => meta.controlOptions?.inTitle !== false &&
            typeof meta.path === 'string'
        )
        .map(meta => meta.path);
    merge(true, chartOptions, {
        title: { text: generateTitle(titlePaths) }
    });

    if (chartOptionsExtra) {
        merge(true, chartOptions, chartOptionsExtra);
    }

    if (config.dataFile) {
        chartOptions.series ||= [];
        chartOptions.series[0] ||= {};
        chartOptions.series[0].data = 'data';
    }

    for (const { defaultValue, path, overrideValue } of metaList) {
        // Use override value if provided, otherwise use default from tree
        const value = overrideValue !== void 0 ?
            overrideValue :
            defaultValue;

        if (path) {
            extendObject(chartOptions, path, value);
        }
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

// Build a list of metadata for each path
function getPathMeta(config: SampleGeneratorConfig): MetaList {
    const list: MetaList = [];
    for (const controlOptions of config.controls || config.paths || []) {
        let path: string | undefined,
            overrideValue: any;
        if (typeof controlOptions === 'string') {
            ({ path, overrideValue } = parsePathOverride(controlOptions));
        } else {
            path = controlOptions.path;
            overrideValue = controlOptions.value;
        }

        if (path) {
            // Replace array indices for lookup in flat tree
            const name = path.replace(/\[\d+\]/gu, '');

            let node = flatTree.find(n => n.name === name);
            if (!node) {
                const keys = path.split('.').map(
                    k => k.replace(/\[\d+\]/gu, '[*]')
                );

                // If the node is not found, start at the root and see if each
                // parent extends another node. If it does, copy the options from
                // the extended node until we find the path or run out of extends.
                let currentPath = '';
                for (const key of keys) {
                    currentPath += (currentPath ? '.' : '') + key;
                    const curPath = currentPath;
                    const currentNode = flatTree.find(n => n.name === curPath);
                    if (currentNode?.extendsPath) {
                        flatTree
                            .filter(
                                n => n.name.startsWith(
                                    currentNode.extendsPath + '.'
                                )
                            )
                            .forEach(n => {
                                const copyName = n.name.replace(
                                    currentNode.extendsPath + '.',
                                    curPath + '.'
                                );
                                if (!flatTree.some(
                                    node => node.name === copyName
                                )) {
                                    flatTree.push({
                                        ...n,
                                        name: copyName
                                    });
                                }
                            });
                    }
                }

                node = flatTree.find(n => n.name === name);
            }

            if (!node) {
                console.log(colors.gray(
                    `  - ${path} not found in flat-tree.json, ` +
                    'trying to build control anyway.'
                ));
            }

            const { default: defaultValue, mainType, options } = node || {};

            if (executedDirectly) {
                if (overrideValue !== void 0) {
                    console.log(colors.green(
                        `Using override for ${path}: ${overrideValue}`
                    ));
                } else if (defaultValue !== void 0) {
                    console.log(colors.green(
                        `Found default for ${path}: ${defaultValue}`
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

        // Separator or invalid path without override value
        } else {
            list.push({
                controlOptions: typeof controlOptions === 'object' ?
                    controlOptions : void 0
            });
        }
    }
    return list;
}

// Select handler for a given meta
function pickHandler(meta: MetaData) {

    const mainType = meta.mainType || '';

    if (meta.controlOptions?.type === 'separator') {
        return { kind: 'separator', mod: separatorHandler } as const;
    }
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
    /*
    if (meta.node?.doclet.type?.names.every(name => (
        typeof name === 'string' &&
        /^"[A-Za-z0-9_]*"$/u.test(name)
    ))) {
        meta.options = meta.node.doclet.type.names.map((name => (
            name.slice(1, -1) // Remove quotes
        )));
        return { kind: 'select', mod: selectHandler } as const;
    }
        */

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
        // eslint-disable-next-line quotes
        .replace(/""/gu, "''") // Empty strings
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

            if (/\\n/u.test(p1)) {
                // Already has line breaks, return as template string
                return `: \`${p1.replace(/\\n/gu, '\n')}\``;
            }

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

    // Build the TS. Would like to have `satisfies Highcharts.Options` here, but
    // that breaks jsFiddle. Revisit later.
    ts += `Highcharts.${factory}('container', ${
        chartOptions
    });\n`
        // Some cases, for example tooltip.borderWidth, have defaultValue as
        // "undefined" in tree.json
        .replace(/"undefined"/gu, 'undefined');

    if (dataFile) {
        ts += '\n})();\n';
    }

    return ts;
}

/**
 * Convert a plain JS object into a simple YAML string.
 * Supports: objects, arrays, strings, numbers, booleans, null.
 * (No anchors/refs, no fancy YAML types.)
 *
 * @param {object} value The JavaScript object to convert to YAML.
 */
function objectToYml(value: unknown): string {
    const isPlainObject = (v: unknown): v is Record<string, unknown> =>
        !!v && typeof v === 'object' && !Array.isArray(v);

    const quote = (s: string) => {
        // Quote when empty, contains special chars, leading/trailing
        // whitespace, or could be misread as YAML boolean/null/number-ish.
        const needsQuotes =
            s === '' ||
            /^\s|\s$/u.test(s) ||
            /[:\-[\]{},#&*!|>'"%@`]/u.test(s) ||
            /\n/u.test(s) ||
            /^(true|false|null|~|yes|no|on|off)$/iu.test(s) ||
            /^[-+]?\d+(\.\d+)?$/u.test(s);

        if (!needsQuotes) {
            return s;
        }
        // Use double-quotes and escape backslash and quotes + newlines
        return `"${s
            .replace(/\\/gu, '\\\\')
            .replace(/"/gu, '\\"')
            .replace(/\n/gu, '\\n')}"`;
    };

    const scalarToYml = (v: unknown): string => {
        if (v === null) {
            return 'null';
        }
        if (v === void 0) {
            return 'null';
        }
        if (typeof v === 'string') {
            return quote(v);
        }
        if (typeof v === 'number') {
            return Number.isFinite(v) ? String(v) : quote(String(v));
        }
        if (typeof v === 'boolean') {
            return v ? 'true' : 'false';
        }
        // Fallback: stringify unknowns as strings
        return quote(String(v));
    };

    const indentStr = (n: number) => '  '.repeat(n);

    const render = (v: unknown, indent: number): string => {
        if (Array.isArray(v)) {
            if (v.length === 0) {
                return '[]';
            }
            return v
                .map(item => {
                    if (Array.isArray(item) || isPlainObject(item)) {
                        if (isPlainObject(item) && item.key) {
                            // Special case for details.yml, where we want to
                            // keep the "key: value" structure on the same line,
                            // and put the rest of the object on the next line
                            const { key, ...rest } = item as any;
                            const inner = render(rest, indent + 1);
                            return `${indentStr(indent)}- ${key}:\n${inner}`;
                        }
                        const inner = render(item, indent + 1);
                        // Put complex item on next line
                        return `${indentStr(indent)}- ${
                            inner.includes('\n') ?
                                '\n' + inner :
                                inner
                        }`;
                    }
                    return `${indentStr(indent)}- ${scalarToYml(item)}`;
                })
                .join('\n');
        }

        if (isPlainObject(v)) {
            const entries = Object.entries(v);
            if (entries.length === 0) {
                return '{}';
            }

            return entries
                .map(([k, val]) => {
                    const key = quote(k)
                        // Keep keys mostly bare, still safe-ish
                        .replace(/^"|"$/gu, '');
                    if (Array.isArray(val) || isPlainObject(val)) {
                        const inner = render(val, indent + 1);
                        return `${indentStr(indent)}${key}:\n${inner}`;
                    }
                    return `${
                        indentStr(indent)
                    }${key}: ${scalarToYml(val)}`;
                })
                .join('\n');
        }

        return `${indentStr(indent)}${scalarToYml(v)}`;
    };

    return '---\n' + render(value, 0) + '\n...';

}


// Function to get CSS from template
export async function getDemoCSS(config: SampleGeneratorConfig) {
    let css = await loadTemplate('demo.css');

    if (config.chartOptionsExtra?.chart?.styledMode) {
        css = '@import url("https://code.highcharts.com/css/highcharts.css");\n\n' + css;
    }

    return css;
}

function getDemoDetails(config: SampleGeneratorConfig): string {
    const paths = config.controls ?
        config.controls
            .filter(
                control => control.inTitle !== false &&
                typeof control.path === 'string'
            )
            .map(control => control.path) :
        config.paths || [];

    const details: Details = merge({
        name: generateTitle(paths)
            .replace(/<em>/gu, '')
            .replace(/<\/em>/gu, ''),
        /* eslint-disable-next-line camelcase */
        js_wrap: 'b'
    }, config.details || {});

    // Convert to YML
    const detailsYml = objectToYml(details);

    return detailsYml;
}

// Function to save the generated configuration to Highcharts Samples
/**
 * Calculate checksum for generated files
 *
 * @param {string} outputDir
 *        Directory containing the generated files
 * @return {Promise<string>}
 *         SHA256 checksum
 */
export async function calculateChecksum(outputDir: string): Promise<string> {
    const files = ['demo.ts', 'demo.html', 'demo.css', 'demo.details'];
    const hash = crypto.createHash('sha256');

    for (const file of files) {
        const filePath = join(outputDir, file);
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            hash.update(file);
            hash.update(content);
        } catch {
            // File doesn't exist, skip it
        }
    }

    return hash.digest('hex');
}

/**
 * Save checksum file
 *
 * @param {string} outputDir
 *        Directory containing the generated files
 * @return {Promise<void>}
 *         Promise to keep
 */
async function saveChecksum(outputDir: string): Promise<void> {
    const checksum = await calculateChecksum(outputDir);
    const checksumPath = join(outputDir, '.generated-checksum');
    await fs.writeFile(
        checksumPath, checksum, { encoding: 'utf-8', mode: 0o644 }
    );
}

export async function saveDemoFile(config: SampleGeneratorConfig) {
    const metaList = getPathMeta(config);
    if (!metaList.length && config.paths) {
        throw new Error(`No nodes found for paths: ${config.paths.join(', ')}`);
    }

    // Build all assets in parallel based on per-path mainTypes
    const [html, css, ts] = await Promise.all([
        getDemoHTML(config, metaList),
        getDemoCSS(config),
        getDemoTS(config, metaList)
    ]);
    const details = getDemoDetails(config);

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
        fs.writeFile(
            join(outputDir, 'demo.html'),
            html,
            { encoding: 'utf-8', mode: 0o644 }
        ),
        fs.writeFile(
            join(outputDir, 'demo.css'),
            css,
            { encoding: 'utf-8', mode: 0o644 }
        ),
        fs.writeFile(
            join(outputDir, 'demo.details'),
            details,
            { encoding: 'utf-8', mode: 0o644 }
        ),
        fs.writeFile(
            join(outputDir, '.gitignore'),
            'demo.js',
            { encoding: 'utf-8', mode: 0o644 }
        )
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
        await fs.writeFile(`${outputDir}/demo.ts`, results[0].output, { encoding: 'utf-8', mode: 0o644 });
    } else {
        await fs.writeFile(`${outputDir}/demo.ts`, results[0].source, { encoding: 'utf-8', mode: 0o644 });
        console.error(
            colors.red(results[0].messages.map(msg => msg.message).join('\n'))
        );
    }
    */
    await fs.writeFile(
        join(outputDir, 'demo.ts'), ts, { encoding: 'utf-8', mode: 0o644 }
    );

    // Calculate and save checksum for validation
    await saveChecksum(outputDir);

    if (executedDirectly) {
        console.log(colors.green('Demo files generated successfully.'));
    }
}

// Run the sample generator with the specified config, but only when this
// file is executed directly (not imported as a module)
if (executedDirectly) {
    await saveDemoFile(config);
}
