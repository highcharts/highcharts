/* *
 *
 * Highcharts UI Kit
 *
 * Copyright (c) 2025, Highsoft AS
 *
 * All rights reserved.
 * See LICENSE file for licensing details.
 *
 * Original author: Askel Eirik Johansson
 *
 */


import { createEl, appendEl, setAttr, addEvent } from './../Dom.js';

// Banner with support for variants
export const banner = (
    title: string,
    variant?: 'attention' | 'brand' | 'success' | 'danger'
): HTMLElement => {

    const bannerRemove = (el: HTMLElement) => (): void => {
        el.remove();
    };

    const bannerFade = (el: HTMLElement) => (): void => {
        if (el.parentElement) {
            el.parentElement.classList.add('fade-out');
        }
    };

    const banner = createEl('div', `highcharts-uik-banner ${variant || 'default'}`, title);
    const closeX = createEl('img', 'highcharts-uik-x-close');
    setAttr(closeX, { src: '../../assets/icons/x-close.svg' });
    const parent = appendEl(banner, closeX);

    addEvent(closeX, 'click', bannerFade(closeX));
    addEvent(parent, 'transitionend', bannerRemove(parent));

    return parent;
};

// Could also create smaller convinence wrappers, but has a slight overhead.
export const bannerAttention = (title: string): HTMLElement =>
    banner(title, 'attention');
export const bannerBrand = (title: string): HTMLElement =>
    banner(title, 'brand');
export const bannerSuccess = (title: string): HTMLElement =>
    banner(title, 'success');
export const bannerDanger = (title: string): HTMLElement =>
    banner(title, 'danger');
