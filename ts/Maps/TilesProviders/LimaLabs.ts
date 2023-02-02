/* *
 * Gaode provider, used for tile map services
 * */

'use strict';

import type ProviderDefinition from '../ProviderDefinition';

import U from '../../Core/Utilities.js';

const {
    error,
    pick
} = U;

export default class Gaode implements ProviderDefinition {
    subdomains = [''];

    themes = {
        standard: 'https://cdn.lima-labs.com/{zoom}/{x}/{y}.png?api=demo'
    };

    initialProjectionName = 'WebMercator';

    credits = {
        standard: 'Map data \u00a92023 <a href="https://maps.lima-labs.com/">LimaLabs</a>'
    };

    minZoom = 0;
    maxZoom = 20.99999;

    getCredits(theme: string | undefined): string {
        return pick(
            this.credits[theme as keyof typeof this.credits],
            this.credits['standard']
        );
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
            chosenTheme = 'standard';
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
}
