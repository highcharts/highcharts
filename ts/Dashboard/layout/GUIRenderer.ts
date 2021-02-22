import type {
    HTMLDOMElement
} from '../../Core/Renderer/DOMElementType';
import U from './../../Core/Utilities.js';

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
    public renderRow(container: HTMLDOMElement): HTMLDOMElement {
        return createElement(
            'div', {
                // id: 'dashboard-row-1',
                className: PREFIX + 'row'
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
