/* *
 *
 *  Grid Cell Editing class.
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Dawid Dragula
 *  - Sebastian Bochan
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */

import type CellRendererType from '../CellRendering/CellRendererType';
import type Column from '../../Core/Table/Column';
import type { DeepPartial } from '../../../Shared/Types';
import type { EditModeRenderer } from './CellEditMode';
import type { GridEvent } from '../../Core/GridUtils';
import type Options from '../../Core/Options';
import type Table from '../../Core/Table/Table';
import type TableCell from '../../Core/Table/Body/TableCell';

import { defaultOptions as gridDefaultOptions } from '../../Core/Defaults.js';
import Globals from '../../Core/Globals.js';
import CellEditing from './CellEditing.js';
import CellRendererRegistry from '../CellRendering/CellRendererRegistry.js';
import GU from '../../Core/GridUtils.js';
import U from '../../../Core/Utilities.js';

const {
    makeHTMLElement
} = GU;

const {
    addEvent,
    merge,
    pushUnique
} = U;


/* *
 *
 *  Composition
 *
 * */

/**
 * Default options for the cell editing.
 */
export const defaultOptions: DeepPartial<Options> = {
    accessibility: {
        announcements: {
            cellEditing: true
        }
    },
    lang: {
        accessibility: {
            cellEditing: {
                editable: 'Editable.',
                announcements: {
                    started: 'Entered cell editing mode.',
                    edited: 'Edited cell value.',
                    cancelled: 'Editing canceled.',
                    notValid: 'Provided value is not valid.'
                }
            }
        }
    }
};


/**
 * Extends the grid classes with cell editing functionality.
 *
 * @param TableClass
 * The class to extend.
 *
 * @param TableCellClass
 * The class to extend.
 *
 * @param ColumnClass
 * The class to extend.
 */
export function compose(
    TableClass: typeof Table,
    TableCellClass: typeof TableCell,
    ColumnClass: typeof Column
): void {
    if (!pushUnique(Globals.composed, 'CellEditing')) {
        return;
    }

    merge(true, gridDefaultOptions, defaultOptions);

    addEvent(ColumnClass, 'afterInit', afterColumnInit);

    addEvent(TableClass, 'beforeInit', initTable);
    addEvent(TableCellClass, 'keyDown', onCellKeyDown);
    addEvent(TableCellClass, 'dblClick', onCellDblClick);
    addEvent(TableCellClass, 'afterRender', addEditableCellA11yHint);
    addEvent(TableCellClass, 'startedEditing', function (): void {
        announceA11yUserEditedCell(this, 'started');
    });

    addEvent(
        TableCellClass,
        'stoppedEditing',
        function (this: TableCell, e: AnyRecord): void {
            if (e.submit) {
                this.column.options.cells?.events?.afterEdit?.call(this);
            }
            announceA11yUserEditedCell(
                this,
                e.submit ? 'edited' : 'cancelled'
            );
        }
    );

    addEvent(
        TableCellClass,
        'afterEditValue',
        function (this: TableCell): void {
            this.column.options.cells?.events?.afterEdit?.call(this);
            announceA11yUserEditedCell(
                this,
                'edited'
            );
        }
    );
}

/**
 * Callback function called before table initialization.
 */
function initTable(this: Table): void {
    this.cellEditing = new CellEditing(this);
}

/**
 * Creates the edit mode renderer for the column.
 *
 * @param column
 * The column to create the edit mode renderer for.
 */
function createEditModeRenderer(column: Column): EditModeRendererType {
    const editModeOptions = column.options.cells?.editMode;
    const selectedEditModeRendererTypeName =
        editModeOptions?.renderer?.type;
    const viewRendererTypeName =
        column.options?.cells?.renderer?.type || 'text';

    if (selectedEditModeRendererTypeName) {
        return new CellRendererRegistry.types[
            selectedEditModeRendererTypeName
        ](column, editModeOptions?.renderer || {});
    }

    const ViewRendererType =
        CellRendererRegistry.types[viewRendererTypeName] ||
        CellRendererRegistry.types.text;

    let editModeRendererTypeName =
        ViewRendererType.defaultEditingRenderer;


    if (typeof editModeRendererTypeName !== 'string') {
        editModeRendererTypeName =
            editModeRendererTypeName[column.dataType] || 'textInput';
    }

    return new CellRendererRegistry.types[editModeRendererTypeName](
        column,
        editModeRendererTypeName === viewRendererTypeName ? merge(
            column.options.cells?.renderer,
            { disabled: false }
        ) || {} : {}
    );
}

/**
 * Callback function called after column initialization.
 */
function afterColumnInit(this: Column): void {
    const { options } = this;

    if (options?.cells?.editMode?.enabled) {
        this.editModeRenderer = createEditModeRenderer(this);
    }
}

/**
 * Callback function called when a key is pressed on a cell.
 *
 * @param e
 * The event object.
 */
function onCellKeyDown(
    this: TableCell,
    e: GridEvent<TableCell, KeyboardEvent>
): void {
    if (
        e.originalEvent?.key !== 'Enter' ||
        !this.column.editModeRenderer
    ) {
        return;
    }

    this.row.viewport.cellEditing?.startEditing(this);
}

/**
 * Callback function called when a cell is double clicked.
 */
function onCellDblClick(this: TableCell): void {
    if (this.column.editModeRenderer) {
        this.row.viewport.cellEditing?.startEditing(this);
    }
}

/**
 * Add the 'editable' hint span element for the editable cell.
 */
function addEditableCellA11yHint(this: TableCell): void {
    const a11y = this.row.viewport.grid.accessibility;
    if (!a11y || this.a11yEditableHint?.isConnected) {
        return;
    }

    const editableLang = this.row.viewport.grid.options
        ?.lang?.accessibility?.cellEditing?.editable;

    if (!this.column.options.cells?.editMode?.enabled || !editableLang) {
        return;
    }


    this.a11yEditableHint = makeHTMLElement('span', {
        className: Globals.getClassName('visuallyHidden'),
        innerText: ', ' + editableLang
    }, this.htmlElement);
}

/**
 * Announce that the cell editing started.
 *
 * @param cell
 * The cell that is being edited.
 *
 * @param msgType
 * The type of the message.
 */
function announceA11yUserEditedCell(
    cell: TableCell,
    msgType: 'started'|'edited'|'cancelled'
): void {
    const a11y = cell.row.viewport.grid.accessibility;
    if (!a11y) {
        return;
    }

    const { options } = a11y.grid;
    if (!options?.accessibility?.announcements?.cellEditing) {
        return;
    }

    const lang = options?.lang?.accessibility?.cellEditing?.announcements;
    const msg = lang?.[msgType];
    if (!msg) {
        return;
    }

    a11y.announce(msg);
}


/* *
 *
 *  Declarations
 *
 * */

export type EditModeRendererType = Extract<CellRendererType, EditModeRenderer>;
export type EditModeRendererTypeName = EditModeRendererType['options']['type'];

/**
 * The options for the cell edit mode functionality.
 */
export interface ColumnEditModeOptions {
    /**
     * Whether to enable the cell edit mode functionality.
     */
    enabled?: boolean;

    /**
     * The edit mode renderer for the column.
     */
    renderer?: EditModeRendererType['options'];
}

/**
 * Accessibility options for the Grid cell editing functionality.
 */
export interface CellEditingLangA11yOptions {
    /**
     * An additional hint (a visually hidden span) read by the voice over
     * after the cell value.
     *
     * @default 'Editable.'
     */
    editable?: string;

    /**
     * Accessibility lang options for the cell editing announcements.
     */
    announcements?: {

        /**
         * The message when the cell editing started.
         *
         * @default 'Entered cell editing mode.'
         */
        started?: string;

        /**
         * The message when the cell editing ended.
         *
         * @default 'Edited cell value.'
         */
        edited?: string;

        /**
         * The message when the cell editing was cancelled.
         *
         * @default 'Editing cancelled.'
         */
        cancelled?: string;

        /**
         * The message when the cell value is not valid. It precedes the
         * error messages.
         *
         * @default 'Provided value is not valid.'
         */
        notValid?: string;
    }
}

declare module '../../Core/Table/Table' {
    export default interface Table {
        /**
         * The cell editing instance for the table.
         */
        cellEditing?: CellEditing;
    }
}

declare module '../../Core/Table/Column' {
    export default interface Column {
        /**
         * The edit mode renderer for the column.
         */
        editModeRenderer?: EditModeRendererType;
    }
}

declare module '../../Core/Table/Body/TableCell' {
    export default interface TableCell {
        /**
         * The HTML span element that contains the 'editable' hint for the cell.
         */
        a11yEditableHint?: HTMLSpanElement;
    }
}

declare module '../GridEvents' {
    interface CellEvents {
        /**
         * Callback function to be called after editing of cell value.
         */
        afterEdit?: CellEventCallback;
    }
}

declare module '../../Core/Accessibility/A11yOptions' {
    interface A11yAnnouncementsOptions {
        /**
         * Enable accessibility announcements for the cell editing.
         *
         * @default true
         */
        cellEditing?: boolean;
    }

    interface LangAccessibilityOptions {
        /**
         * Language options for the accessibility descriptions in cell editing.
         */
        cellEditing?: CellEditingLangA11yOptions;
    }
}

declare module '../../Core/Options' {
    interface ColumnCellOptions {
        /**
         * Whether to enabled the cell edit mode functionality. It allows to
         * edit the cell value in a separate input field that is displayed
         * after double-clicking the cell or pressing the Enter key.
         */
        editMode?: ColumnEditModeOptions;
    }
}

/**
 * The possible types of the edit message.
 */
export type EditMsgType = 'started' | 'edited' | 'cancelled';

/* *
 *
 *  Default Export
 *
 * */

export default {
    compose,
    defaultOptions
};
