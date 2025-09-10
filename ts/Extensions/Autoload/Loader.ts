/* *
 *
 *  (c) 2010-2024 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type Chart from '../../Core/Chart/Chart';
import type Options from '../../Core/Options';

import G from '../../Core/Globals.js';
import mapping from './DependencyMapping.js';
import U from '../../Core/Utilities.js';
const {
    pushUnique,
    splat
} = U;

const H: AnyRecord = G;
const addedFiles: string[] = [];
const loaded: string[] = [];

// Default to root and extension that supports ESM imports.
let root = './',
    // In compiled scripts, this gets replaced with .js by the scripts-compile
    // task.
    extension = '.src.js';

const addStyleSheets = (
    options: Partial<Options>,
    files: Array<string>
): void => {
    // Styled mode
    if (options.chart?.styledMode) {
        pushUnique(files, 'css/highcharts.css');
    }

    // Stock Tools
    if (options.stockTools) {
        pushUnique(files, 'css/stocktools/gui.css');
        pushUnique(files, 'css/annotations/popup.css');
    }

};

/**
 * Given a Highcharts configuration object, this function will return an array
 * of the required script files.
 *
 * @since next
 * @param {Partial<Options>} options The Highcharts configuration object.
 * @return {Array<string>} An array of file names.
 */
const getFiles = (options: Partial<Options>): Array<string> => {

    const files = addedFiles.slice();

    const recurse = (
        opts: AnyRecord,
        path: Array<string> = []
    ): void => {
        Object.entries(opts).forEach(([key, value]): void => {
            if (path.length === 1 && path[0] === 'series') {
                key = value.type || options.chart?.type || 'line';
            }

            const fullKey = path.concat(key).join('.'),
                // Pick up properties that are set on series items, like
                // `dragDrop` or `label`
                seriesKey = fullKey.replace(
                    /^series\.[a-zA-Z]+/, 'plotOptions.series'
                ),
                fullKeys = [fullKey];

            // Add special cases
            if (seriesKey !== fullKey) {
                fullKeys.push(seriesKey);
            }

            fullKeys.forEach((fullKey): void => {
                if (fullKey in mapping) {
                    mapping[fullKey].forEach(
                        (file): boolean => pushUnique(files, file)
                    );
                }
            });

            if (value && typeof value === 'object' && key !== 'data') {
                path.push(key);
                recurse(value, path);
                path.pop();
            }
        });
    };
    recurse(options);

    // Advanced annotations
    if (options.annotations) {
        splat(options.annotations).forEach((annotation): void => {
            if (annotation.type && mapping[`annotations.${annotation.type}`]) {
                mapping[`annotations.${annotation.type}`].forEach(
                    (file): boolean => pushUnique(files, file)
                );
            }
        });
    }

    addStyleSheets(options, files);

    return Array.from(files);
};

const setRootFromURL = (url: string): string|undefined => {
    const regex = /\/highcharts-autoload(\.src\.js|\.js)$/,
        match = url.match(regex);

    if (match) {
        root = url.replace(regex, '/');
        extension = match[1];
        return root;
    }
};

const guessRoot = (): void => {

    const scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
        if (setRootFromURL(scripts[i].src)) {
            return;
        }
    }
};

const setRoot = (userRoot = root, userExtension = extension): void => {
    root = userRoot;
    extension = userExtension;
};

/**
 * Add script files to the list of modules to load. This is useful for
 * dynamically loading modules that have no reference in the options structure.
 *
 * @example
 * // Load the exporting module without having to set `exporting.enabled` in the
 * // options.
 * Highcharts.Loader.use(['modules/exporting']);
 *
 * @param {Array<string>} files An array of files to add.
 */
const use = (files: Array<string>): void => {
    files.forEach((file): boolean => pushUnique(addedFiles, file));
};

const loadFile = async (file: string): Promise<undefined> => {
    if (loaded.includes(file)) {
        return;
    }

    // Relative root => ES modules
    if (root === '' || root.charAt(0) === '.') {
        try {
            await import(
                // eslint-disable-next-line capitalized-comments
                /* webpackIgnore: true */ `${root}${file}${extension}`
            );
            pushUnique(loaded, file);
        } catch (e) {
            /* eslint-disable-next-line no-console */
            console.error(e);
        }
        return;
    }

    return new Promise((resolve, reject): void => {
        const onload = (): void => {
            pushUnique(loaded, file);
            resolve(void 0);
        };

        if (file.endsWith('.css')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = `${root}${file}`;
            link.onload = onload;
            link.onerror = reject;
            document.head.appendChild(link);
        } else {
            const script = document.createElement('script');
            script.src = `${root}${file}${extension}`;
            script.onload = onload;
            script.onerror = reject;
            document.head.appendChild(script);
        }
    });
};

// Override the factories to load script files on demand
(
    ['chart', 'ganttChart', 'mapChart', 'stockChart'] as const
).forEach((factory): void => {
    H[factory] = async function (
        container: string|globalThis.HTMLElement,
        options: Partial<Options>,
        callback?: Function
    ): Promise<Chart> {

        guessRoot();

        // Load the required files
        const files = getFiles(options);

        if (factory === 'stockChart') {
            files.unshift('modules/stock');
        } else if (factory === 'ganttChart') {
            files.unshift('modules/gantt');
        } else if (factory === 'mapChart') {
            files.unshift('modules/map');
        }

        for (const file of files) {
            await loadFile(file);
        }

        const constructorName = {
            chart: 'Chart',
            ganttChart: 'GanttChart',
            mapChart: 'MapChart',
            stockChart: 'StockChart'
        }[factory];
        return new H[constructorName](container, options, callback);
    };
});

const Loader = {
    getFiles,
    use,
    setRoot
};

export default Loader;
