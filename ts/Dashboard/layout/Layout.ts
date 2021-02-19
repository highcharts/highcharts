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
        // this.addRows();
    }

    /* *
    *
    *  Properties
    *
    * */
    public options: Layout.Options;
    public dashboardContainer: HTMLDOMElement;
    public container?: HTMLDOMElement;
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
        *
        */

        const layout = this;

        let layoutHTML;

        if (guiEnabled) {
            if (layout.renderer) {
                // Generate layout HTML structure.
                layoutHTML = layout.renderer.renderLayout(layout.dashboardContainer);
            } else {
                // Throw an error - GUIRenderer module required!
            }
        } else {
            // layoutHTML = from user gui
        }

        this.container = layoutHTML;
    }

    public addRows(): void {
        /*
        * TODO
        *
        * 1. Init rows
        *
        */
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
