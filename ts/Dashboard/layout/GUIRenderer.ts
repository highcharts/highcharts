import type {
    HTMLDOMElement
} from '../../Core/Renderer/DOMElementType';
import type Layout from './Layout.js';
import U from './../../Core/Utilities.js';
import Column from './Column.js';
import Row from './Row.js';

const {
    createElement,
    pick
} = U;

const PREFIX = 'highcharts-dashboard-';
class GUIRenderer {
    /* *
    *
    *  Constructors
    *
    * */
    public constructor(
        options: GUIRenderer.Options
    ) {
        this.options = options;
    }

    /* *
    *
    *  Properties
    *
    * */
    public options: GUIRenderer.Options;

    /* *
    *
    *  Functions
    *
    * */

    // @TODO add docs, improve it
    public renderLayout(container: HTMLDOMElement): HTMLDOMElement {
        return createElement(
            'div', {
                // id: 'dashboard-layout-1',
                className: PREFIX + 'layout'
            },
            {},
            container
        );
    }

    // @TODO add docs, improve it
    public renderRow(
        row: Row,
        container: HTMLDOMElement
    ): HTMLDOMElement {
        const layoutOptions = row.layout.options;

        return createElement(
            'div', {
                id: row.options.id || '', // row id
                className: layoutOptions.rowClassName + ' ' + PREFIX + 'row'
            },
            {},
            container
        );
    }

    // @TODO add docs, improve it
    public renderColumn(
        column: Column,
        container: HTMLDOMElement
    ): HTMLDOMElement {
        const layoutOptions = column.row.layout.options;

        return createElement(
            'div', {
                id: column.options.id || '', // column id
                className: layoutOptions.columnClassName + ' ' + PREFIX + 'column'
            },
            {},
            container
        );
    }

    // @TODO add docs, improve it
    public renderCard(container: HTMLDOMElement): HTMLDOMElement {
        return createElement(
            'div', {
                // id: 'dashboard-row-1',
                className: PREFIX + 'card'
            },
            {},
            container
        );
    }
}


interface GUIRenderer {

}

namespace GUIRenderer {
    export interface Options {}
}

export default GUIRenderer;
