import type Layout from './Layout';
import type {
    HTMLDOMElement
} from '../Core/Renderer/DOMElementType';

class GUI {
    /* *
    *
    *  Constructors
    *
    * */
    public constructor(
        options: Layout.Options
    ) {
        this.options = options;
        this.html = this.createHTML();
    }

    /* *
    *
    *  Properties
    *
    * */
    public options: Layout.Options;
    public html: HTMLDOMElement = void 0 as any;
    /* *
    *
    *  Functions
    *
    * */
    public createHTML(): string {
        /*
        * TODO
        *
        * 1. Assing HTML to layout's container
        * 2. Create layout structure
        * 3. Create cols
        * 4. Create rows
        *
        */

        /**
         * Static HTML for demo
         */
        return `
            <div class="row">
                <div class="col"></div>
                <div class="col"></div>
                <div class="col"></div>
            </div>
            <div class="row">
                <div class="col"></div>
                <div class="col"></div>
                <div class="col"></div>
            </div>            
            <div class="row">
                <div class="col"></div>
                <div class="col"></div>
                <div class="col"></div>
            </div>`;
    }
}
interface GUI {
    html: HTMLDOMElement|null;
}

namespace GUI {
    export interface Options {
        enabled: boolean;
        layouts: Array<Layout.Options>;
    }
}

export default GUI;
