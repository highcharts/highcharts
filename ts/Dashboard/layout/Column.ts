import type {
    CSSObject
} from '../../Core/Renderer/CSSObject';
import type Row from './Row.js';
import GUIElement from './GUIElement.js';
import U from '../../Core/Utilities.js';
const {
    merge,
    pick,
    addEvent
} = U;
class Column extends GUIElement {
    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs an instance of the Column class.
     *
     * @param {Row} row
     * Reference to the row instance.
     *
     * @param {Column.Options} options
     * Options for the column.
     *
     * @param {HTMLElement} columnElement
     * The container of the column HTML element.
     */
    public constructor(
        row: Row,
        options: Column.Options,
        columnElement?: HTMLElement
    ) {
        const columnClassName = row.layout.options.columnClassName;

        super();

        this.options = options;

        this.row = row;
        this.setElementContainer({
            render: row.layout.dashboard.guiEnabled,
            parentContainer: row.container,
            attribs: {
                id: options.id,
                className: columnClassName ?
                    columnClassName + ' ' + GUIElement.prefix + 'column' : GUIElement.prefix + 'column'
            },
            element: columnElement,
            elementId: options.id,
            style: merge(
                row.layout.options.style,
                row.options.style,
                options.style
            )
        });

    }

    /* *
    *
    *  Properties
    *
    * */

    /**
     * Reference to the row instance.
     */
    public row: Row;

    /**
     * The column options.
     */
    public options: Column.Options;
}

namespace Column {
    export interface Options {
        width?: number;
        id?: string;
        style?: CSSObject;
    }
}

export default Column;
