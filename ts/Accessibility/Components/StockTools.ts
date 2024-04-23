'use strict';


/* *
 *
 *  Imports
 *
 * */

import AccessibilityComponent from '../AccessibilityComponent.js';
import KeyboardNavigationHandler from '../KeyboardNavigationHandler.js';
import Announcer from '../Utils/Announcer.js';
import U from '../../Core/Utilities.js';
const {
    attr,
    addEvent,
    fireEvent
} = U;

class StockToolsComponent extends AccessibilityComponent {

    /* *
     *
     *  Functions
     *
     * */

    public buttons: HTMLElement[] = [];
    public focusedButtonIndex: number = 0;
    public focusInPopup: boolean = false;
    public eventCallbacks: Function[] = [];

    public popupContainer: HTMLElement | undefined;
    public popupMutationObserver: MutationObserver | undefined;

    public announcer!: Announcer;

    public keyboardNavigationHandler!: KeyboardNavigationHandler;
    /**
     * Initialize the component
     */
    public init(): void {
        this.announcer = new Announcer(this.chart, 'polite');

        if (this.chart.stockTools && this.chart.stockTools.wrapper) {
            this.chart.stockTools?.wrapper.setAttribute(
                'aria-hidden',
                'false'
            );
        }
    }

    private setButtons(): void {
        const chart = this.chart,
            stockTools = chart.stockTools;

        if (!stockTools || !stockTools.visible || !stockTools?.toolbar) {
            return;
        }

        const buttons = stockTools.toolbar.querySelectorAll<HTMLElement>(
            'div > ul > li > button'
        );

        if (!buttons || !buttons.length) {
            return;
        }

        this.buttons = Array.from(buttons);

        const setButtonAsFocused = (i: number): void => {
            this.focusedButtonIndex = i;
        };

        this.buttons.forEach((button, i): void => {
            attr(button, {
                tabindex: -1
            });

            const boundFunction = setButtonAsFocused.bind(this, i);
            button.addEventListener('focus', boundFunction);
            this.eventCallbacks.push(
                (): void => button.removeEventListener('focus', boundFunction)
            );

        });
    }


    public onChartUpdate(): void {}

    public focusButton(): void {
        const button = this.buttons[this.focusedButtonIndex];

        if (button) {
            button.focus();
        }
    }

    private setPopupButtons(): void {
        if (this.popupContainer) {
            const popupButtons = this.popupContainer
                .querySelectorAll<HTMLElement>('button, .highcharts-popup-field');

            this.buttons = Array.from(popupButtons);
            this.buttons.forEach((button: HTMLElement): void => {
                attr(button, {
                    tabindex: -1
                });
            });
        }
    }


    private onShowPopup(e: any): void {
        this.focusInPopup = true;
        this.popupContainer = e.target.popup.container;

        this.setPopupButtons();
        this.focusButton();

        this.focusedButtonIndex = 0;

        if (this.popupMutationObserver) {
            this.popupMutationObserver.disconnect();
        }

        if (this.popupContainer) {
            this.popupMutationObserver =
                new MutationObserver(this.setPopupButtons.bind(this));

            this.popupMutationObserver.observe(this.popupContainer, {
                childList: true,
                subtree: true
            });
        }


    }

    private onHidePopup(): void {
        if (this.focusInPopup) {
            this.focusInPopup = false;

            this.popupContainer = void 0;

            if (this.popupMutationObserver) {
                this.popupMutationObserver.disconnect();
                this.popupMutationObserver = void 0;
            }

            this.setButtons();
            this.focusButton();
        }
    }

    private incrementFocusedButtonIndex(): void {
        this.focusedButtonIndex = Math.min(
            this.buttons.length - 1,
            this.focusedButtonIndex + 1
        );
    }

    private decrementFocusedButtonIndex(): void {
        this.focusedButtonIndex = Math.max(0, this.focusedButtonIndex - 1);
    }

    private onTabKeyPress(
        this: StockToolsComponent,
        _keyCode: number,
        e: KeyboardEvent
    ): number {
        const component = this;
        if (component.focusInPopup) {
            if (e.shiftKey) {
                component.decrementFocusedButtonIndex();
            } else {
                component.incrementFocusedButtonIndex();
            }

            component.focusButton();

            return component.keyboardNavigationHandler.response.success;
        }

        if (e.shiftKey) {
            return component.keyboardNavigationHandler.response.prev;
        }

        return component.keyboardNavigationHandler.response.next;
    }

    private onDirectionKeyPress(
        this: StockToolsComponent,
        keyCode: number,
        e: KeyboardEvent
    ): number {
        // TODO: shift or ctrl? or both?
        if (!this.focusInPopup || (this.focusInPopup && e.shiftKey)) {
            e.preventDefault();
            const component = this;
            const keys = this.keyCodes;

            if (keyCode === keys.left || keyCode === keys.up) {
                component.decrementFocusedButtonIndex();
            }
            if (keyCode === keys.right || keyCode === keys.down) {
                component.incrementFocusedButtonIndex();
            }

            component.focusButton();

            return component.keyboardNavigationHandler.response.success;
        }

        return this.keyboardNavigationHandler.response.noHandler;
    }

    private handleSubmenuButtonClick(
        this: StockToolsComponent,
        e: MouseEvent
    ): void {
        const childButton = e.target as HTMLElement;

        const submenu = childButton.parentElement?.closest<HTMLElement>(
            '.highcharts-submenu-wrapper'
        );

        this.setButtons();

        this.focusedButtonIndex = this.buttons.findIndex(
            (el): boolean => el.parentElement
                ?.classList.contains('highcharts-active') ?? false
        );

        const ariaLabel = childButton.getAttribute('aria-label');

        if (this.focusedButtonIndex !== -1 && ariaLabel) {
            this.buttons[this.focusedButtonIndex].setAttribute(
                'aria-label',
                ariaLabel
            );
        }

        this.focusButton();

        if (submenu) {
            submenu.dataset.open = 'false';
        }
    }

    private onEnterKeyPress(
        this: StockToolsComponent
    ): number {
        const component = this;
        if (!component.focusInPopup) {
            const button = component.buttons[component.focusedButtonIndex];

            if (button.classList.contains('highcharts-submenu-item-arrow')) {
                const submenu = button.parentElement
                    ?.querySelector<HTMLElement>(
                    '.highcharts-submenu-wrapper'
                );

                if (submenu) {
                    if (submenu.dataset.open === 'true') {
                        this.setButtons();

                        submenu.dataset.open = 'false';
                    } else {
                        const childButtons =
                        button.parentElement
                            ?.querySelectorAll<HTMLElement>(
                            '.highcharts-submenu-wrapper button'
                        );

                        if (childButtons?.length) {
                            const buttonsBefore = this.buttons.slice(
                                0,
                                this.focusedButtonIndex + 1
                            );

                            this.buttons = [
                                ...buttonsBefore,
                                ...Array.from(childButtons)
                            ];

                            childButtons.forEach((childButton): void => {
                                attr(childButton, {
                                    tabindex: -1
                                });

                                childButton.addEventListener(
                                    'click',
                                    this.handleSubmenuButtonClick.bind(this),
                                    { once: true }
                                );
                            });


                            submenu.dataset.open = 'true';
                        }
                    }

                    component.announcer.announce(
                        submenu.dataset.open === 'true' ?
                            'Submenu opened' :
                            'Submenu closed'
                    );
                }

                return this.keyboardNavigationHandler.response.noHandler;
            }
        }

        if (this.focusInPopup) {
            //  TODO: Fix this in popup code, remove this workaround
            if (
                document.activeElement?.tagName === 'BUTTON' &&
                (document.activeElement as HTMLElement).innerText === 'Add'
            ) {
                fireEvent(this.chart.navigationBindings, 'closePopup');

                return component.keyboardNavigationHandler.response.success;
            }
        }

        // Return noHandler as default to not cancel the default event
        return component.keyboardNavigationHandler.response.noHandler;
    }

    public getKeyboardNavigation(): KeyboardNavigationHandler {
        const keys = this.keyCodes;
        const kbdConfig: KeyboardNavigationHandler.Options = {
            keyCodeMap: [
                [
                    [keys.left, keys.right, keys.up, keys.down],
                    this.onDirectionKeyPress.bind(this)
                ],
                [
                    [keys.tab],
                    this.onTabKeyPress.bind(this)
                ],
                [
                    [keys.enter, keys.space],
                    this.onEnterKeyPress.bind(this)
                ]
            ],
            validate: (): boolean => !!(
                this.chart.stockTools &&
                    this.chart.stockTools.visible
            ),
            init: (dir: number): void => {
                const chart = this.chart;
                if (chart.navigationBindings) {
                    this.eventCallbacks.push(
                        addEvent(
                            chart.navigationBindings,
                            'showPopup',
                            this.onShowPopup.bind(this)
                        ),
                        addEvent(
                            chart.navigationBindings,
                            'closePopup',
                            this.onHidePopup.bind(this)
                        ),
                        addEvent(
                            chart.navigationBindings,
                            'selectButton',
                            (e): void => {
                                // Button is not the button
                                // but the parent element
                                if ('button' in e) {
                                    const btn = e.button
                                        .querySelector('button');
                                    if (btn.dataset.label) {
                                        this.announcer.announce(
                                            chart.langFormat(
                                                '{label} selected',
                                                {
                                                    label: btn.dataset.label
                                                }
                                            )
                                        );
                                    }
                                }
                            }
                        )
                    );
                }

                this.setButtons();

                if (dir === 1) {
                    this.focusedButtonIndex = 0;
                }

                if (dir === -1) {
                    this.focusedButtonIndex =
                        (this.buttons.length ? this.buttons.length - 1 : 0);
                }

                this.focusButton();

                // Setup submenu buttons
                chart.stockTools?.toolbar?.querySelectorAll<HTMLElement>(
                    '.highcharts-submenu-wrapper'
                ).forEach((submenu): void => {
                    submenu.dataset.open = 'false';
                });

            },
            terminate: (): void => {
                this.focusedButtonIndex = 0;
                this.focusInPopup = false;

                while (this.eventCallbacks.length > 0) {
                    const eventCleanup = this.eventCallbacks.pop();
                    if (eventCleanup) {
                        eventCleanup();
                    }
                }

                this.chart.stockTools?.toolbar?.querySelectorAll<HTMLElement>(
                    '.highcharts-submenu-wrapper'
                ).forEach((submenu): void => {
                    submenu.removeAttribute('data-open');
                });
            }
        };

        this.keyboardNavigationHandler = new KeyboardNavigationHandler(
            this.chart,
            kbdConfig
        );

        return this.keyboardNavigationHandler;
    }
}

export default StockToolsComponent;
