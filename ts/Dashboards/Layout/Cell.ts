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

/* eslint-disable */

'use strict';

import type CSSJSONObject from '../CSSJSONObject';
import type Component from '../Component/Component.js';
import type ComponentType from '../Component/ComponentType';
import type JSON from '../../Core/JSON';
import type LayoutType from './Layout.js';
import type Row from './Row.js';
import type Serializable from '../Serializable';

import Globals from '../Globals.js';
import GUIElement from './GUIElement.js';
import Bindings from '../Actions/Bindings.js';
import U from '../../Core/Utilities.js';
import { HTMLDOMElement } from '../../Core/Renderer/DOMElementType';
import EditGlobals from '../EditMode/EditGlobals.js';

const {
    merge,
    fireEvent
} = U;
class Cell extends GUIElement {
    /* *
    *
    *  Static Properties
    *
    * */

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
                    parentContainerId: row.container?.id ||
                        options.parentContainerId,
                    mountedComponentJSON: options.mountedComponentJSON,
                    style: options.style
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

        this.type = Globals.guiElementType.cell;
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

            this.setElementContainer({
                render: row.layout.dashboard.guiEnabled,
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
                    options.style
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

            // a11y
            if (this.container) {
                this.container.setAttribute('tabindex', -1);
            }

            // nested layout
            if (this.options.layout) {
                const dashboard = this.row.layout.dashboard,
                    Layout = this.row.layout.constructor as typeof LayoutType;

                this.nestedLayout = new Layout(
                    dashboard,
                    merge(
                        {},
                        dashboard.options.gui?.layoutOptions,
                        this.options.layout,
                        {
                            parentContainerId: options.id
                        }
                    ),
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

    /**
     * Mount component from JSON.
     *
     * @param {Component.JSON} [json]
     * Component JSON.
     *
     * @param {HTMLDOMElement} cellContainer
     * Cell container
     *
     * @return {boolean}
     */
    public mountComponentFromJSON(
        json: Component.JSON,
        cellContainer: HTMLDOMElement|undefined
    ): boolean {
        const cell = this;

        if (cell.id !== json.options.parentElement) {
            json.options.parentElement = cell.id;
        }

        const component = Bindings.componentFromJSON(json, cellContainer);

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
     *
     * @return {Cell.JSON}
     * Class JSON of this Cell instance.
     */
    public toJSON(): Cell.JSON {
        const cell = this,
            rowContainerId = (cell.row.container || {}).id || '';

        return {
            $class: 'Dashboard.Layout.Cell',
            options: {
                containerId: (cell.container as HTMLElement).id,
                parentContainerId: rowContainerId,
                mountedComponentJSON: cell.mountedComponent?.toJSON(),
                style: cell.options.style,
            }
        };
    }

    protected changeVisibility(
        setVisible: boolean = true
    ): void {
        const cell = this,
            row = cell.row

        super.changeVisibility(setVisible);

        // Change row visibility if needed.
        if (!cell.row.getVisibleCells().length) {
            cell.row.hide();
        } else if (cell.isVisible && !row.isVisible) {
            cell.row.show();
        }

        setTimeout(() => {
            fireEvent(row, 'cellChange', { row, cell })
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
            } else if (cell.row.layout.level - 1 >= 0) {
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
                    ...parentCell.getOverlappingLevels(align, levelMaxGap, parentCellOffset)
                ];
            }
        }

        return levels;
    }

    public reflow(
        dashContainerSize?: string
    ) {
        const cell = this,
            cntSize = dashContainerSize || cell.row.layout.dashboard.getLayoutContainerSize(),
            respoOptions = cell.options.responsive;

        let width;

        if (cell.container) {
            if (respoOptions && respoOptions[cntSize] && respoOptions[cntSize].width) {
                width = GUIElement.getPercentageWidth(respoOptions[cntSize].width);
            } else if (cell.options.width) {
                width = GUIElement.getPercentageWidth(cell.options.width);
            }

            cell.setSize(width || 'auto');
        }
    }

    public setSize(
        width: string // % value or 'auto'
    ): void {
        const cell = this,
            editMode = cell.row.layout.dashboard.editMode;

        if (cell.container) {
            if (width === 'auto' && cell.container.style.flex !== '1 1 0%') {
                cell.container.style.flex = '1 1 0%';
            } else {
                const percentageWidth = GUIElement.getPercentageWidth(width);

                if (
                    percentageWidth &&
                    cell.container.style.flex !== '0 0 ' + percentageWidth
                ) {
                    cell.container.style.flex = '0 0 ' + percentageWidth;
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
    
            // Call cellResize dashboard event.
            fireEvent(cell.row.layout.dashboard, 'cellResize', { cell: cell });
            fireEvent(cell.row, 'cellChange', { cell: cell, row: cell.row });
        }
    }

    // Updates width in responsive options.
    public updateSize(
        width: string, // % value or 'auto'
        rwdMode?: string // small, medium, large
    ): void {
        const cell = this,
            cntSize = rwdMode || cell.row.layout.dashboard.getLayoutContainerSize();

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
            editMode = cell.row.layout.dashboard.editMode;

        if (cell.container && editMode) {
            const cnt = cell.container,
                isSet = cnt.classList.contains(EditGlobals.classNames.cellEditHighlight);

            if (!remove && !isSet) {
                cnt.classList.add(EditGlobals.classNames.cellEditHighlight);
                cell.row.layout.dashboard.container.classList.add(
                    EditGlobals.classNames.dashboardCellEditHighlightActive
                );

                cell.isHighlighted = true;
            } else if (remove && isSet) {
                cnt.classList.remove(EditGlobals.classNames.cellEditHighlight);
                cell.row.layout.dashboard.container.classList.remove(
                    EditGlobals.classNames.dashboardCellEditHighlightActive
                );

                cell.isHighlighted = false;
            }
        }
    }

    public setActiveState(): void {
        // reset other boxes
        const cell = this;

        cell.row.layout.dashboard.mountedComponents.forEach(
            mountedComponent => {
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
}

namespace Cell {

    export interface CellResponsiveOptions {
        width: string;
        // visible: boolean;
    }

    export interface JSON extends Serializable.JSON<'Dashboard.Layout.Cell'> {
        options: OptionsJSON;
    }

    export interface Options {
        id: string;
        width?: string; // eg 50%, 1/2
        height?: number;
        style?: CSSJSONObject;
        parentContainerId?: string;
        mountedComponentJSON?: Component.JSON;
        layout?: LayoutType.Options;
        responsive?: Record<string, CellResponsiveOptions>;
    }

    export interface OptionsJSON extends JSON.Object {
        containerId: string;
        parentContainerId: string;
        mountedComponentJSON?: Component.JSON;
        style?: CSSJSONObject;
    }

}

export default Cell;
