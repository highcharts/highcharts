import type {
    HTMLDOMElement
} from '../../Core/Renderer/DOMElementType';
import U from './../../Core/Utilities.js';

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
