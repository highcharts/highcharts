/* *
 *
 *  (c) 2009-2025 Highsoft AS
 *
 *  Accessibility module for Highcharts
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

// Types
import type Chart from '../Core/Chart/Chart';
import type { Options } from '../Core/Options';
import type { A11yTopLevelOptions } from './A11yOptions';

// Imports
import {
    getChartDescriptionInfo,
    getChartDetailedInfo,
    type ChartDescriptionInfo,
    type ChartDetailedInfo,
    type A11yModel
} from './ChartInfo.js';
import { ProxyProvider } from './ProxyProvider.js';
import D from '../Core/Defaults.js';
const { defaultOptions } = D;
import defaultOptionsA11y from './A11yDefaults.js';
import T from '../Core/Templating.js';
const { format } = T;
import AST from '../Core/Renderer/HTML/AST.js';
import G from '../Core/Globals.js';
const { composed, doc, win } = G;
import U from '../Core/Utilities.js';
const {
    addEvent,
    attr,
    createElement,
    error,
    fireEvent,
    merge,
    pushUnique
} = U;

// Declarations
declare module '../Core/Chart/ChartBase' {
    interface ChartBase {
        a11y?: A11y;
        needsA11yStatusCheck?: boolean;
    }
}

/**
 * Efficiently remove all child elements of a given element.
 * @internal
 */
function clearElement(el: HTMLElement): void {
    while (el.firstChild) {
        el.lastChild?.remove();
    }
}


/**
 * The A11y class - collecting accessibility related logic for a chart.
 * @internal
 */
class A11y {
    private chartDescriptionInfo!: ChartDescriptionInfo;
    private chartDetailedInfo?: ChartDetailedInfo;
    private model?: A11yModel;
    private proxyProvider!: ProxyProvider;
    private eventRemovers: Array<Function> = [];
    private focusIndicator: HTMLElement;
    private showFocus = false;
    private removeFocusResizer?: Function;
    private autoDescEl?: HTMLElement;


    /**
     * Init the class. Called on chart init, and on chart updates.
     *
     * Chart option updates, or data changes that cause model changes, will
     * cause re-init of the class. Regular data changes will not (so we can
     * support live data without messing up focus etc).
     */
    constructor(public chart: Chart) {
        const a11yOptions = chart.options.a11y as A11yTopLevelOptions;

        // Hide chart graphics from assistive tech
        attr(chart.scrollablePlotArea?.parentDiv || chart.container, {
            role: 'presentation',
            'aria-hidden': true
        });
        chart.renderer.box.removeAttribute('role');
        chart.renderer.box.removeAttribute('aria-label');

        this.proxyProvider = new ProxyProvider(
            chart, ['first', 'ordered']);

        // Init focus indicator
        const focusGroup = this.proxyProvider.addGroup(
            'focus-indicator', 'first'
        );
        focusGroup.style.opacity = '1';
        this.focusIndicator = doc.createElement('div');
        this.focusIndicator.className = 'hc-a11y-focus-indicator';
        focusGroup.appendChild(this.focusIndicator);

        // Visually show focus only when keyboard navigating
        this.eventRemovers.push(
            addEvent(doc, 'keydown', (): unknown => (this.showFocus = true)),
            addEvent(doc, 'mousedown', (): unknown => (this.showFocus = false))
        );

        // Create basic description container & content
        const i = this.chartDescriptionInfo = getChartDescriptionInfo(chart),
            overlayElements = a11yOptions.chartDescriptionSection
                ?.positionOnChart,
            // Utility function to add content in description group
            addDescContent = (
                proxyElType: keyof HTMLElementTagNameMap, className: string,
                content?: string, targetEl?: HTMLElement|SVGElement
            ): HTMLElement|undefined => {
                if (!content) {
                    return;
                }
                if (overlayElements && targetEl) {
                    return this.proxyProvider.addTouchableProxy(
                        'description', targetEl, proxyElType, content, className
                    );
                }
                return this.proxyProvider.addSROnly(
                    'description', proxyElType, content, className, void 0,
                    targetEl
                );
            };

        this.proxyProvider.addGroup('description', 'first');
        addDescContent(
            i.headingLevel, 'hc-title', i.chartTitle, chart.title?.element
        );
        addDescContent(
            'p', 'hc-subtitle', i.chartSubtitle, chart.subtitle?.element
        );
        addDescContent('p', 'hc-author-description', i.description);
        // Placeholder auto desc to be updated on render
        this.autoDescEl = addDescContent('div', 'hc-auto-description', '...');

        // Add further proxy groups based on the order
        (a11yOptions.order || []).forEach((groupName): void => {
            const action = {

                credits: (): void => {
                    const credOptions = chart.options.credits;
                    if (credOptions?.enabled && credOptions?.text) {
                        this.proxyProvider.addGroup('credits', 'ordered');
                        const href = credOptions.href;
                        this.proxyProvider.addTouchableProxy(
                            'credits', chart.credits?.element, href ? 'a' : 'p',
                            credOptions.text, 'hc-a11y-credits',
                            href ? { href } : void 0
                        );
                    }
                },

                menu: this.addMenuProxy.bind(this),

                data: (): void => {
                    /* Placeholder */
                    // Set up the container - delete it in update() if it's a
                    // summary model. Otherwise in update(), add the content.
                },

                legend: (): void => {
                    /* Placeholder */
                    // Remember scrollable legend. Proxies must maybe update
                    // positions on scroll? Check if built in ResizeObserver
                    // already handles it when making touchable proxies.
                },

                breadcrumbs: (): void => { /* Placeholder */ },

                zoom: (): void => {
                    /* Placeholder */
                    // map zoom buttons, reset zoom button
                },

                navigator: (): void => {
                    /* Placeholder */
                    // Needs kbd nav for the buttons, or maybe sliders?
                },

                rangeSelector: (): void => { /* Placeholder */ },

                stockTools: (): void => {
                    /* Placeholder */

                    // Stock tools should not be proxied, so just verify that we
                    // can make it accessible outside the chart container.
                    // Should not have to do much in the a11y module, maybe make
                    // changes directly in stock tools module?
                    // Can probably add the HTML before or after the ordered
                    // proxy section.
                }

            }[groupName as string];
            if (action) {
                action();
            } else {
                error(`Unsupported value "${groupName}" in option "a11y.order"`, false, chart);
            }
        });

        // Other TODO:
        // Anything else need a proxy group, or is it all a part of data?
        // Set up an announcer
        // Setup keyboard nav
    }


    /**
     * Update accessibility functionality for the chart.
     * Called on every chart render.
     */
    public update(): void {
        const chart = this.chart,
            curModel = this.getChartModel(chart);

        // If we change model, we should just re-init the whole a11y module
        if (this.model && curModel !== this.model) {
            this.destroy();
            this.chart.a11y = new A11y(chart);
            this.chart.a11y.update();
            return;
        }
        this.model = curModel;

        // Compute chart information for this update
        this.chartDetailedInfo = getChartDetailedInfo(chart, curModel);
        const eventContext = {
            chartDescriptionInfo: this.chartDescriptionInfo,
            chartDetailedInfo: this.chartDetailedInfo
        };

        fireEvent(chart, 'beforeA11yUpdate', eventContext);

        // Update auto desc content from chartDetailedInfo
        const autoDesc = this.chartDetailedInfo.chartAutoDescription;
        if (autoDesc && this.autoDescEl) {
            clearElement(this.autoDescEl);
            new AST(autoDesc).addToDOM(this.autoDescEl);
        } else {
            this.autoDescEl?.remove();
        }

        // Role="application" yes/no
        // Data container contents should be updated here, but don't delete the
        // role="app", keep focus.

        // Clip path proxies etc? Make the proxy shape = the data shape.

        // What if drilldown -> less data -> different model?
        // Always complex model with drilldown (unless forced through options)?

        // Todo: Also update positions for series.animateFinished.

        this.proxyProvider.updatePositions();
        fireEvent(chart, 'afterA11yUpdate', eventContext);
    }


    /**
     * Set the focus indicator to a given element, making it clear that this
     * element is focused.
     *
     * Styles can be overridden by CSS.
     */
    public setFocusIndicator(el: SVGElement | HTMLElement): void {
        if (this.removeFocusResizer) {
            this.removeFocusResizer();
        }
        const setSize = (): void => {
                const bbox = el.getBoundingClientRect(),
                    offsetEl = this.focusIndicator
                        .parentElement?.getBoundingClientRect(),
                    margin = 4; // Accounting for border & outline + some space
                if (offsetEl) {
                    Object.assign(this.focusIndicator.style, {
                        left: bbox.x - offsetEl.x - margin + 'px',
                        top: bbox.y - offsetEl.y - margin + 'px',
                        width: bbox.width + 2 * margin + 'px',
                        height: bbox.height + 2 * margin + 'px'
                    });
                }
            },
            resizeObserver = new ResizeObserver(setSize);
        resizeObserver.observe(el);
        this.removeFocusResizer = (): void => resizeObserver.disconnect();
        this.focusIndicator.style.display = this.showFocus ? 'block' : 'none';
        setSize();
    }


    /**
     * Make sure the focus indicator is hidden.
     */
    public hideFocus(): void {
        this.focusIndicator.style.display = 'none';
    }


    /**
     * Helper function to determine the correct interaction model for the chart.
     */
    private getChartModel(chart: Chart): A11yModel {
        if (chart.options.a11y?.model) {
            return chart.options.a11y.model;
        }
        if (
            chart.pointCount < 4 &&
            (
                chart.options.tooltip?.enabled === false ||
                chart.series.every((s): boolean =>
                    s.options.enableMouseTracking === false
                )
            )
        ) {
            return 'summary';
        }
        if (chart.pointCount < 16) {
            return 'list';
        }
        return 'application';
    }


    /**
     * Add the menu proxy group.
     */
    private addMenuProxy(): void {
        const chart = this.chart,
            menuOptions = chart.options.exporting,
            group = chart.exporting?.group;

        if (menuOptions?.enabled !== false && group) {
            const localEventRemovers: Function[] = [],
                menuGroup = this.proxyProvider.addGroup('menu', 'ordered'),
                // The actual menu button
                menuBtn = this.proxyProvider.addTouchableProxy(
                    'menu', (
                        (chart.scrollablePlotArea?.fixedDiv || group.element)
                            .querySelector('.highcharts-contextbutton') ||
                        group.element) as SVGElement, 'button',
                    menuOptions?.buttons?.contextButton.text ||
                    format(chart.options.lang.contextButtonTitle, chart, chart),
                    'hc-a11y-menu-button', { 'aria-expanded': false }
                ).firstChild as HTMLButtonElement,
                // Make a new list element within the proxy group for the items
                ulProxy = createElement(
                    'ul', { role: 'list' },
                    { display: 'none', listStyle: 'none' }, menuGroup, true
                );

            this.eventRemovers.push(
                addEvent(chart, 'exportMenuShown', (): void => {
                    const contextMenuEl = chart.exporting?.contextMenuEl;
                    attr(menuBtn, 'aria-expanded', 'true');
                    ulProxy.style.display = 'block';
                    localEventRemovers.forEach((remover): void => remover());
                    clearElement(ulProxy);
                    (contextMenuEl?.querySelectorAll('li') || [])
                        .forEach((li): void => {
                            const container = createElement(
                                'li', void 0, void 0, ulProxy, true
                            );
                            this.proxyProvider.addTouchableProxy(
                                'menu', li, 'button', li.textContent || '',
                                'hc-a11y-menu-item', void 0, container
                            );
                        });
                    localEventRemovers.push(
                        addEvent(ulProxy, 'mouseenter', (): void =>
                            contextMenuEl &&
                            clearTimeout(contextMenuEl.hideTimer)
                        ),
                        addEvent(ulProxy, 'mouseleave', (): unknown =>
                            contextMenuEl && (contextMenuEl.hideTimer =
                                win.setTimeout(contextMenuEl.hideMenu, 500))
                        ),
                        // Auto hide menu when tabbing out of it
                        addEvent(
                            ulProxy, 'focusout', (e: FocusEvent): unknown =>
                                e.relatedTarget && !ulProxy
                                    .contains(e.relatedTarget as HTMLElement) &&
                                contextMenuEl?.hideMenu()
                        ),
                        // ESC: close menu, set focus to button (if was in menu)
                        addEvent(doc, 'keydown', (e: KeyboardEvent): void => {
                            if (
                                e.key === 'Escape' && chart.exporting?.openMenu
                            ) {
                                const f = menuGroup.contains(doc.activeElement);
                                contextMenuEl?.hideMenu();
                                if (f) {
                                    menuBtn.focus();
                                }
                            }
                        })
                    );
                }),
                addEvent(chart, 'exportMenuHidden', (): void => {
                    attr(menuBtn, 'aria-expanded', 'false');
                    ulProxy.style.display = 'none';
                })
            );
        }
    }


    /**
     * Destructor - remove traces of the a11y module
     * (e.g. HTML elements, event handlers).
     */
    public destroy(): void {
        const chart = this.chart;
        this.removeFocusResizer?.();
        this.focusIndicator?.remove();
        this.proxyProvider?.destroy();
        delete chart.a11y;

        // Remove event handlers
        this.eventRemovers.forEach((remover): void => remover());

        // Unhide chart SVG
        chart.renderer?.boxWrapper.attr({
            role: 'img',
            'aria-label': this.chartDescriptionInfo
                .chartTitle.replace(/</g, '&lt;')
        });
        const container = chart.scrollablePlotArea?.parentDiv ||
            chart.container;
        container.removeAttribute('role');
        container.removeAttribute('aria-hidden');
    }
}


namespace A11y {

    /**
     * Composition for A11y functionality
     * @internal
     */
    export function compose(ChartClass: typeof Chart): void {
        if (pushUnique(composed, 'A11y.A11y')) {
            merge(
                true,
                defaultOptions,
                defaultOptionsA11y
            );

            addEvent(ChartClass, 'init', function (): void {
                this.needsA11yStatusCheck = true;
            });

            addEvent(ChartClass, 'render', function (): void {
                if (this.needsA11yStatusCheck) {
                    this.needsA11yStatusCheck = false;
                    // Handle legacy module
                    if (this.a11yDirty) {
                        error(
                            'The "accessibility.js" module has been replaced ' +
                            'by the "a11y.js" module. These should not be ' +
                            'used together.', false, this
                        );
                        return;
                    }
                    if (
                        this.options.a11y?.enabled === false ||
                        this.renderer.forExport
                    ) {
                        this.a11y?.destroy();
                    } else {
                        this.a11y = this.a11y || new A11y(this);
                    }
                }
                this.a11y?.update();
            });

            // Re-init module on all chart updates
            addEvent(ChartClass, 'update', function (
                e: { options: Options }
            ): void {
                const newOptions = e.options.a11y;
                if (newOptions) {
                    merge(true, this.options.a11y, newOptions);
                }
                this.a11y?.destroy();
                this.needsA11yStatusCheck = true;
            });

            addEvent(ChartClass, 'destroy', function (): void {
                this.a11y?.destroy();
            });

            // Add stylesheet (only once per page)
            const css = new CSSStyleSheet();
            css.replaceSync(`
            .hc-a11y-focus-indicator {
                position: absolute;
                display: none;
                z-index: 1000;
                pointer-events: none;
                border: 2px solid #000;
                border-radius: 3px;
                outline: 2px solid #fff;
                box-sizing: border-box;
            }
            .hc-a11y-proxy-section {
                position: absolute;
                margin: 0;
                padding: 0;
                border: 0;
            }
            .hc-a11y-proxy-container {
                position: relative;
                top: 0;
                left: 0;
                z-index: 20;
                padding: 0;
                margin: -1px;
                width: 1px;
                height: 1px;
                white-space: nowrap;
                opacity: 0;
                border: 0;
                ol, ul, li {
                    list-style-type: none;
                }
            }
            .hc-a11y-sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                margin: -1px;
                overflow: hidden;
                white-space: nowrap;
                clip: rect(0 0 0 0);
                clip-path: inset(50%);
            }`);
            doc.adoptedStyleSheets.push(css);
        }
    }
}

export default A11y;
