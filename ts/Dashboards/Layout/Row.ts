/* *
 *
 *  (c) 2009 - 2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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
import type JSON from '../../Core/JSON';
import type Layout from './Layout.js';
import type Serializable from '../Serializable';

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
class Row extends GUIElement {
    /* *
    *
    *  Static Properties
    *
    * */

    public static fromJSON(
        json: Row.JSON,
        layout?: Layout
    ): (Row|undefined) {
        if (layout) {
            const options = json.options;

            let id = options.containerId || '';

            if (id && layout.copyId) {
                id = id + '_' + layout.copyId;
            }

            return new Row(
                layout,
                {
                    id: id,
                    parentContainerId:
                        (layout.container && layout.container.id) ||
                        options.parentContainerId,
                    cellsJSON: options.cells,
                    style: options.style
                }
            );
        }

        return void 0;
    }

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

        this.type = Globals.guiElementType.row;
        this.layout = layout;
        this.cells = [];
        this.options = options;
        this.isVisible = true;

        // Get parent container
        const parentContainer =
            document.getElementById(options.parentContainerId || '') ||
            layout.container;

        if (parentContainer) {
            const layoutOptions = (layout.options || {}),
                rowClassName = layoutOptions.rowClassName || '';

            this.setElementContainer({
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

            // Init rows from JSON.
            if (options.cellsJSON && !this.cells.length) {
                this.setCellsFromJSON(options.cellsJSON);
            }
        } else {
            // Error
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

    public setCellsFromJSON(
        json: Array<Cell.JSON>
    ): void {
        const row = this,
            componentsToMount = [];

        let cell,
            cellJSON;

        // Set cells.
        for (let i = 0, iEnd = json.length; i < iEnd; ++i) {
            cellJSON = json[i];
            cell = Cell.fromJSON({
                $class: cellJSON.$class,
                options: {
                    containerId: cellJSON.options.containerId,
                    parentContainerId: cellJSON.options.parentContainerId,
                    style: cellJSON.options.style,
                    mountedComponentJSON: void 0 // Will be mounted later.
                }
            }, row);

            if (cell) {
                row.cells.push(cell);

                if (cellJSON.options.mountedComponentJSON) {
                    componentsToMount.push({
                        cell: cell,
                        // eslint-disable-next-line
                        mountedComponentJSON: cellJSON.options.mountedComponentJSON
                    });
                }
            }
        }

        // Mount components.
        for (let i = 0, iEnd = componentsToMount.length; i < iEnd; ++i) {
            componentsToMount[i].cell.mountComponentFromJSON(
                componentsToMount[i].mountedComponentJSON,
                (cell || {}).container
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

        // Destroy cells.
        for (let i = 0, iEnd = row.cells.length; i < iEnd; ++i) {
            if (row.cells[i]) {
                row.cells[i].destroy();
            }
        }

        if (row.layout) {
            row.layout.unmountRow(row);

            super.destroy();

            if (layout.rows.length === 0) {
                layout.destroy();
            }
        }
    }

    /**
     * Converts the class instance to a class JSON.
     *
     * @return {Row.JSON}
     * Class JSON of this Row instance.
     */
    public toJSON(): Row.JSON {
        const row = this,
            layoutContainerId = (row.layout.container || {}).id || '',
            cells = [];

        // Get cells JSON.
        for (let i = 0, iEnd = row.cells.length; i < iEnd; ++i) {
            cells.push(row.cells[i].toJSON());
        }

        return {
            $class: 'Dashboard.Layout.Row',
            options: {
                containerId: (row.container as HTMLElement).id,
                parentContainerId: layoutContainerId,
                cells: cells,
                style: row.options.style
            }
        };
    }

    public setSize(
        height?: number | string
    ): void {
        const cells = this.cells;

        Row.setContainerHeight(
            this.container as HTMLDOMElement,
            height
        );

        // redraw component inside the cell
        if (cells) {
            /* for (let i = 0, iEnd = cells.length; i < iEnd; ++i) { */
            /*     if (cells[i] && cells[i].mountedComponent) { */
            /*         (cells[i] as any).mountedComponent.resize(null); */
            /*     } */
            /* } */
        } else {
            // nested layouts
        }
    }

    // Get cell index from the row.cells array.
    public getCellIndex(
        cell: Cell
    ): number | undefined {
        for (let i = 0, iEnd = this.cells.length; i < iEnd; ++i) {
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

    public setHighlight(
        remove?: boolean
    ): void {
        if (this.container) {
            const cnt = this.container,
                isSet = cnt.classList.contains(
                    EditGlobals.classNames.rowContextHighlight
                );

            if (!remove && !isSet) {
                cnt.classList.add(
                    EditGlobals.classNames.rowContextHighlight
                );
            } else if (remove && isSet) {
                cnt.classList.remove(
                    EditGlobals.classNames.rowContextHighlight
                );
            }
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

    export interface JSON extends Serializable.JSON<'Dashboard.Layout.Row'> {
        options: OptionsJSON;
    }

    export interface Options {
        id?: string;
        parentContainerId?: string;
        cells?: Array<Cell.Options>;
        style?: CSSJSONObject;
        cellsJSON?: Array<Cell.JSON>;
    }

    export interface OptionsJSON extends JSON.Object {
        containerId: string;
        parentContainerId: string;
        cells: Array<Cell.JSON>;
        style?: CSSJSONObject;
    }

    export interface RowLevel {
        top: number;
        bottom: number;
        cells: Array<Cell>;
    }

    export interface RowLevelInfo {
        index: number; // level position in RowLevels Array
        rowLevels: Array<RowLevel>;
        rowLevel: RowLevel;
    }
}

export default Row;
