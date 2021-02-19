import type {
    HTMLDOMElement
} from '../../Core/Renderer/DOMElementType';
import Row from './Row.js';
import GUIRenderer from './GUIRenderer.js';

class Layout {
    /* *
    *
    *  Constructors
    *
    * */
    public constructor(
        dashboardContainer: HTMLDOMElement,
        options: Layout.Options,
        guiEnabled?: boolean,
        renderer?: GUIRenderer
    ) {
        this.options = options;
        this.dashboardContainer = dashboardContainer;

        if (renderer) {
            this.renderer = renderer;
        }

        this.setLayout(guiEnabled);
    }

    /* *
    *
    *  Properties
    *
    * */
    public options: Layout.Options;
    public dashboardContainer: HTMLDOMElement;
    public renderer?: GUIRenderer;

    /* *
    *
    *  Functions
    *
    * */
    public setLayout(guiEnabled?: boolean): void {
        /*
        * TODO
        *
        * 1. Set reference to container
        * 2. Create layout structure
        * 3. Init cols
        * 4. Init rows
        *
        */

        const layout = this;

        if (guiEnabled) {
            if (!layout.renderer) {
                // Throw an error - GUIRenderer module required!
            }

            // Generate layout HTML structure.
            // layout.renderer.renderLayout
        }
    }
}

interface Layout {
    options: Layout.Options;
}
namespace Layout {
    export interface Options {
        rowClassName: string;
        colClassName: string;
        rows: Array<Row.Options>;
    }
}

export default Layout;
