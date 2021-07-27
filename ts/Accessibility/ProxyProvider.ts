/* *
 *
 *  (c) 2009-2021 Øystein Moseng
 *
 *  Proxy elements are used to shadow SVG elements in HTML for assistive
 *  technology, such as screen readers or voice input software.
 *
 *  The ProxyProvider keeps track of all proxy elements of the a11y module,
 *  and updating their order and positioning.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type {
    HTMLDOMElement
} from '../Core/Renderer/DOMElementType';
import type HTMLAttributes from '../Core/Renderer/HTML/HTMLAttributes';
import DOMElementProvider from './Utils/DOMElementProvider.js';
import ProxyElement from './ProxyElement.js';
import type { ProxyTarget, ProxyGroupTypes } from './ProxyElement';
import HTMLUtilities from './Utils/HTMLUtilities.js';
const {
    removeElement,
    removeChildNodes,
    setElAttrs
} = HTMLUtilities;
import ChartUtilities from './Utils/ChartUtilities.js';
const {
    unhideChartElementFromAT
} = ChartUtilities;
import U from '../Core/Utilities.js';
const {
    merge
} = U;


/* eslint-disable valid-jsdoc */

interface ProxyGroup {
    container: HTMLDOMElement;
    type: ProxyGroupTypes;
    proxyElements: ProxyElement[];
}

/**
 * Keeps track of all proxy elements and proxy groups.
 *
 * @private
 * @class
 */
class ProxyProvider {
    private beforeChartProxyPosContainer: HTMLDOMElement;
    private afterChartProxyPosContainer: HTMLDOMElement;
    private domElementProvider: Highcharts.DOMElementProvider;
    private groups: Record<string, ProxyGroup|undefined>;
    private groupOrder: string[];

    constructor(private chart: Highcharts.AccessibilityChart) {
        this.domElementProvider = new DOMElementProvider();
        this.groups = {};
        this.groupOrder = [];

        this.beforeChartProxyPosContainer = this.createProxyPosContainer('before');
        this.afterChartProxyPosContainer = this.createProxyPosContainer('after');

        this.update();
    }


    /**
     * Add a new proxy element to a group, proxying a target control.
     */
    public addProxyElement(
        groupKey: string,
        target: ProxyTarget,
        attributes?: HTMLAttributes
    ): ProxyElement {
        const group = this.groups[groupKey];
        if (!group) {
            throw new Error('ProxyProvider.addProxyElement: Invalid group key ' + groupKey);
        }

        const proxy = new ProxyElement(this.chart, target, group.type, attributes);

        group.container.appendChild(proxy.element);
        group.proxyElements.push(proxy);

        return proxy;
    }


    /**
     * Create a group that will contain proxy elements. The group order is
     * automatically updated according to the last group order keys.
     */
    public addGroup(groupKey: string, groupType: ProxyGroupTypes, attributes: HTMLAttributes): void {
        if (this.groups[groupKey]) {
            return;
        }

        const groupEl = this.domElementProvider.createElement(groupType);

        groupEl.className = 'highcharts-a11y-proxy-group-' + groupKey.replace(/\W/g, '-');

        this.groups[groupKey] = {
            container: groupEl,
            type: groupType,
            proxyElements: []
        };

        setElAttrs(groupEl, merge(attributes, { 'aria-hidden': false }));
        if (groupType === 'ul') {
            groupEl.style.listStyle = 'none';
            groupEl.setAttribute('role', 'list'); // Needed for safari/VO with list-style: none
        }

        this.updateGroupOrder(this.groupOrder);
    }


    /**
     * Update HTML attributes of a group.
     */
    public updateGroupAttrs(groupKey: string, attributes: HTMLAttributes): void {
        const group = this.groups[groupKey];
        if (!group) {
            throw new Error('ProxyProvider.updateGroupAttrs: Invalid group key ' + groupKey);
        }
        setElAttrs(group.container, attributes);
    }


    /**
     * Reorder the proxy groups.
     *
     * The group key "series" refers to the chart's data points / <svg> element.
     * This is so that the keyboardNavigation.order option can be used to
     * determine the proxy group order.
     */
    public updateGroupOrder(groupKeys: string[]): void {
        // Store so that we can update order when a new group is created
        this.groupOrder = groupKeys.slice();

        const seriesIx = groupKeys.indexOf('series');
        const beforeKeys = seriesIx > -1 ? groupKeys.slice(0, seriesIx) : groupKeys;
        const afterKeys = seriesIx > -1 ? groupKeys.slice(seriesIx + 1) : [];

        ['before', 'after'].forEach((pos): void => {
            const posContainer = this[
                pos === 'before' ?
                    'beforeChartProxyPosContainer' :
                    'afterChartProxyPosContainer'
            ];
            const keys = pos === 'before' ? beforeKeys : afterKeys;

            removeChildNodes(posContainer);

            keys.forEach((groupKey): void => {
                const group = this.groups[groupKey];
                if (group) {
                    posContainer.appendChild(group.container);
                }
            });
        });
    }


    /**
     * Remove all proxy elements in a group
     */
    public clearGroup(groupKey: string): void {
        const group = this.groups[groupKey];
        if (!group) {
            throw new Error('ProxyProvider.clearGroup: Invalid group key ' + groupKey);
        }
        removeChildNodes(group.container);
    }


    /**
     * Remove a group from the DOM and from the proxy provider's group list.
     * All child elements are removed.
     * If the group does not exist, nothing happens.
     */
    public removeGroup(groupKey: string): void {
        const group = this.groups[groupKey];
        if (group) {
            removeElement(group.container);
            delete this.groups[groupKey];
        }
    }


    /**
     * Update the position and order of all proxy groups and elements
     */
    public update(): void {
        this.updatePosContainerPositions();
        this.updateGroupOrder(this.groupOrder);
        this.updateProxyElementPositions();
    }


    /**
     * Update all proxy element positions
     */
    public updateProxyElementPositions(): void {
        Object.keys(this.groups).forEach(this.updateGroupProxyElementPositions.bind(this));
    }


    /**
     * Update a group's proxy elements' positions.
     * If the group does not exist, nothing happens.
     */
    public updateGroupProxyElementPositions(groupKey: string): void {
        const group = this.groups[groupKey];
        if (group) {
            group.proxyElements.forEach((el): void => el.refreshPosition());
        }
    }


    /**
     * Remove all added elements
     */
    public destroy(): void {
        this.domElementProvider.destroyCreatedElements();
    }


    // -------------------------- private ------------------------------------


    /**
     * Create and return a pos container element (the overall containers for
     * the proxy groups).
     */
    private createProxyPosContainer(classNamePostfix?: string): HTMLDivElement {
        const el = this.domElementProvider.createElement('div');
        el.className = 'highcharts-a11y-proxy-container' + (classNamePostfix ? '-' + classNamePostfix : '');
        return el;
    }


    /**
     * Update the DOM positions of the before/after proxy
     * positioning containers for the groups.
     */
    private updatePosContainerPositions(): void {
        const chart = this.chart;
        const rendererSVGEl = chart.renderer.box;
        chart.container.insertBefore(
            this.afterChartProxyPosContainer,
            rendererSVGEl.nextSibling
        );
        chart.container.insertBefore(
            this.beforeChartProxyPosContainer,
            rendererSVGEl
        );
        unhideChartElementFromAT(this.chart, this.afterChartProxyPosContainer);
        unhideChartElementFromAT(this.chart, this.beforeChartProxyPosContainer);
    }
}

export default ProxyProvider;
