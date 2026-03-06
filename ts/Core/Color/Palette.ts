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

import type ColorType from './ColorType';
import type { PaletteOptions } from './PaletteOptions';
import type SVGRenderer from '../Renderer/SVG/SVGRenderer';

import Color from './Color.js';
import H from '../Globals.js';
const { charts } = H;
import PaletteDefaults from './PaletteDefaults.js';
import {
    diffObjects,
    extend,
    isString,
    objectEach,
    merge
} from '../../Shared/Utilities.js';

/* *
 *
 *  Declarations
 *
 * */
declare module '../Chart/ChartBase' {
    interface ChartBase {
        palette: Palette|undefined;
    }
}

type CSSVars = {
    light: { [key: string]: string };
    dark: { [key: string]: string };
};

/* *
 *
 *  Constants
 *
 * */

const defaultColors: Array<ColorType> = [
    '#2caffe',
    '#544fc5',
    '#00e272',
    '#fe6a35',
    '#6b8abc',
    '#d568fb',
    '#2ee0ca',
    '#fa4b42',
    '#feb56a',
    '#91e8e1'
];

const defaultDarkOverrideColors: Array<ColorType|null> = [
    null, // Use the same color for the first item in dark mode
    '#00e272',
    '#efdf00'
];

/* *
 * Build the text content for the style tag
 */
const getStyles = (
    specifier: string,
    cssVars: CSSVars
): string => {

    const reduceToCSS = (
        /**
         * For browsers that don't support color-scheme and light-dark, we need
         * to first set the CSS variables as the light scheme.
         */
        supportsColorScheme?: boolean
    ): string => {
        let css = '';
        objectEach(cssVars.light, (value, key): void => {
            css += supportsColorScheme && value !== cssVars.dark[key] ?
                `  ${key}: light-dark(${value}, ${cssVars.dark[key]});\n` :
                `  ${key}: ${value};\n`;
        });
        return css;
    };

    const legacy = reduceToCSS(),
        lightDark = reduceToCSS(true);
    const css = `${specifier || ':root'} {
${legacy}
}
@supports (color: light-dark(#fff, #000)) {
  ${specifier || ':root'} {
${lightDark}
  }
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
    return css;
};

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

    public defaultOptions: PaletteOptions = PaletteDefaults;
    public options: PaletteOptions = merge(PaletteDefaults);
    public renderer: SVGRenderer;
    public cssVars: CSSVars = { light: {}, dark: {} };
    public dataColors?: Array<ColorType>;

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(
        renderer: SVGRenderer,
        options: PaletteOptions
    ) {
        this.renderer = renderer;
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
        const { cssVars, renderer } = this,
            hasSpecificPalette = Object.keys(
                diffObjects(options, this.defaultOptions)
            ).length > 0;

        let colorScheme: 'light' | 'dark' = 'light';

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
                cssVars[colorScheme][`--highcharts-${key}`] = color;
            }
        };

        // Data colors
        (options.colors || defaultColors).forEach((color, i): void => {
            addKebab(color, `color${i}`);
        });

        for (const cScheme of ['light', 'dark'] as const) {
            const paletteColors = options[cScheme] || {},
                interpolated: Record<string, ColorType> = {},
                neutralColor = new Color(paletteColors?.neutralColor || ''),
                backgroundColor = new Color(
                    paletteColors?.backgroundColor || ''
                ),
                highlightColor = new Color(
                    paletteColors?.highlightColor || ''
                );

            colorScheme = cScheme;

            // Interpolate keys
            [3, 5, 10, 20, 40, 60, 80, 100].forEach((fraction): void => {
                interpolated[`neutralColor${fraction}`] = backgroundColor
                    .tweenTo(neutralColor, fraction / 100);
                interpolated[`highlightColor${fraction}`] = backgroundColor
                    .tweenTo(highlightColor, fraction / 100);
            });

            // Extended data colors per scheme
            (
                paletteColors?.colors ||
                (
                    // Unless the user has defined their own colors, the dark
                    // scheme will override some of the default colors to better
                    // fit a dark background. If the user has defined their own
                    // colors, we assume they know what they're doing and won't
                    // override them.
                    cScheme === 'dark' && !options.colors ?
                        defaultDarkOverrideColors : []
                )
            ).forEach((color, i): void => {
                if (color) {
                    addKebab(color, `color${i}`);
                }
            });

            // The rest are stored as named properties
            objectEach(paletteColors, addKebab);
            objectEach(interpolated, addKebab);

            // Default to the light scheme, the dark scheme doesn't define
            // all colors.
            if (cScheme === 'light') {
                extend(cssVars.dark, cssVars.light);
            }
        }

        // Add a style tag to the chart renderer box
        const defs = renderer.defs.element,
            specifier = hasSpecificPalette ?
                `*[data-highcharts-chart="${renderer.chartIndex}"]` :
                '',
            style: HTMLStyleElement = defs
                .querySelector('style.highcharts-palette') ||
                renderer.box.ownerDocument.createElement('style');

        if (!style.parentNode) {
            style.nonce = 'highcharts';
            style.className = 'highcharts-palette';
            defs.appendChild(style);
        }

        style.textContent = getStyles(specifier, cssVars);
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
        const renderTo = this.renderer.box.parentElement,
            chart = charts?.[this.renderer.chartIndex];

        options = merge(true, this.options, options);

        if (chart) {
            chart.options.palette = options;
        }

        // The data colors. The legacy chart.options.colors overrides palette.
        this.dataColors = (options.colors || defaultColors).map(
            (c, i): ColorType => `var(--highcharts-color-${i})`
        );

        if (options.injectCSS !== false) {
            this.injectCSS(options);
        }

        if (renderTo) {
            if (
                isString(options.colorScheme) &&
                ['light', 'dark', 'inherit'].includes(options.colorScheme)
            ) {
                renderTo.style.colorScheme = options.colorScheme;
            } else {
                renderTo.style.removeProperty('color-scheme');
            }
        }
    }

}
