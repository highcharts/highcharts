import EditMode from '../EditMode.js';
import U from '../../../Core/Utilities.js';
import Cell from '../../Layout/Cell.js';
import Row from '../../Layout/Row.js';
import Layout from '../../Layout/Layout.js';
import EditGlobals from '../EditGlobals.js';
import Menu from '../Menu/Menu.js';
import type MenuItem from '../Menu/MenuItem.js';
import DashboardGlobals from '../../DashboardGlobals.js';

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
        items: [{
            type: 'title'
        }]
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
        editMode: EditMode
    ) {
        const toolbarSettingsOptions =
            (editMode.options.toolbars || {}).settings;

        super(
            editMode.dashboard.container,
            merge(
                OptionsToolbar.defaultOptions,
                toolbarSettingsOptions
            )
        );

        this.editMode = editMode;

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
    public editMode: EditMode;

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

            // set margin on all layouts in dashboard to avoid overlap
            this.reserveToolbarSpace();
        }

        // set margin on layouts
    }

    public hide(): void {
        if (this.container) {
            this.container.classList.add(
                EditGlobals.classNames.editToolbarOptionsHide
            );

            this.removeToolbarSpace();
        }
        this.guiElement = void 0;
    }

    private reserveToolbarSpace(): void {
        const layouts = this.editMode.dashboard.container.querySelectorAll(
            '.' + DashboardGlobals.classNames.layout
        );

        for (let i = 0, iEnd = layouts.length; i < iEnd; ++i) {
            layouts[i].classList.add(
                EditGlobals.classNames.layoutToolbarSpace
            );
        }
    }

    private removeToolbarSpace(): void {
        const layouts = this.editMode.dashboard.container.querySelectorAll(
            DashboardGlobals.classNames.layout
        );

        for (let i = 0, iEnd = layouts.length; i < iEnd; ++i) {
            layouts[i].classList.remove(
                EditGlobals.classNames.layoutToolbarSpace
            );
        }
    }
}

namespace OptionsToolbar {
    export interface Options extends Menu.Options {}
}

export default OptionsToolbar;
