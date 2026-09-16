/* *
 *
 *  Grid Cell Context Menu long-press polyfill (iOS)
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

import type TableCell from '../Body/TableCell';

import CellContextMenuBuiltInActions from './CellContextMenuBuiltInActions.js';
import Globals from '../../Globals.js';

/* *
 *
 *  Constants
 *
 * */

const LONG_PRESS_MS = 500;
const MOVE_THRESHOLD_PX = 10;
const MOVE_THRESHOLD_SQ = MOVE_THRESHOLD_PX * MOVE_THRESHOLD_PX;

const { win, isIos } = Globals;

/* *
 *
 *  Declarations
 *
 * */

export interface CellContextMenuLongPressHost {
    getTableCellFromTarget(target: EventTarget | null): TableCell | undefined;
    openCellContextMenu(
        cell: TableCell,
        clientX: number,
        clientY: number
    ): boolean;
    isCellInEditMode(cell: TableCell): boolean;
}

interface LongPressState {
    timer: number;
    cell: TableCell;
    clientX: number;
    clientY: number;
    touchCalloutTarget: HTMLElement;
}

/* *
 *
 *  Class
 *
 * */

/**
 * iOS long-press polyfill for cell context menus.
 */
export class CellContextMenuLongPress {

    private readonly host: CellContextMenuLongPressHost;

    private state?: LongPressState;

    private eventsTarget?: HTMLElement;

    public constructor(host: CellContextMenuLongPressHost) {
        this.host = host;
    }

    public addEvents(target: HTMLElement): void {
        if (!isIos || this.eventsTarget) {
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

        if (this.state && target.contains(this.state.cell.htmlElement)) {
            this.cancelLongPress();
        }

        delete this.eventsTarget;
    }

    private readonly onTouchStart = (e: TouchEvent): void => {
        const target = e.target;

        if (
            e.touches.length !== 1 ||
            (
                target instanceof Element && (
                    target.closest('input,select,textarea,button,option') ||
                    target.closest(
                        '.' + Globals.getClassName('cellEditingContainer')
                    )
                )
            )
        ) {
            this.cancelLongPress();
            return;
        }

        const cell = this.host.getTableCellFromTarget(e.target);
        if (
            !cell ||
            this.host.isCellInEditMode(cell) ||
            !CellContextMenuBuiltInActions
                .resolveCellContextMenuItems(cell)
                .length
        ) {
            this.cancelLongPress();
            return;
        }

        const touch = e.touches[0];
        const touchCalloutTarget = cell.htmlElement;

        this.cancelLongPress();
        touchCalloutTarget.style.setProperty('-webkit-touch-callout', 'none');
        touchCalloutTarget.style.setProperty('-webkit-user-select', 'none');
        touchCalloutTarget.style.setProperty('user-select', 'none');

        const timer = win.setTimeout((): void => {
            if (!this.state || this.state.timer !== timer) {
                return;
            }

            this.state.timer = 0;
            this.host.openCellContextMenu(
                this.state.cell,
                this.state.clientX,
                this.state.clientY
            );
        }, LONG_PRESS_MS);

        this.state = {
            timer,
            cell,
            clientX: touch.clientX,
            clientY: touch.clientY,
            touchCalloutTarget
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

        state.touchCalloutTarget.style.removeProperty('-webkit-touch-callout');
        state.touchCalloutTarget.style.removeProperty('-webkit-user-select');
        state.touchCalloutTarget.style.removeProperty('user-select');
        delete this.state;
    }
}
