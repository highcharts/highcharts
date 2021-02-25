import type Row from './Row.js';
import GUIElement from './GUIElement.js';

class Column extends GUIElement {
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
        super(options);

        this.row = row;
        this.setElementContainer(row.layout.dashboard.guiEnabled, row.container, columnElement);
    }

    /* *
    *
    *  Properties
    *
    * */
    public row: Row;

    /* *
    *
    *  Functions
    *
    * */
}

namespace Column {
    export interface Options {
        width?: number;
        id?: string;
    }
}

export default Column;
