import type Row from './Row.js';
import { GUIElement, PREFIX } from './GUIElement.js';

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
        const columnClassName = row.layout.options.columnClassName;

        super();

        this.options = options;

        this.row = row;
        this.setElementContainer(
            row.layout.dashboard.guiEnabled,
            row.container,
            {
                id: options.id,
                className: columnClassName ?
                    columnClassName + ' ' + PREFIX + 'column' : PREFIX + 'column'
            },
            columnElement || options.id
        );
    }

    /* *
    *
    *  Properties
    *
    * */
    public row: Row;
    public options: Column.Options;

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
