/* *
 *
 * Grid Menu abstract class
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 *  Authors:
 *  - Dawid Draguła
 *
 * */


'use strict';

/* *
 *
 *  Imports
 *
 * */

import Popup from './Popup.js';
import Globals from '../Globals.js';
import GridUtils from '../GridUtils.js';
import MenuButton from './MenuButton.js';

const { makeHTMLElement } = GridUtils;

/* *
 *
 *  Constants
 *
 * */

/**
 * Whether the keyboard is what is driving the menus, which decides if the
 * focused item is marked as such. Shared, so that a submenu opened with the
 * keyboard is marked from the moment it appears.
 */
let keyboardActive = false;

// Which of the two is driving is decided out here, because the key or the
// press that opens a menu lands before the menu exists. Both run in the
// capture phase, so the menu they open already reads the answer.
if (typeof document !== 'undefined') {
    document.addEventListener('keydown', (): void => {
        keyboardActive = true;
    }, true);

    document.addEventListener('pointerdown', (): void => {
        keyboardActive = false;
    }, true);
}


/* *
 *
 *  Class
 *
 * */

/**
 * A popup holding a keyboard-navigable list of buttons. Used by the context
 * menus and by the header toolbar popups.
 */
export abstract class Menu extends Popup {

    /* *
     *
     *  Properties
     *
     * */

    /**
     * The array of buttons in the context menu.
     */
    public readonly buttons: MenuButton[] = [];

    /**
     * The index of the focused button in the context menu.
     */
    public focusCursor: number = 0;

    /**
     * The items container element.
     */
    private itemsContainer?: HTMLElement;


    /* *
     *
     *  Methods
     *
     * */

    /**
     * Ensures that the items container element is created.
     *
     * @returns
     * The items container element.
     */
    public ensureItemsContainer(): HTMLElement | undefined {
        if (!this.content) {
            return;
        }

        if (this.itemsContainer) {
            return this.itemsContainer;
        }

        this.itemsContainer = makeHTMLElement('ul', {
            className: Globals.getClassName('menuContainer')
        }, this.content);

        return this.itemsContainer;
    }

    public override show(anchorElement?: HTMLElement): void {
        super.show(anchorElement);
        this.markKeyboardUse();
        this.buttons[0]?.focus();
    }

    public override hide(): void {
        for (const btn of this.buttons) {
            btn.destroy();
        }
        this.buttons.length = 0;

        this.itemsContainer?.remove();
        delete this.itemsContainer;
        super.hide();
    }

    /**
     * Adds a divider to the context menu.
     *
     * @returns
     * The divider element.
     */
    protected addDivider(): HTMLElement | undefined {
        if (!this.ensureItemsContainer()) {
            return;
        }

        return makeHTMLElement('li', {
            className: Globals.getClassName('menuDivider')
        }, this.itemsContainer);
    }

    protected override onClickOutside(event: MouseEvent): void {
        const target = event.target as Node;

        // A click in a submenu of this one is not a click outside, however
        // deep it sits.
        const queue: Popup[] = [];

        for (const button of this.buttons) {
            if (button.popup?.container) {
                queue.push(button.popup);
            }
        }

        while (queue.length) {
            const popup = queue.shift();

            if (!popup?.container) {
                continue;
            }

            if (popup.container.contains(target)) {
                return;
            }

            const popupButtons = (popup as {
                buttons?: MenuButton[];
            }).buttons;

            for (const button of popupButtons || []) {
                if (button.popup?.container) {
                    queue.push(button.popup);
                }
            }
        }

        super.onClickOutside(event);
    }

    /**
     * Marks the items as keyboard driven or not, which is what shows the
     * focused one. A menu opened with the pointer marks nothing: the item
     * under the pointer is already telling the user where they are.
     */
    private markKeyboardUse(): void {
        this.itemsContainer?.classList.toggle(
            Globals.getClassName('menuKeyboard'),
            keyboardActive
        );
    }

    protected override addEventListeners(): void {
        super.addEventListeners();

        const container = this.container;
        if (!container) {
            return;
        }

        const insideMouseDownListener = (event: MouseEvent): void => {
            event.stopPropagation();
            this.markKeyboardUse();
        };

        // After the document listener has had its say, and before
        // `onKeyDown`, which the menus override and return from early.
        const insideKeyDownListener = (): void => {
            this.markKeyboardUse();
        };

        container.addEventListener('mousedown', insideMouseDownListener);
        container.addEventListener('keydown', insideKeyDownListener, true);
        this.eventListenerDestroyers.push((): void => {
            container.removeEventListener(
                'mousedown',
                insideMouseDownListener
            );
            container.removeEventListener(
                'keydown',
                insideKeyDownListener,
                true
            );
        });
    }

    protected override onKeyDown(e: KeyboardEvent): void {
        super.onKeyDown(e);
        const len = this.buttons.length;
        const cursor = this.focusCursor;

        switch (e.key) {
            case 'ArrowUp':
            case 'ArrowLeft':
                e.preventDefault();
                this.buttons[Math.abs((cursor - 1 + len) % len)].focus();
                break;
            case 'ArrowDown':
            case 'ArrowRight':
                e.preventDefault();
                this.buttons[(cursor + 1) % len].focus();
                break;
        }
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default Menu;
