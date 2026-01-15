/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Chart from '../Chart/Chart';
import type PaletteOptions from './PaletteOptions';

import PaletteDefaults from './PaletteDefaults.js';
import H from '../Globals.js';
const { doc } = H;
import U from '../Utilities.js';
const {
    isString,
    objectEach,
    merge
} = U;

/* *
 *
 *  Declarations
 *
 * */
declare module '../Chart/ChartBase' {
    interface ChartBase {
        palette: Palette;
    }
}


/* *
 *
 *  Class
 *
 * */

/* eslint-disable valid-jsdoc */

const useCSSVariables = true;

/**
 * A Palette class holding the palette colors and lifecycle methods for each
 * chart.
 *
 * @class
 * @name Highcharts.Palette
 *
 * @param {Highcharts.Chart} chart
 *        The chart instance
 * @param {Highcharts.PaletteOptions} options
 *        Palette options
 */
export default class Palette {

    /**
     * Apply the current palette to a color string containing palette
     * templating.
     */
    public static applyPalette = (color: string, chart?: Chart): string => {
        if (useCSSVariables) {
            return color;
        }

        // Programmatic replacement of palette variables
        // @todo This should probably be removed, and supported only as a
        // workaround snippet
        const p = chart?.palette.options || PaletteDefaults;
        return (color.indexOf('var(--highcharts-') !== -1) ?
            color.replace(
                /var\(--highcharts-([a-z0-9\-]+)\)/g,
                (_match: string, name: string): string => {
                    // Convert kebab-case to camelCase
                    const camelName = name.replace(
                        /-([a-z0-9])/g,
                        (_, char): string => char.toUpperCase()
                    ) as keyof typeof p;
                    return (p[camelName] || '#8888') as string;
                }
            ) :
            color;
    };

    public chart: Chart;
    public defaultOptions: PaletteOptions = PaletteDefaults;
    public options: PaletteOptions = merge(PaletteDefaults);

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(
        chart: Chart,
        options: PaletteOptions
    ) {
        this.chart = chart;
        this.update(options);
    }

    /**
     * Update the palette with new options. May be called directly as
     * `chart.palette.update()` or indirectly from `chart.update({ palette })`.
     *
     * @function Highcharts.Palette#update
     *
     * @param {Highcharts.PaletteOptions} options
     *        New palette options
     */
    public update(
        options: PaletteOptions
    ): void {
        options = this.chart.options.palette = merge(
            true,
            this.options,
            options
        );

        let css: string = '';

        const addKebab = (color: unknown, key: string): void => {
            if (isString(color)) {
                // Kebab-case the key. Sequences of numbers should be kept but
                // with a preceding dash.
                key = key
                    .replace(/([0-9]+)/g, '-$1')
                    .replace(
                        /[A-Z]/g,
                        (match): string => `-${match.toLowerCase()}`
                    );
                css += `--highcharts-${key}: ${color};\n`;
            }
        };

        // Data colors are stored as an array
        options.light?.colors?.forEach((color, i): void => {
            addKebab(color, `color${i}`);
        });

        // The rest are stored as named properties
        objectEach(options.light, addKebab);

        // Add a style tag to the chart renderer box
        const style = this.chart.renderer.defs.element.querySelector('style') ||
            doc.createElementNS(H.SVG_NS, 'style');
        if (!style.parentNode) {
            (style as HTMLStyleElement).nonce = 'highcharts';
            this.chart.renderer.defs.element.appendChild(style);
        }
        style.textContent = `:root {\n${css}}`;
    }

}
