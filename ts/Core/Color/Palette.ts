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
    diffObjects,
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
 * Build the text content for the style tag
 */
const getStyles = (
    specifier: string,
    rules: Record<string, string>
): string =>
    `${specifier || ':root'},
${specifier} .highcharts-light,
.highcharts-light ${specifier} {
${rules.light}
}
${specifier} .highcharts-dark,
.highcharts-dark ${specifier} {
${rules.dark}
}
@media (prefers-color-scheme: dark) {
    ${specifier || ':root'} {
${rules.dark}
    }
}
.highcharts-container {
  color-scheme: 'light dark';
}
.highcharts-container.highcharts-light  {
  color-scheme: light;
}
.highcharts-container.highcharts-dark {
  color-scheme: dark;
}`;

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
     * Inject the CSS for the palette into the document head or chart
     * container.
     *
     * @internal
     *
     * @param {Highcharts.PaletteOptions} options
     *        Palette options
     */
    public injectCSS(
        options: PaletteOptions
    ): void {
        const rules = { light: '', dark: '' },
            hasSpecificPalette = Object.keys(
                diffObjects(options, this.defaultOptions)
            ).length > 0;

        let css = '';

        const addKebab = (color: unknown, key: string): void => {
            if (isString(color)) {
                // Kebab-case the key. Sequences of numbers should be kept
                // but with a preceding dash.
                key = key
                    .replace(/([0-9]+)/g, '-$1')
                    .replace(
                        /[A-Z]/g,
                        (match): string => `-${match.toLowerCase()}`
                    );
                css += `  --highcharts-${key}: ${color};\n`;
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
                highlightColor = new Color(
                    paletteColors?.highlightColor || ''
                );

            // Interpolate keys
            [3, 5, 10, 20, 40, 60, 80, 100].forEach((fraction): void => {
                interpolated[`neutralColor${fraction}`] = backgroundColor
                    .tweenTo(neutralColor, fraction / 100);
                interpolated[`highlightColor${fraction}`] = backgroundColor
                    .tweenTo(highlightColor, fraction / 100);
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
        const styleParent = hasSpecificPalette ?
                this.chart.container : doc.head,
            specifier = hasSpecificPalette ?
                `*[data-highcharts-chart="${this.chart.index}"]` :
                '',
            style: HTMLStyleElement = styleParent
                .querySelector('style.highcharts-palette') ||
                doc.createElement('style');

        if (!style.parentNode) {
            style.nonce = 'highcharts';
            style.className = 'highcharts-palette';
            styleParent.appendChild(style);
        }

        style.textContent = getStyles(specifier, rules);
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
        const { classList } = this.chart.container;

        options = this.chart.options.palette = merge(
            true,
            this.options,
            options
        );

        if (options.injectCSS !== false) {
            this.injectCSS(options);
        }

        // Set the class name of the container
        classList.remove('highcharts-light', 'highcharts-dark');
        if (options.colorScheme === 'light') {
            classList.add('highcharts-light');
        } else if (options.colorScheme === 'dark') {
            classList.add('highcharts-dark');
        }
    }

}
