/* *
 * Gaode provider, used for tile map services
 * */

'use strict';

import type ProviderDefinition from '../ProviderDefinition';
import { minMaxZoomObject } from '../ProviderDefinition';

import U from '../../Core/Utilities.js';

const {
    error
} = U;

export default class Gaode implements ProviderDefinition {
    subdomains = ['01', '02', '03', '04'];

    themes = {
        standard: 'https://webrd{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={zoom}',
        satelite: 'https://webst{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={zoom}'
    };

    initialProjectionName = 'WebMercator';

    credits = {
        standard: 'Map data \u00a92023 <a href="https://www.gaode.com/">Gaode</a>'
    };

    minZoom = 3;
    maxZoom = 9.99999;

    getCredits(theme: string | undefined): string {
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

    getProjectionName(): String {
        return this.initialProjectionName;
    }

    getMinMaxZoom(): minMaxZoomObject {
        return {
            minZoom: this.minZoom,
            maxZoom: this.maxZoom
        };
    }
}
