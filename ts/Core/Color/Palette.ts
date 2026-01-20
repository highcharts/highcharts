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
import type ColorType from './ColorType';
import type { PaletteOptions } from './PaletteOptions';

import Color from './Color.js';
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

        const rules = { light: '', dark: '' };

        let css = '';

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

        for (const colorScheme of ['light', 'dark'] as const) {
            css = '';
            const paletteColors = options[colorScheme] || {},
                interpolated: Record<string, ColorType> = {},
                neutralColor = new Color(paletteColors?.neutralColor || ''),
                backgroundColor = new Color(
                    paletteColors?.backgroundColor || ''
                ),
                highlightColor = new Color(paletteColors?.highlightColor || '');

            // Interpolate keys
            [3, 5, 10, 20, 40, 60, 80, 100].forEach((fraction): void => {
                interpolated[`neutralColor${fraction}`] = backgroundColor.tweenTo(
                    neutralColor,
                    fraction / 100
                );
                interpolated[`highlightColor${fraction}`] = backgroundColor.tweenTo(
                    highlightColor,
                    fraction / 100
                );
            });

            // Data colors are stored as an array
            paletteColors?.colors?.forEach((color, i): void => {
                addKebab(color, `color${i}`);
            });

            // The rest are stored as named properties
            objectEach(paletteColors, addKebab);
            objectEach(interpolated, addKebab);

            rules[colorScheme] = css;
        }

        // Add a style tag to the chart renderer box
        const style = this.chart.renderer.defs.element.querySelector('style') ||
            doc.createElementNS(H.SVG_NS, 'style');
        if (!style.parentNode) {
            (style as HTMLStyleElement).nonce = 'highcharts';
            this.chart.renderer.defs.element.appendChild(style);
        }
        style.textContent = `:root, .highcharts-light {\n${rules.light}}
        .highcharts-dark {
            ${rules.dark}
        }
        .highcharts-container {
            color-scheme: light dark;
        }
        .highcharts-light .highcharts-container {
            color-scheme: light;
        }
        .highcharts-dark .highcharts-container {
            color-scheme: dark;
        }`;
    }

}
