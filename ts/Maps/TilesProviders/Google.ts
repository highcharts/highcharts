/* *
 * Google provider, used for tile map services
 * */

'use strict';

import type ProviderDefinition from '../ProviderDefinition';

import U from '../../Core/Utilities.js';

const {
    error
} = U;

export default class Google implements ProviderDefinition {
    themes = {
        standard: 'https://www.google.com/maps/vt?pb=!1m5!1m4!1i{zoom}!2i{x}!3i{y}!4i256!2m3!1e0!2sm!3i342009817!3m9!2sen-US!3sCN!5e18!12m1!1e47!12m3!1e37!2m1!1ssmartmaps!4e0&token=32965'
    };

    initialProjection = '';

    getURL(
        subdomain?: string | undefined,
        theme?: string | undefined
    ): string {
        const { themes } = this;
        let chosenTheme: string;

        if (
            (theme && !Object.prototype.hasOwnProperty.call(themes, theme)) ||
            !theme
        ) {
            if (theme) {
                error(
                    'Missing option: Tiles provider theme cannot be reached,' +
                    'using standard provider theme.',
                    false
                );
            }
            chosenTheme = 'standard';
        } else {
            chosenTheme = theme;
        }

        const url = themes[chosenTheme as keyof typeof themes];

        return url;
    }
}
