import EditMode from '../EditMode.js';
import U from '../../../Core/Utilities.js';
import Cell from '../../Layout/Cell.js';
import Row from '../../Layout/Row.js';
import Layout from '../../Layout/Layout.js';
import EditToolbar from './EditToolbar.js';
import EditGlobals from '../EditGlobals.js';

const {
    merge,
    css
} = U;

class OptionsToolbar extends EditToolbar {
    /* *
    *
    *  Static Properties
    *
    * */
    protected static readonly defaultOptions: OptionsToolbar.Options = {
        enabled: true,
        tools: ['title']
    }

    public static tools: Record<string, EditToolbar.ToolOptions> =
    merge(EditToolbar.tools, {
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
        super(editMode, merge(OptionsToolbar.defaultOptions, options || {}));

        if (this.container) {
            this.container.classList.add(
                EditGlobals.classNames.editToolbarOptions
            );
        }

        super.initTools(OptionsToolbar.tools);
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
    export interface Options extends EditToolbar.Options {}
}

export default OptionsToolbar;
