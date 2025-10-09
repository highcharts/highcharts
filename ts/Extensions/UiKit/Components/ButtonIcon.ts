/* *
 *
 * Highcharts UI Kit
 *
 * Copyright (c) 2025, Highsoft AS
 *
 * All rights reserved.
 * See LICENSE file for licensing details.
 *
 * Author: Jedrzej Ruta
 *
 */

import { addClass, appendEl, createEl, setAttr, applyStyle } from '../Dom';

/**
 *
 * Creates a simple button element with an icon inside.
 *
 * @param {string | HTMLImageElement | SVGElement} icon Icon for the button.
 * Can be either a SVG string, SVG or Img element, or a URL to an image.
 * @param {string} title Button title, used for tooltip and aria-label.
 * @param {boolean} backgroundImage If true, sets the icon as a background
 * image. Defaults to undefined.
 *
 * @return {HTMLButtonElement} The button icon component.
 */
export const ButtonIcon = (
    icon: string | HTMLImageElement | SVGElement,
    title: string,
    backgroundImage?: boolean
): HTMLButtonElement => {
    const button = createEl(
        'button', 'highcharts-uik-button highcharts-uik-button-icon'
    ) as HTMLButtonElement;

    if (
        icon instanceof HTMLImageElement ||
        (typeof icon === 'string' && /<svg\b[^>]*>/i.test(icon))
    ) {
        appendEl(button, icon);
    } else if (icon instanceof SVGElement) {
        appendEl(button, icon as unknown as HTMLElement);
    } else if (/\.(svg|png|jpe?g|gif|webp)$/i.test(icon)) {
        if (backgroundImage) {
            applyStyle(button, { backgroundImage: `url(${icon})` });
            addClass(button, 'highcharts-uik-button-icon-bg');
        } else {
            const image = createEl('img') as HTMLImageElement;
            setAttr(image, { 'src': icon, 'alt': title });

            appendEl(button, image);
        }
    }

    // Set title and aria-label for a11y and button tooltip
    setAttr(
        button,
        { 'title': title, 'ariaLabel': title }
    );

    return button;
};
