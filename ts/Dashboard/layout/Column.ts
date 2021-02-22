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
        options: Column.Options
    ) {
        this.options = options;
        this.row = row;

        this.setColumnContainer();
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

    public setColumnContainer(): void {
        const column = this,
            row = column.row,
            dashboard = row.layout.dashboard,
            renderer = dashboard.renderer;

        if (dashboard.guiEnabled) {
            if (renderer && row.container) {
                // Generate column HTML structure
                this.container = renderer.renderColumn(
                    column,
                    row.container
                );

                // render card HTML structure
                renderer.renderCard(
                    this.container
                );
            } else {
                // this.container = from user gui
            }
        }
    }
}

namespace Column {
    export interface Options {
        width?: number;
        id: string;
    }
}

export default Column;
