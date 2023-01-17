/* *
 * Stamen provider, used for tile map services
 * */

'use strict';

import type ProviderDefinition from '../ProviderDefinition';

import U from '../../Core/Utilities.js';

const {
    error
} = U;

export default class Stamen implements ProviderDefinition {
    subdomains = ['a', 'b', 'c', 'd'];

    themes = {
        toner: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png',
        terrain: 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png',
        watercolor: 'https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png'
    };

    initialProjectionName = 'WebMercator';

    credits = {
        watercolor: `\u00a9 Map tiles by <a href="https://stamen.com">Stamen Design</a>,
        under <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>.
        Data by <a href="https://openstreetmap.org">OpenStreetMap</a>, under
        <a href="https://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>`,
        standard: `\u00a9 Map tiles by <a href="https://stamen.com">Stamen Design</a>,
        under <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>.
        Data by <a href="https://openstreetmap.org">OpenStreetMap</a>, under
        <a href="https://www.openstreetmap.org/copyright">ODbL</a>`
    };

    getCredits(theme: string | undefined): string {
        if (theme === 'watercolor') {
            return this.credits.watercolor;
        }
        return this.credits.standard;
    }

    getURL(
        subdomain?: string | undefined,
        theme?: string | undefined
    ): string {
        const { themes, subdomains } = this;
        let chosenTheme: string,
            chosenSubdomain: string;

        // Check for themes
        if (
            (theme && !Object.prototype.hasOwnProperty.call(themes, theme)) ||
            !theme
        ) {
            if (theme) {
                error(
                    'Missing option: Tiles provider theme cannot be reached, ' +
                    'using standard provider theme.',
                    false
                );
            }
            chosenTheme = 'toner';
        } else {
            chosenTheme = theme;
        }

        // Check for subdomains
        if ((subdomain && subdomains.indexOf(subdomain) === -1) ||
            !subdomain
        ) {
            if (subdomain) {
                error(
                    'Missing option: Tiles provider subdomain cannot be ' +
                    'reached, using default provider subdomain.',
                    false
                );
            }
            chosenSubdomain = subdomains[0];
        } else {
            chosenSubdomain = subdomain;
        }

        const url = themes[chosenTheme as keyof typeof themes]
            .replace('{s}', chosenSubdomain);

        return url;
    }

    getProjectionName(): String {
        return this.initialProjectionName;
    }
}
