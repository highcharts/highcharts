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
import type StockChart from '../../Core/Chart/StockChart';
import type Options from '../../Core/Options';

import G from '../../Core/Globals.js';
import mapping from './DependencyMapping.js';

const H: AnyRecord = G;

let root = 'https://code.highcharts.com';

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
            if (typeof value === 'object') {
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

const loadScript = async (module: string): Promise<undefined> =>
    new Promise((resolve, reject): void => {
        const script = document.createElement('script');
        script.src = `${root}/${module}.js`;
        script.onload = (): void => resolve(void 0);
        script.onerror = reject;
        document.head.appendChild(script);
    });

// Override the constructors to load modules on demand
H.chart = async function (
    container: string|globalThis.HTMLElement,
    options: Partial<Options>
): Promise<Chart> {

    setRoot();

    // Load the required modules
    for (const module of getModules(options)) {
        await loadScript(module);
    }

    return new H.Chart(container, options);
};

H.stockChart = async function (
    container: string|globalThis.HTMLElement,
    options: Partial<Options>
): Promise<StockChart> {

    setRoot();
    // Load the other required modules
    for (const module of ['modules/stock', ...getModules(options)]) {
        await loadScript(module);
    }

    return new H.StockChart(container, options);
};

const Loader = {

};

export default Loader;
