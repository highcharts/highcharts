import type {
    HTMLDOMElement
} from '../../Core/Renderer/DOMElementType';
import type Layout from './Layout.js';

class GUI {
    /* *
    *
    *  Constructors
    *
    * */
    public constructor(
        dashboardContainer: HTMLDOMElement,
        options: Layout.Options
    ) {
        this.options = options;
        this.dashboardContainer = dashboardContainer;
        // temporary solution until create an options parser
        this.dashboardContainer.innerHTML = this.createHTML();
    }

    /* *
    *
    *  Properties
    *
    * */
    public options: Layout.Options;
    public dashboardContainer: HTMLDOMElement;
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
            <div class="">
                <div class="row">
                    <div class="col">
                        <div class="card"></div>
                    </div>
                    <div class="col">
                        <div class="card"></div>
                    </div>                    
                    <div class="col">
                        <div class="card"></div>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <div class="card"></div>
                    </div>
                    <div class="col">
                        <div class="card"></div>
                    </div>                    
                    <div class="col">
                        <div class="card"></div>
                    </div>
                </div>                
                <div class="row">
                    <div class="col">
                        <div class="card"></div>
                    </div>
                    <div class="col">
                        <div class="card"></div>
                    </div>                    
                    <div class="col">
                        <div class="card"></div>
                    </div>
                </div>
            </div>
        `;
    }
}
interface GUI {

}

namespace GUI {
    export interface Options {
        enabled: boolean;
        layouts: Array<Layout.Options>;
    }
}

export default GUI;
