/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Sebastian Bochan
 *  - Wojciech Chmiel
 *  - Gøran Slettemark
 *  - Sophie Bremer
 *
 * */

'use strict';

import type CSSJSONObject from '../CSSJSONObject';
import type { DeepPartial } from '../../Shared/Types';
import type Layout from './Layout';

import Globals from '../Globals.js';
import Cell from './Cell.js';
import GUIElement from './GUIElement.js';
import U from '../../Core/Utilities.js';
import EditGlobals from '../EditMode/EditGlobals.js';
import { HTMLDOMElement } from '../../Core/Renderer/DOMElementType';

const {
    pick,
    defined,
    merge,
    objectEach,
    fireEvent
} = U;

/**
 * @internal
 **/
class Row extends GUIElement {
    /* *
    *
    *  Static Properties
    *
    * */

    public static setContainerHeight(
        rowContainer: HTMLDOMElement,
        height?: number | string
    ): void {
        if (height) {
            rowContainer.style.height = height + 'px';
        }
    }
    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs an instance of the Row class.
     *
     * @param {Layout} layout
     * Reference to the layout instance.
     *
     * @param {Row.Options} options
     * Options for the row.
     *
     * @param {HTMLElement} rowElement
     * The container of the row HTML element.
     */
    public constructor(
        layout: Layout,
        options: Row.Options,
        rowElement?: HTMLElement
    ) {
        super();

        this.layout = layout;
        this.cells = [];
        this.options = options;
        this.isVisible = true;

        // Get parent container
        const parentContainer =
            document.getElementById(options.parentContainerId || '') ||
            layout.container;


        const layoutOptions = (layout.options || {}),
            rowClassName = layoutOptions.rowClassName || '';

        this.container = this.getElementContainer({
            render: layout.board.guiEnabled,
            parentContainer: parentContainer,
            attribs: {
                id: options.id,
                className: Globals.classNames.row + ' ' +
                    rowClassName
            },
            element: rowElement,
            elementId: options.id,
            style: merge(layoutOptions.style, options.style)
        });

        // Init rows from options.
        if (this.options.cells) {
            this.setCells();
        }
    }

    /* *
    *
    *  Properties
    *
    * */

    /**
     * Reference to the layout instance.
     */
    public layout: Layout;

    /**
     * Array of the row cells.
     */
    public cells: Array<Cell>;

    /**
     * The row options.
     */
    public options: Row.Options;

    /**
     * The type of GUI element.
     */
    public readonly type = Globals.guiElementType.row;

    /**
     * HTML container of a GUIElement.
     */
    public container: HTMLDOMElement;

    /* *
    *
    *  Functions
    *
    * */

    /**
     * Set the row cells using cell options or cellClassName.
     */
    public setCells(): void {
        const row = this,
            cellClassName = (row.layout.options || {}).cellClassName || '',
            cellsElements = pick(
                row.options.cells,
                row.container && row.container.getElementsByClassName(
                    cellClassName
                )
            ) || [];

        let cellElement,
            i, iEnd;

        for (i = 0, iEnd = cellsElements.length; i < iEnd; ++i) {
            cellElement = cellsElements[i];
            row.addCell(
                row.layout.board.guiEnabled ? cellElement : { id: '' },
                cellElement instanceof HTMLElement ? cellElement : void 0
            );
        }
    }

    /**
     * Add a new Cell instance to the row cells array.
     *
     * @param {Cell.Options} [options]
     * Options for the row cell.
     *
     * @param {HTMLElement} [cellElement]
     * The container for a new cell HTML element.
     *
     * @return {Cell}
     * Returns the Cell object.
     */
    public addCell(
        options: Cell.Options,
        cellElement?: HTMLElement,
        index?: number
    ): Cell {
        const row = this,
            cell = new Cell(row, options, cellElement);

        if (!defined(index)) {
            row.cells.push(cell);
        } else {
            row.mountCell(cell, index);
        }

        // Set editMode events.
        if (row.layout.board.editMode) {
            row.layout.board.editMode.setCellEvents(cell);
        }

        return cell;
    }

    /**
     * Destroy the element, its container, event hooks
     * and inner cells.
     */
    public destroy(): void {
        const row = this;
        const { layout } = row;
        const board = row.layout.board;
        const editMode = board.editMode;

        // Destroy cells.
        if (row.cells) {
            // Copy to avoid problem with index when shifting array of cells during
            // the destroy.
            const rowCells = [...row.cells];
            for (let i = 0, iEnd = rowCells.length; i < iEnd; ++i) {
                if (rowCells[i]) {
                    rowCells[i].destroy();
                }
            }
        }

        if (row.layout) {
            row.layout.unmountRow(row);

            super.destroy();

            if (layout.rows?.length === 0) {
                layout.destroy();
            }
        }

        fireEvent(editMode, 'rowDestroyed', {
            target: row,
            board: board
        });
    }

    /**
     * Get the row's options.
     * @returns
     * The JSON of row's options.
     *
     * @internal
     *
     */
    public getOptions(): DeepPartial<Row.Options> {
        const row = this,
            cells = [];

        for (let i = 0, iEnd = row.cells.length; i < iEnd; ++i) {
            cells.push(row.cells[i].getOptions());
        }

        return {
            id: this.options.id,
            style: this.options.style,
            cells
        };
    }

    public setSize(
        height?: number | string
    ): void {
        Row.setContainerHeight(
            this.container as HTMLDOMElement,
            height
        );
    }

    // Get cell index from the row.cells array.
    public getCellIndex(
        cell: Cell
    ): number | undefined {
        for (let i = 0, iEnd = this.cells?.length; i < iEnd; ++i) {
            if (this.cells[i].id === cell.id) {
                return i;
            }
        }
    }

    // Add cell to the row.cells array and move cell container.
    public mountCell(
        cell: Cell,
        index: number = 0
    ): void {
        const row = this,
            nextCell = row.cells[index],
            prevCell = row.cells[index - 1];

        if (cell.container) {
            if (nextCell && nextCell.container) {
                nextCell.container.parentNode.insertBefore(
                    cell.container,
                    nextCell.container
                );
            } else if (prevCell && prevCell.container) {
                prevCell.container.parentNode.insertBefore(
                    cell.container,
                    prevCell.container.nextSibling
                );
            } else if (!prevCell && !nextCell && row.container) {
                row.container.appendChild(cell.container);
            }

            row.cells.splice(index, 0, cell);
            cell.row = row;
            setTimeout(():void => {
                fireEvent(row, 'cellChange', { row, cell });
            }, 0);
        }
    }

    // Remove cell from the row.cells array.
    public unmountCell(
        cell: Cell
    ): void {
        const cellIndex = this.getCellIndex(cell);

        if (defined(cellIndex)) {
            this.cells.splice(cellIndex, 1);
        }

        setTimeout(():void => {
            fireEvent(this, 'cellChange', { row: this, cell });
        }, 0);
    }

    public getVisibleCells(): Array<Cell> {
        const cells = [];

        for (let i = 0, iEnd = this.cells.length; i < iEnd; ++i) {
            if (this.cells[i].isVisible) {
                cells.push(this.cells[i]);
            }
        }

        return cells;
    }

    protected changeVisibility(
        setVisible: boolean = true,
        displayStyle?: string
    ): void {
        const row = this;

        super.changeVisibility(setVisible, displayStyle);

        // Change layout visibility if needed.
        if (!row.layout.getVisibleRows().length) {
            row.layout.hide();
        } else if (row.isVisible && !row.layout.isVisible) {
            row.layout.show();
        }
    }

    public show(): void {
        this.changeVisibility(true, 'flex');
    }

    public setHighlight(remove?: boolean): void {
        const classList = this.container.classList;
        const highlightClass = EditGlobals.classNames.rowContextHighlight;
        if (remove === true) {
            classList.remove(highlightClass);
        } else {
            classList.toggle(highlightClass, !remove);
        }
    }

    // Row can have cells below each others.
    // This method returns cells split into levels.
    public getRowLevels(): Array<Row.RowLevel> {
        const row = this,
            rowLevels: Record<string, Row.RowLevel> = {},
            rowLevelsArray: Array<Row.RowLevel> = [];

        let cell, cellOffsets;

        for (let k = 0, kEnd = row.cells.length; k < kEnd; ++k) {
            cell = row.cells[k];

            if (cell.isVisible) {
                cellOffsets = GUIElement.getOffsets(cell);

                if (!rowLevels[cellOffsets.top]) {
                    rowLevels[cellOffsets.top] = {
                        top: cellOffsets.top,
                        bottom: cellOffsets.bottom,
                        cells: []
                    };
                }

                if (rowLevels[cellOffsets.top].bottom < cellOffsets.bottom) {
                    rowLevels[cellOffsets.top].bottom = cellOffsets.bottom;
                }

                rowLevels[cellOffsets.top].cells.push(cell);
            }
        }

        objectEach(rowLevels, (value): void => {
            rowLevelsArray.push(value);
        });

        return rowLevelsArray;
    }

    // Get row level with additional info
    // on a specific Y position.
    public getRowLevelInfo(
        posY: number
    ): Row.RowLevelInfo|undefined {
        const rowLevels = this.getRowLevels();

        let rowLevelInfo;

        for (let i = 0, iEnd = rowLevels.length; i < iEnd; ++i) {
            if (rowLevels[i].top <= posY && rowLevels[i].bottom > posY) {
                rowLevelInfo = {
                    index: i,
                    rowLevels: rowLevels,
                    rowLevel: rowLevels[i]
                };
            }
        }

        return rowLevelInfo;
    }
}

namespace Row {
    /**
     * Options for the row.
     **/
    export interface Options {
        /**
         * A unique id for the row.
         **/
        id?: string;
        /**
         * Options controlling the edit mode for the cell.
         **/
        editMode?: {
            /**
             * Individual options for the toolbar items.
             **/
            toolbarItems?: {
                /**
                 * Options for the `destroy` toolbar item.
                 */
                destroy: {
                    enabled?: boolean;
                };
                /**
                 * Options for the `settings` toolbar item.
                 */
                drag: {
                    enabled?: boolean;
                };
                /**
                 * Options for the `settings` toolbar item.
                 */
                settings: {
                    enabled?: boolean;
                };
            }
        }
        /**
         * The id of the container element.
         **/
        parentContainerId?: string;
        /**
         * An array of cells to be added to the row.
         **/
        cells?: Array<Cell.Options>;
        /**
         * CSS styles for the row.
         **/
        style?: CSSJSONObject;
    }

    /**
     * @internal
     **/
    export interface RowLevel {
        top: number;
        bottom: number;
        cells: Array<Cell>;
    }

    /**
     * @internal
     **/
    export interface RowLevelInfo {
        index: number; // Level position in RowLevels Array
        rowLevels: Array<RowLevel>;
        rowLevel: RowLevel;
    }
}

export default Row;
