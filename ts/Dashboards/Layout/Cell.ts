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

/* *
 *
 *  Imports
 *
 * */

import type CSSJSONObject from '../CSSJSONObject';
import type Component from '../Components/Component.js';
import type JSON from '../../Core/JSON';
import type LayoutType from './Layout';
import type Row from './Row';
import type { HTMLDOMElement } from '../../Core/Renderer/DOMElementType';
import type Serializable from '../Serializable';

import Globals from '../Globals.js';
import GUIElement from './GUIElement.js';
import Bindings from '../Actions/Bindings.js';
import U from '../../Core/Utilities.js';
import EditGlobals from '../EditMode/EditGlobals.js';

const {
    componentFromJSON
} = Bindings;

const {
    merge,
    fireEvent
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * @internal
 **/
class Cell extends GUIElement {

    /* *
     *
     *  Static Properties
     *
     * */

    /** @internal */
    public static fromJSON(
        json: Cell.JSON,
        row?: Row
    ): Cell|undefined {
        if (row) {
            const options = json.options;

            let id = options.containerId;

            if (row.layout.copyId) {
                id = id + '_' + row.layout.copyId;
            }

            return new Cell(
                row,
                {
                    id: id,
                    parentContainerId: (row.container && row.container.id) ||
                        options.parentContainerId,
                    mountedComponentJSON: options.mountedComponentJSON,
                    style: options.style,
                    layoutJSON: options.layoutJSON
                }
            );
        }

        return void 0;
    }

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs an instance of the Cell class.
     *
     * @param {Row} row
     * Reference to the row instance.
     *
     * @param {Cell.Options} options
     * Options for the cell.
     *
     * @param {HTMLElement} cellElement
     * The container of the cell HTML element.
     */
    public constructor(
        row: Row,
        options: Cell.Options,
        cellElement?: HTMLElement
    ) {
        super();

        this.id = options.id;
        this.options = options;
        this.row = row;
        this.isVisible = true;

        // Get parent container
        const parentContainer =
            document.getElementById(options.parentContainerId || '') ||
            row.container;

        if (parentContainer) {
            const layoutOptions = row.layout.options || {},
                rowOptions = row.options || {},
                cellClassName = layoutOptions.cellClassName || '';

            let cellHeight;

            if (options.height) {
                if (typeof options.height === 'number') {
                    cellHeight = options.height + 'px';
                } else {
                    cellHeight = options.height;
                }
            }

            this.setElementContainer({
                render: row.layout.board.guiEnabled,
                parentContainer: parentContainer,
                attribs: {
                    id: options.id,
                    className: Globals.classNames.cell + ' ' +
                        cellClassName
                },
                element: cellElement,
                elementId: options.id,
                style: merge(
                    layoutOptions.style,
                    rowOptions.style,
                    options.style,
                    {
                        height: cellHeight
                    }
                )
            });

            // Set cell width respecting responsive options.
            this.reflow();

            // Mount component from JSON.
            if (this.options.mountedComponentJSON) {
                this.mountComponentFromJSON(
                    this.options.mountedComponentJSON,
                    this.container
                );
            }

            // nested layout
            if (this.options.layout) {
                this.setNestedLayout();
            }
            if (this.options.layoutJSON) {
                const layout = this.row.layout,
                    board = layout.board,
                    layoutFromJSON = (
                        layout.constructor as typeof LayoutType
                    ).fromJSON;

                this.nestedLayout = layoutFromJSON(
                    merge(this.options.layoutJSON, {
                        parentContainerId: this.options.id
                    }),
                    board,
                    this
                );
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
     * Cell id.
     */
    public id: string;

    /**
     * The type of GUI element.
     */
    public readonly type = Globals.guiElementType.cell;

    /**
     * Reference to the row instance.
     */
    public row: Row;

    /**
     * The cell options.
     */
    public options: Cell.Options;

    /**
     * Component mounted in the cell.
     */
    public mountedComponent?: Component;

    /**
     * Layout nested in the cell.
     */
    public nestedLayout?: LayoutType;

    /**
     * Cell highlight flag.
     */
    public isHighlighted?: boolean;

    /* *
     *
     *  Functions
     *
     * */
    /**
     * Create a nested layout in the cell and assign it to the nestedCell
     * property.
     * @internal
     */
    public setNestedLayout(): void {
        const board = this.row.layout.board,
            Layout = (this.row.layout.constructor as typeof LayoutType);
        const optionsGui = board.options.gui;

        this.nestedLayout = new Layout(
            board,
            merge(
                {},
                optionsGui && optionsGui.layoutOptions,
                this.options.layout,
                {
                    parentContainerId: this.options.id
                }
            ),
            this
        );
    }
    /**
     * Mount component from JSON.
     * @internal
     *
     * @param {Component.JSON} [json]
     * Component JSON.
     *
     * @param {HTMLDOMElement} cellContainer
     * Cell container
     *
     * @return {boolean}
     * Returns true, if the component created from JSON is mounted,
     * otherwise false.
     */
    public mountComponentFromJSON(
        json: Component.JSON,
        cellContainer: HTMLDOMElement|undefined
    ): boolean {
        const cell = this;

        if (cell.id !== json.options.parentElement) {
            json.options.parentElement = cell.id;
        }

        const component = componentFromJSON(json, cellContainer);

        if (component) {
            cell.mountedComponent = component;
            return true;
        }

        return false;
    }

    /**
     * Destroy the element, its container, event hooks
     * and mounted component.
     */
    public destroy(): void {
        const cell = this;
        const { row } = cell;

        // Destroy mounted component.
        if (cell.mountedComponent) {
            cell.mountedComponent.destroy();
        }

        row.unmountCell(cell);
        const destroyRow = row.cells.length === 0;

        super.destroy();

        if (destroyRow) {
            row.destroy();
        }
    }

    /**
     * Converts the class instance to a class JSON.
     * @internal
     *
     * @return {Cell.JSON}
     * Class JSON of this Cell instance.
     */
    public toJSON(): Cell.JSON {
        const cell = this,
            rowContainerId = (cell.row.container || {}).id || '';

        return {
            $class: 'Dashboards.Layout.Cell',
            options: {
                containerId: (cell.container as HTMLElement).id,
                parentContainerId: rowContainerId,
                mountedComponentJSON:
                    cell.mountedComponent && cell.mountedComponent.toJSON(),
                style: cell.options.style,
                layoutJSON: cell.nestedLayout && cell.nestedLayout.toJSON()
            }
        };
    }

    protected changeVisibility(
        setVisible: boolean = true
    ): void {
        const cell = this,
            row = cell.row;

        super.changeVisibility(setVisible);

        // Change row visibility if needed.
        if (!cell.row.getVisibleCells().length) {
            cell.row.hide();
        } else if (cell.isVisible && !row.isVisible) {
            cell.row.show();
        }

        setTimeout(():void => {
            fireEvent(row, 'cellChange', { row, cell });
        }, 0);
    }

    public getParentCell(
        level: number
    ): Cell | undefined {
        const cell = this;

        let parentCell;

        if (level <= cell.row.layout.level) {
            if (cell.row.layout.level === level) {
                return cell;
            }

            if (cell.row.layout.level - 1 >= 0) {
                parentCell = cell.row.layout.parentCell;

                if (parentCell) {
                    return parentCell.getParentCell(level);
                }
            }
        }
    }

    // Method to get array of overlapping levels.
    public getOverlappingLevels(
        align: string, // left, right, top, bottom
        levelMaxGap: number, // max distance between levels
        offset?: number // analized cell offset
    ): Array<number> {
        const cell = this,
            parentCell = cell.row.layout.parentCell;

        let levels = [cell.row.layout.level];

        if (parentCell) {
            const cellOffset = offset || GUIElement.getOffsets(cell)[align];
            const parentCellOffset = GUIElement.getOffsets(parentCell)[align];

            if (Math.abs(cellOffset - parentCellOffset) < levelMaxGap) {
                levels = [
                    ...levels,
                    ...parentCell.getOverlappingLevels(
                        align,
                        levelMaxGap,
                        parentCellOffset
                    )
                ];
            }
        }

        return levels;
    }

    public reflow(
        dashContainerSize?: string
    ):void {
        const cell = this,
            cntSize = dashContainerSize ||
                cell.row.layout.board.getLayoutContainerSize(),
            respoOptions = cell.options.responsive,
            optWidth = cell.options.width;

        let width;

        if (cell.container) {
            if (
                respoOptions &&
                respoOptions[cntSize] &&
                respoOptions[cntSize].width
            ) {
                width = cell.convertWidthToValue(respoOptions[cntSize].width);
            } else if (optWidth) {
                width = cell.convertWidthToValue(optWidth);
            }

            cell.setSize(width || 'auto');
        }
    }

    public setSize(
        width: string|number // % value or 'auto' or px
    ): void {
        const cell = this,
            editMode = cell.row.layout.board.editMode;

        if (cell.container) {
            if (width === 'auto' && cell.container.style.flex !== '1 1 0%') {
                cell.container.style.flex = '1 1 0%';
            } else {
                const cellWidth = cell.convertWidthToValue(width);

                if (
                    cellWidth &&
                    cell.container.style.flex !== '0 0 ' + cellWidth
                ) {
                    cell.container.style.flex = '0 0 ' + cellWidth;
                }
            }

            if (editMode) {
                editMode.hideContextPointer();

                if (
                    editMode.cellToolbar &&
                    editMode.cellToolbar.isVisible
                ) {
                    if (editMode.cellToolbar.cell === cell) {
                        editMode.cellToolbar.showToolbar(cell);
                    } else {
                        editMode.cellToolbar.hide();
                    }
                }
            }

            // Call cellResize board event.
            fireEvent(cell.row.layout.board, 'cellResize', { cell: cell });
            fireEvent(cell.row, 'cellChange', { cell: cell, row: cell.row });
        }
    }

    // Updates width in responsive options.
    public updateSize(
        width: string, // % value or 'auto' or px
        rwdMode?: string // small, medium, large
    ): void {
        const cell = this,
            cntSize = rwdMode ||
                cell.row.layout.board.getLayoutContainerSize();

        if (!cell.options.responsive) {
            cell.options.responsive = {};
        }

        cell.options.responsive[cntSize] = {
            width: width
        };
    }

    public setHighlight(
        remove?: boolean
    ): void {
        const cell = this,
            editMode = cell.row.layout.board.editMode;

        if (cell.container && editMode) {
            const cnt = cell.container,
                isSet = cnt.classList.contains(
                    EditGlobals.classNames.cellEditHighlight
                );

            if (!remove && !isSet) {
                cnt.classList.add(EditGlobals.classNames.cellEditHighlight);
                cell.row.layout.board.container.classList.add(
                    EditGlobals.classNames.dashboardCellEditHighlightActive
                );

                cell.isHighlighted = true;
            } else if (remove && isSet) {
                cnt.classList.remove(EditGlobals.classNames.cellEditHighlight);
                cell.row.layout.board.container.classList.remove(
                    EditGlobals.classNames.dashboardCellEditHighlightActive
                );

                cell.isHighlighted = false;
            }
        }
    }

    public setActiveState(): void {
        // reset other boxes
        const cell = this;

        cell.row.layout.board.mountedComponents.forEach(
            (mountedComponent):void => {
                if (mountedComponent.cell.container) {
                    mountedComponent.cell.container.classList.remove(
                        Globals.classNames.cellActive
                    );
                }
            }
        );

        // apply class
        if (cell.container) {
            cell.container.classList.add(
                Globals.classNames.cellActive
            );
        }
    }

    private convertWidthToValue(
        width: number|string
    ): string {
        if (typeof width === 'number') {
            return width + 'px';
        }
        if (/px/.test(width)) {
            return width;
        }
        return GUIElement.getPercentageWidth(width) || '';
    }
}

/* *
 *
 *  Namespace
 *
 * */

namespace Cell {
    /**
     * @internal
     **/
    export interface CellResponsiveOptions {
        width: string|number;
        // visible: boolean;
    }

    /**
     * @internal
     **/
    export interface JSON extends Serializable.JSON<'Dashboards.Layout.Cell'> {
        options: OptionsJSON;
    }

    /**
     * Options for each cell.
     **/
    export interface Options {
        /**
         * Unique cell id.
         **/
        id: string;
        /**
         * Width of the cell. Can be a percentage value, pixels or a fraction.
         *
         * The fraction converts value into percents like in CSS grid is.
         * For example `1/3` means `33.333%`.
         *
         * Examples:
         * ```
         * width: 300 // 300px
         * ```
         * ```
         * width: '300px'
         * ```
         * ```
         * width: '1/3' // 33.333%
         * ```
         * ```
         * width: '33.333%'
         * ```
         **/
        width?: string|number;
        /**
         * Height of the cell.
         *
         * Examples:
         * ```
         * height: 300 // 300px
         * ```
         * ```
         * height: '300px'
         * ```
         **/
        height?: string|number;
        /**
         * CSS styles for cell container.
         **/
        style?: CSSJSONObject;
        /**
         * Id of the container that holds the cell.
         **/
        parentContainerId?: string;
        /**
         * @internal
         **/
        mountedComponentJSON?: Component.JSON;
        /**
         * To create a nested layout, cell might contain an additional layouts.
         **/
        layout?: LayoutType.Options;
        /**
         * To create nested layout from JSON config.
         */
        layoutJSON?: LayoutType.JSON;
        /**
         * Options for responsive design.
         **/
        responsive?: Record<string, CellResponsiveOptions>;
    }

    /**
     * @internal
     **/
    export interface OptionsJSON extends JSON.Object {
        containerId: string;
        parentContainerId: string;
        mountedComponentJSON?: Component.JSON;
        style?: CSSJSONObject;
        layoutJSON?: LayoutType.JSON;
    }

}

/* *
 *
 *  Default Export
 *
 * */
export default Cell;
