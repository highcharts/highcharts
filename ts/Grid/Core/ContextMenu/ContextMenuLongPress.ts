/* *
 *
 *  Grid Context Menu long-press polyfill (iOS)
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *  Authors:
 *  - Sebastian Bochan
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { MenuContext } from './ContextMenuTarget';

import Globals from '../Globals.js';
import { getMenuTargetElement } from './ContextMenuTarget.js';

/* *
 *
 *  Constants
 *
 * */

const LONG_PRESS_MS = 500;
const MOVE_THRESHOLD_PX = 10;
const MOVE_THRESHOLD_SQ = MOVE_THRESHOLD_PX * MOVE_THRESHOLD_PX;

const { win } = Globals;

/* *
 *
 *  Declarations
 *
 * */

export interface ContextMenuLongPressHost {

    /**
     * Resolves what the touch landed on, and only when a menu would open
     * there: the press suppresses the iOS callout, so it must not do that
     * for a touch that leads nowhere.
     */
    getContextFromTarget(target: EventTarget | null): MenuContext | undefined;

    /**
     * Whether the target is being edited, in which case the press belongs to
     * the editor rather than to a menu.
     */
    isTargetEditing?(context: MenuContext): boolean;

    /**
     * Opens the menu.
     */
    openContextMenu(
        context: MenuContext,
        clientX: number,
        clientY: number
    ): boolean;
}

interface LongPressState {
    calloutTarget: HTMLElement;
    clientX: number;
    clientY: number;
    context: MenuContext;
    timer: number;
}

/* *
 *
 *  Class
 *
 * */

/**
 * iOS long-press polyfill for context menus, on whatever surface the host
 * resolves. Safari fires no `contextmenu` event on long-press.
 */
export class ContextMenuLongPress {

    private readonly host: ContextMenuLongPressHost;

    private state?: LongPressState;

    private eventsTarget?: HTMLElement;

    public constructor(host: ContextMenuLongPressHost) {
        this.host = host;
    }

    public addEvents(target: HTMLElement): void {
        if (!Globals.isIos || this.eventsTarget) {
            return;
        }

        this.eventsTarget = target;
        target.addEventListener('touchstart', this.onTouchStart, {
            passive: true
        });
        target.addEventListener('touchmove', this.onTouchMove, {
            passive: true
        });
        target.addEventListener('touchend', this.onTouchEnd);
        target.addEventListener('touchcancel', this.onTouchEnd);
    }

    public removeEvents(): void {
        const target = this.eventsTarget;
        if (!target) {
            return;
        }

        target.removeEventListener('touchstart', this.onTouchStart);
        target.removeEventListener('touchmove', this.onTouchMove);
        target.removeEventListener('touchend', this.onTouchEnd);
        target.removeEventListener('touchcancel', this.onTouchEnd);

        if (this.state && target.contains(this.state.calloutTarget)) {
            this.cancelLongPress();
        }

        delete this.eventsTarget;
    }

    private readonly onTouchStart = (e: TouchEvent): void => {
        const target = e.target;

        if (e.touches.length !== 1) {
            this.cancelLongPress();
            return;
        }

        const context = this.host.getContextFromTarget(target);

        if (!context || this.host.isTargetEditing?.(context)) {
            this.cancelLongPress();
            return;
        }

        const calloutTarget = getMenuTargetElement(context.target);
        const control = target instanceof Element &&
            target.closest('input,select,textarea,button,option');

        // A native control is the user's to press, unless it is the very
        // element the menu was attached to.
        if (control && control !== calloutTarget) {
            this.cancelLongPress();
            return;
        }

        const touch = e.touches[0];

        this.cancelLongPress();
        calloutTarget.style.setProperty('-webkit-touch-callout', 'none');
        calloutTarget.style.setProperty('-webkit-user-select', 'none');
        calloutTarget.style.setProperty('user-select', 'none');

        const timer = win.setTimeout((): void => {
            if (!this.state || this.state.timer !== timer) {
                return;
            }

            this.state.timer = 0;
            this.host.openContextMenu(
                this.state.context,
                this.state.clientX,
                this.state.clientY
            );
        }, LONG_PRESS_MS);

        this.state = {
            calloutTarget,
            clientX: touch.clientX,
            clientY: touch.clientY,
            context,
            timer
        };
    };

    private readonly onTouchMove = (e: TouchEvent): void => {
        const state = this.state;
        if (!state || !e.touches.length) {
            return;
        }

        const touch = e.touches[0];
        const dx = touch.clientX - state.clientX;
        const dy = touch.clientY - state.clientY;

        if ((dx * dx + dy * dy) > MOVE_THRESHOLD_SQ) {
            this.cancelLongPress();
        }
    };

    private readonly onTouchEnd = (): void => {
        this.cancelLongPress();
    };

    private cancelLongPress(): void {
        const state = this.state;
        if (!state) {
            return;
        }

        if (state.timer) {
            win.clearTimeout(state.timer);
        }

        state.calloutTarget.style.removeProperty('-webkit-touch-callout');
        state.calloutTarget.style.removeProperty('-webkit-user-select');
        state.calloutTarget.style.removeProperty('user-select');
        delete this.state;
    }
}
