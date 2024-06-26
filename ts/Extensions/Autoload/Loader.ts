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

const H: AnyRecord = G;
const loaded = new Set<string>();

let root = 'https://code.highcharts.com';

const addStyleSheets = (
    options: Partial<Options>,
    modules: Set<string>
): void => {
    // Styled mode
    if (options.chart?.styledMode) {
        modules.add('css/highcharts.css');
    }

    // Stock Tools
    if (options.stockTools) {
        modules.add('css/stocktools/gui.css');
        modules.add('css/annotations/popup.css');
    }

    if (options.annotations) {
        modules.add('css/annotations.css');
    }

};

// Given a Highcharts configuration object, this function will return an array
// of the required modules.
const getModules = (options: Partial<Options>): Array<string> => {

    const modules = new Set<string>();

    const recurse = (
        options: AnyRecord,
        path: Array<string> = []
    ): void => {
        Object.entries(options).forEach(([key, value]): void => {
            const fullKey = path.concat(key).join('.');
            if (fullKey in mapping) {
                mapping[fullKey].forEach(
                    (module): Set<string> => modules.add(module)
                );
            }
            if (value && typeof value === 'object') {
                path.push(key);
                recurse(value, path);
                path.pop();
            }
        });
    };
    recurse(options);

    // Series types are inferred from `chart.type` and `series.type`
    type ItemWithType = { type?: string };
    const itemsWithType: Array<ItemWithType> = (options.series || []);
    if (options.chart?.type) {
        itemsWithType.push(options.chart);
    }
    itemsWithType.forEach((item): void => {
        if (item.type && mapping[`series.${item.type}`]) {
            mapping[`series.${item.type}`].forEach(
                (module): Set<string> => modules.add(module)
            );
        }
    });

    addStyleSheets(options, modules);

    return Array.from(modules);
};

const setRoot = (): void => {
    const scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src.indexOf('highcharts-autoload.js') !== -1) {
            root = scripts[i].src.replace(/\/highcharts-autoload\.js$/, '');
            return;
        }
    }
};

const loadScript = async (module: string): Promise<undefined> => {
    if (loaded.has(module)) {
        return;
    }
    return new Promise((resolve, reject): void => {
        const onload = (): void => {
            loaded.add(module);
            resolve(void 0);
        };

        if (module.endsWith('.css')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = `${root}/${module}`;
            link.onload = onload;
            link.onerror = reject;
            document.head.appendChild(link);
        } else {
            const script = document.createElement('script');
            script.src = `${root}/${module}.js`;
            script.onload = onload;
            script.onerror = reject;
            document.head.appendChild(script);
        }
    });
};

// Override the factories to load modules on demand
(
    ['chart', 'ganttChart', 'mapChart', 'stockChart'] as
    ['chart', 'ganttChart', 'mapChart', 'stockChart']
).forEach((factory): void => {
    H[factory] = async function (
        container: string|globalThis.HTMLElement,
        options: Partial<Options>
    ): Promise<Chart> {

        setRoot();

        // Load the required modules
        const modules = getModules(options);

        if (factory === 'stockChart') {
            modules.unshift('modules/stock');
        } else if (factory === 'ganttChart') {
            modules.unshift('modules/gantt');
        } else if (factory === 'mapChart') {
            modules.unshift('modules/map');
        }

        for (const module of modules) {
            await loadScript(module);
        }

        const constructorName = {
            chart: 'Chart',
            ganttChart: 'GanttChart',
            mapChart: 'MapChart',
            stockChart: 'StockChart'
        }[factory];
        return new H[constructorName](container, options);
    };
});

const Loader = {

};

export default Loader;
