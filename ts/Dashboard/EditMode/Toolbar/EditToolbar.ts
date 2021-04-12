import EditMode from '../EditMode.js';
import U from '../../../Core/Utilities.js';
import Menu from '../Menu/Menu.js';
import { HTMLDOMElement } from '../../../Core/Renderer/DOMElementType.js';

const {
    defined,
    createElement,
    css
} = U;

abstract class EditToolbar {
    /* *
    *
    *  Constructor
    *
    * */
    constructor(
        editMode: EditMode,
        options: EditToolbar.Options
    ) {
        this.container = createElement(
            'div', {
                className: options.className
            }, {},
            editMode.dashboard.container
        );
        this.editMode = editMode;
        this.menu = new Menu(
            this.container,
            options.menu,
            this
        );

        this.options = options;
        this.isVisible = false;
    }

    /* *
    *
    *  Properties
    *
    * */
    public container: HTMLDOMElement;
    public editMode: EditMode;
    public menu: Menu;
    public isVisible: boolean;
    public options: EditToolbar.Options;

    /* *
    *
    *  Functions
    *
    * */
    public hide(): void {
        this.setPosition(void 0, void 0);
    }

    public setPosition(
        x?: number,
        y?: number
    ): void {
        const toolbar = this;

        if (toolbar.container) {
            css(toolbar.container, {
                left: (x || '-9999') + 'px',
                top: (y || '-9999') + 'px'
            });
        }

        toolbar.isVisible = defined(x) && defined(y);
    }
}

namespace EditToolbar {
    export interface Options {
        enabled: boolean;
        className: string;
        menu: Menu.Options;
    }
}

export default EditToolbar;
