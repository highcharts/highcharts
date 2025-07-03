/* *
 *
 *  Grid Cell Editing class.
 *
 *  (c) 2020-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Dawid Dragula
 *  - Sebastian Bochan
 *
 * */


/* *
 *
 *  Imports
 *
 * */

import DataTable from '../../../Data/DataTable';
import TableCell from '../../Core/Table/Body/TableCell';


/* *
 *
 *  Interfaces
 *
 * */

/**
 * Interface for the edit mode content in a cell. It can be implemented by
 * different types of edit mode contents.
 */
export interface EditModeContent<
    E extends HTMLElement = HTMLElement
> {
    /**
     * Returns the main element of the edit mode content. In most cases it is an
     * input element used to edit the cell value.
     */
    getMainElement(): E;

    /**
     * Value of the edit mode cell content, parsed according to the column type.
     */
    readonly value: DataTable.CellType;

    /**
     * Raw value of the edit mode cell content, in a string format.
     */
    readonly rawValue: string;

    /**
     * Destroys the edit mode content, removing all event listeners
     * and references to the DOM elements.
     */
    destroy(): void;

    /**
     * Blur event handler for the edit mode content that can be overwritten in
     * the Edit Mode Class.
     *
     * @param e
     * The focus event that triggered the blur.
     */
    blurHandler?: (e: FocusEvent) => void;

    /**
     * Key down event handler for the edit mode content that can be overwritten
     * in the Edit Mode Class.
     *
     * @param e
     * The keyboard event that triggered the key down.
     */
    keyDownHandler?: (e: KeyboardEvent) => void;

    /**
     * Change event handler for the edit mode content that can be
     * overwritten in the Edit Mode Class.
     *
     * @param e
     * The event that triggered the change.
     */
    changeHandler?: (e: Event) => void;

    /**
     * Indicates whether the edit mode should finish after a change event.
     */
    readonly finishAfterChange: boolean;
}

/**
 * Interface for rendering edit mode content in a cell. It allows the view
 * renderers to be used in the edit mode of a cell.
 */
export interface EditModeRenderer {
    /**
     * Renders the edit mode content for a given cell.
     *
     * @param cell
     * The cell to render the edit mode content for.
     *
     * @param parent
     * Optional parent element to append the rendered content to. If not
     * provided, the content will be rendered in the cell's main element.
     */
    render(cell: TableCell, parent?: HTMLElement): EditModeContent;
}
