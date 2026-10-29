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
 *  - Dawid Draguła
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import Globals from '../Globals.js';

/* *
 *
 *  Constants
 *
 * */

const LONG_PRESS_MS = 500;
const MOVE_THRESHOLD_PX = 10;
const CONTROLS = 'input,select,textarea,button,option';

const { win } = Globals;

/* *
 *
 *  Declarations
 *
 * */

interface LongPressState {
    clientX: number;
    clientY: number;
    target: HTMLElement;
    timer: number;
}

/* *
 *
 *  Functions
 *
 * */

/**
 * Makes a long press on an element fire `contextmenu`, which Safari does not
 * do on iOS. Nothing about menus is involved: the synthetic event reaches
 * whatever listens for `contextmenu` exactly as a right-click would, so a
 * menu opens the same way on both, and a surface added later needs nothing
 * here.
 *
 * The press suppresses the native callout for as long as it lasts. That has
 * to be decided before anyone has had a chance to handle the event, so it
 * happens whether or not the press ends up opening anything.
 *
 * @param element
 * The element to watch. The event is dispatched on whatever inside it the
 * touch landed on.
 *
 * @param shouldArm
 * Whether a press on this part of the element is worth watching. Left out to
 * watch every press, at the cost of the browser's own text selection.
 *
 * @return
 * Callback that stops watching.
 */
export function addLongPressContextMenu(
    element: HTMLElement,
    shouldArm?: (target: HTMLElement) => boolean
): () => void {
    if (!Globals.isIos) {
        return (): void => void 0;
    }

    let state: LongPressState | undefined;

    const release = (): void => {
        if (!state) {
            return;
        }

        if (state.timer) {
            win.clearTimeout(state.timer);
        }

        const { style } = state.target;

        style.removeProperty('-webkit-touch-callout');
        style.removeProperty('-webkit-user-select');
        style.removeProperty('user-select');
        state = void 0;
    };

    const onTouchStart = (e: TouchEvent): void => {
        const { target } = e;

        release();

        if (e.touches.length !== 1 || !(target instanceof HTMLElement)) {
            return;
        }

        const control = target.closest(CONTROLS);

        // A native control is the user's to press, unless it is the very
        // element being watched.
        if (control && control !== element) {
            return;
        }

        if (shouldArm && !shouldArm(target)) {
            return;
        }

        const touch = e.touches[0];
        const { style } = target;

        style.setProperty('-webkit-touch-callout', 'none');
        style.setProperty('-webkit-user-select', 'none');
        style.setProperty('user-select', 'none');

        const timer = win.setTimeout((): void => {
            if (!state || state.timer !== timer) {
                return;
            }

            state.timer = 0;
            state.target.dispatchEvent(new MouseEvent('contextmenu', {
                bubbles: true,
                cancelable: true,
                clientX: state.clientX,
                clientY: state.clientY,
                view: win
            }));
        }, LONG_PRESS_MS);

        state = {
            clientX: touch.clientX,
            clientY: touch.clientY,
            target,
            timer
        };
    };

    const onTouchMove = (e: TouchEvent): void => {
        if (!state || !e.touches.length) {
            return;
        }

        const touch = e.touches[0];
        const dx = touch.clientX - state.clientX;
        const dy = touch.clientY - state.clientY;

        if ((dx * dx + dy * dy) > MOVE_THRESHOLD_PX * MOVE_THRESHOLD_PX) {
            release();
        }
    };

    element.addEventListener('touchstart', onTouchStart, { passive: true });
    element.addEventListener('touchmove', onTouchMove, { passive: true });
    element.addEventListener('touchend', release);
    element.addEventListener('touchcancel', release);

    return (): void => {
        element.removeEventListener('touchstart', onTouchStart);
        element.removeEventListener('touchmove', onTouchMove);
        element.removeEventListener('touchend', release);
        element.removeEventListener('touchcancel', release);
        release();
    };
}
