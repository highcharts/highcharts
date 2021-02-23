import type {
    HTMLDOMElement
} from '../../Core/Renderer/DOMElementType';
import type Row from './Row.js';
class Column {
    /* *
    *
    *  Constructors
    *
    * */
    public constructor(
        row: Row,
        options: Column.Options,
        columnElement?: HTMLElement
    ) {
        this.options = options;
        this.row = row;

        this.setColumnContainer(columnElement);
    }

    /* *
    *
    *  Properties
    *
    * */
    public options: Column.Options;
    public row: Row;
    public container?: HTMLDOMElement;
    /* *
    *
    *  Functions
    *
    * */

    public setColumnContainer(columnElement?: HTMLElement): void {
        const column = this,
            row = column.row,
            dashboard = row.layout.dashboard,
            renderer = dashboard.renderer;

        // @ToDo use try catch block
        if (dashboard.guiEnabled) {
            if (renderer && row.container) {
                // Generate column HTML structure
                column.container = renderer.renderColumn(
                    column,
                    row.container
                );

                // render card HTML structure
                renderer.renderCard(
                    column.container
                );
            } else {
                // Error
            }
        } else if (columnElement instanceof HTMLElement) { // @ToDo check if this is enough
            column.container = columnElement;
        } else {
            // Error
        }
    }
}

namespace Column {
    export interface Options {
        width?: number;
        id?: string;
    }
}

export default Column;
