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
}


interface GUIRenderer {

}

namespace GUIRenderer {
    export interface Options {}
}

export default GUIRenderer;
