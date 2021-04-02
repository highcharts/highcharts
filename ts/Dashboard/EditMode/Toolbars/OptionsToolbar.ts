import EditMode from '../EditMode.js';
import U from '../../../Core/Utilities.js';
import Cell from '../../Layout/Cell.js';
import Row from '../../Layout/Row.js';
import Layout from '../../Layout/Layout.js';
import EditGlobals from '../EditGlobals.js';
import Menu from '../Menu/Menu.js';
import type MenuItem from '../Menu/MenuItem.js';

const {
    merge,
    css
} = U;

class OptionsToolbar extends Menu {
    /* *
    *
    *  Static Properties
    *
    * */
    protected static readonly defaultOptions: OptionsToolbar.Options = {
        enabled: true,
        items: ['title']
    }

    public static tools: Record<string, MenuItem.Options> =
    merge(Menu.items, {
        title: {
            type: 'title',
            text: 'Options',
            events: {
                click: function (): void {}
            }
        }
    })

    /* *
    *
    *  Constructor
    *
    * */
    constructor(
        editMode: EditMode,
        options?: OptionsToolbar.Options|undefined
    ) {
        super(
            editMode.dashboard.container,
            merge(OptionsToolbar.defaultOptions, options || {})
        );

        if (this.container) {
            this.container.classList.add(
                EditGlobals.classNames.editToolbarOptions
            );
        }

        super.initItems(OptionsToolbar.items);
    }

    /* *
    *
    *  Properties
    *
    * */
    public guiElement?: Cell|Row|Layout;

    /* *
    *
    *  Functions
    *
    * */

    public showOptions(tools: Array<string>): void {
        if (this.container) {
            this.container.classList.add(
                EditGlobals.classNames.editToolbarOptionsShow
            );
        }

        console.log('gui element', this.guiElement);

        // TODO show Options
    }

    public hide(): void {
        if (this.container) {
            this.container.classList.add(
                EditGlobals.classNames.editToolbarOptionsHide
            );
        }
        this.guiElement = void 0;
    }
}

namespace OptionsToolbar {
    export interface Options extends Menu.Options {}
}

export default OptionsToolbar;
