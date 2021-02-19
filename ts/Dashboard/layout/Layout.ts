import type {
    HTMLDOMElement
} from '../../Core/Renderer/DOMElementType';
import GUI from './GUI.js';
import Row from './Row.js';

class Layout {
    /* *
    *
    *  Constructors
    *
    * */
    public constructor(
        dashboardContainer: HTMLDOMElement,
        guiEnabled: boolean,
        options: Layout.Options
    ) {
        this.options = options;
        this.dashboardContainer = dashboardContainer;

        if (guiEnabled) {
            this.gui = new GUI(
                dashboardContainer,
                options
            );
        }

        this.setLayout();
    }

    /* *
    *
    *  Properties
    *
    * */
    public options: Layout.Options;
    public dashboardContainer: HTMLDOMElement;
    public gui?: GUI;
    /* *
    *
    *  Functions
    *
    * */
    public setLayout(): void {
        /*
        * TODO
        *
        * 1. Set reference to container
        * 2. Create layout structure
        * 3. Init cols
        * 4. Init rows
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
