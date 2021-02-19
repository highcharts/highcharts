import type {
    HTMLDOMElement
} from '../../Core/Renderer/DOMElementType';

class GUIRenderer {
    /* *
    *
    *  Constructors
    *
    * */
    public constructor(
        dashboardContainer: HTMLDOMElement,
        options: GUIRenderer.Options
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
    public options: GUIRenderer.Options;
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
interface GUIRenderer {

}

namespace GUIRenderer {
    export interface Options {}
}

export default GUIRenderer;
