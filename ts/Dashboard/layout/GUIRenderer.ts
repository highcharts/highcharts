import type {
    HTMLDOMElement
} from '../../Core/Renderer/DOMElementType';
import U from './../../Core/Utilities.js';
import type Layout from './Layout.js';

const {
    createElement
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
    public layoutContainer: HTMLDOMElement = void 0 as any;
    /* *
    *
    *  Functions
    *
    * */

    // @TODO add docs, improve it
    public createHTML(
        layoutOptions: Layout.Options,
        dashboardContainer: HTMLDOMElement
    ): HTMLDOMElement {

        // init layout container
        this.layoutContainer = this.HTMLElement('layout', dashboardContainer);
        this.addRows(layoutOptions);

        return this.layoutContainer;
    }
    /**
     * addRows
     */
    public addRows(
        layoutOptions: Layout.Options
    ): void {
        const rows = layoutOptions.rows;
        let columnsInRow;
        let column;
        let row;

        for (let i = 0, iEnd = rows.length; i < iEnd; ++i) {
            columnsInRow = rows[i].columns;

            // init row HTML
            row = this.HTMLElement('row', this.layoutContainer);

            // add columns
            for (let j = 0, jEnd = columnsInRow.length; j < jEnd; ++j) {
                column = this.HTMLElement('column', row);
                this.HTMLElement('card', column);
            }
        }
    }
    /**
     * HTMLElement
     */
    public HTMLElement(
        className: string,
        container: HTMLDOMElement
    ): HTMLDOMElement {
        return createElement(
            'div', {
                className: PREFIX + className
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
