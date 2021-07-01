/* eslint-disable */
import type { CSSJSONObject } from './../../Data/DataCSSObject';
import type DataJSON from '../../Data/DataJSON';
import type Component from './../Component/Component.js';
import type ComponentType from '../Component/ComponentType'
import DashboardGlobals from './../DashboardGlobals.js';
import Row from './Row.js';
import GUIElement from './GUIElement.js';
import Bindings from '../Actions/Bindings.js';
import U from '../../Core/Utilities.js';
import Layout from './Layout.js';
import { HTMLDOMElement } from '../../Core/Renderer/DOMElementType';

const {
    merge,
    isNumber,
    fireEvent
} = U;
class Cell extends GUIElement {
    /* *
    *
    *  Static Properties
    *
    * */

    public static fromJSON(
        json: Cell.ClassJSON,
        row: Row
    ): Cell|undefined {
        if (row instanceof Row) {
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

    public static setContainerSize(
        dimensions: { width?: number | string; height?: number | string },
        cellContainer: HTMLDOMElement
    ): void {
        const width = dimensions.width;
        const height = dimensions.width;

        if (width) {
            cellContainer.style.width = isNumber(width) ?
                dimensions.width + 'px' : width;

            cellContainer.style.flex = 'none';
        }

        if (height) {
            cellContainer.style.height = isNumber(height) ?
                dimensions.height + 'px' : height;
        }
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

        this.type = DashboardGlobals.guiElementType.cell;
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
                    className: DashboardGlobals.classNames.cell + ' ' +
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
            this.updateSize();

            // Mount component from JSON.
            if (this.options.mountedComponentJSON) {
                this.mountComponentFromJSON(
                    this.options.mountedComponentJSON,
                    this.container
                );
            }

            // nested layout
            if (this.options.layout) {
                const dashboard = this.row.layout.dashboard;

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
    public mountedComponent?: ComponentType;

    /**
     * Layout nested in the cell.
     */
    public nestedLayout?: Layout;

    /**
     * Mount component from JSON.
     *
     * @param {Component.ClassJSON} [json]
     * Component JSON.
     *
     * @param {HTMLDOMElement} cellContainer
     * Cell container
     *
     * @return {boolean}
     */
    public mountComponentFromJSON(
        json: Component.ClassJSON,
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
     * @return {Cell.ClassJSON}
     * Class JSON of this Cell instance.
     */
    public toJSON(): Cell.ClassJSON {
        const cell = this,
            rowContainerId = (cell.row.container || {}).id || '';

        return {
            $class: 'Cell',
            options: {
                containerId: (cell.container as HTMLElement).id,
                parentContainerId: rowContainerId,
                mountedComponentJSON: cell.mountedComponent?.toJSON(),
                style: cell.options.style
            }
        };
    }

    public setSize(
        dimensions: { width?: number | string; height?: number | string }
    ): void {
        Cell.setContainerSize(
            dimensions,
            this.container as HTMLDOMElement
        );
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

    public updateSize(
        dashContainerSize?: string
    ) {
        const cell = this,
            cntSize = dashContainerSize || cell.row.layout.dashboard.getContainerSize(),
            respoOptions = cell.options.responsive;

        let width;

        if (respoOptions && respoOptions[cntSize] && respoOptions[cntSize].width) {
            width = GUIElement.getPercentageWidth(respoOptions[cntSize].width);
        } else if (cell.options.width) {
            width = GUIElement.getPercentageWidth(cell.options.width);
        }

        // @ToDo
        // 1) check if width is different that currently set.
        // 2) fire mounted component event to update size?
        if (width && cell.container) {
            cell.container.style.flex = '0 0 ' + width;
        }
    }
}

namespace Cell {
    export interface Options {
        id: string;
        width?: string; // eg 50%, 1/2
        height?: number;
        style?: CSSJSONObject;
        parentContainerId?: string;
        mountedComponentJSON?: Component.ClassJSON;
        layout?: Layout.Options;
        responsive?: Record<string, CellResponsiveOptions>;
    }

    export interface CellResponsiveOptions {
        width: string;
        // visible: boolean;
    }

    export interface ClassJSON extends DataJSON.ClassJSON {
        options: JSONOptions;
    }

    export interface JSONOptions extends DataJSON.JSONObject {
        containerId: string;
        parentContainerId: string;
        mountedComponentJSON: Component.ClassJSON|undefined;
        style?: CSSJSONObject;
    }
}

export default Cell;
