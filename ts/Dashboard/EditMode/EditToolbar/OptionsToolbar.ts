import EditMode from '../EditMode.js';
import U from '../../../Core/Utilities.js';
import Cell from '../../Layout/Cell.js';
import Row from '../../Layout/Row.js';
import Layout from '../../Layout/Layout.js';
import EditToolbar from './EditToolbar.js';

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

        // Temp.
        if (this.container) {
            css(this.container, {
                backgroundColor: '#efefef',
                border: '1px solid #000',
                position: 'absolute',
                height: '100%',
                width: '300px',
                zIndex: 99999
            });
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
        super.show(0, 0, tools);
    }

    public hide(): void {
        super.hide();
        this.guiElement = void 0;
    }
}

namespace OptionsToolbar {
    export interface Options extends EditToolbar.Options {}
}

export default OptionsToolbar;
