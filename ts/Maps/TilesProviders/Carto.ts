/* *
 * Carto provider, used for tile map services
 * */

'use strict';

import type ProviderDefinition from '../ProviderDefinition';

import U from '../../Core/Utilities.js';

const {
    error
} = U;

export default class Carto implements ProviderDefinition {
    subdomains = ['a', 'b', 'c', 'd', 'e'];

    themes = {
        standard: 'https://{s}.basemaps.cartocdn.com/light_all/{zoom}/{x}/{y}.png',
        dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{zoom}/{x}/{y}.png'
    };

    initialProjection = '';

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
            error(13); // TO DO add new error that this theme does not exist
            chosenTheme = 'standard';
        } else {
            chosenTheme = theme;
        }

        // Check for subdomains
        if ((subdomain && subdomains.indexOf(subdomain) === -1) ||
            !subdomain
        ) {
            error(13); // TO DO add new error that this subdomain does not exist
            chosenSubdomain = subdomains[0];
        } else {
            chosenSubdomain = subdomain;
        }

        const url = themes[chosenTheme as keyof typeof themes]
            .replace('{s}', chosenSubdomain);

        return url;
    }
}
