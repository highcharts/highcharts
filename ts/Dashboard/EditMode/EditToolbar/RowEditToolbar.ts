import EditMode from '../EditMode.js';
import U from '../../../Core/Utilities.js';
import Row from '../../Layout/Row.js';
import EditToolbar from './EditToolbar.js';
import { HTMLDOMElement } from '../../../Core/Renderer/DOMElementType.js';

const {
    addEvent,
    merge,
    css,
    createElement
} = U;

class RowEditToolbar extends EditToolbar {
    /* *
    *
    *  Static Properties
    *
    * */
    protected static readonly defaultOptions: RowEditToolbar.Options = {
        enabled: true,
        tools: ['drag', 'resizeRow']
    }

    public static tools: Record<string, EditToolbar.ToolOptions> =
    merge(EditToolbar.tools, {
        resizeRow: {
            type: 'resizeRow',
            // className: EditGlobals.classNames.editToolbarItem,
            text: 't2',
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
        options?: RowEditToolbar.Options|undefined
    ) {
        super(editMode, merge(RowEditToolbar.defaultOptions, options || {}));

        // Temp.
        if (this.container) {
            css(this.container, {
                backgroundColor: 'blue'
            });
        }

        this.setEvents();

        super.initTools(RowEditToolbar.tools);
    }

    /* *
    *
    *  Properties
    *
    * */
    public row?: Row;

    /* *
    *
    *  Functions
    *
    * */

    private setEvents(): void {
        const toolbar = this,
            dashboard = toolbar.editMode.dashboard;

        for (let i = 0, iEnd = dashboard.layouts.length; i < iEnd; ++i) {
            const layout = dashboard.layouts[i];

            for (let j = 0, jEnd = layout.rows.length; j < jEnd; ++j) {
                const row = layout.rows[j];

                if (row.container) {
                    addEvent(row.container, 'mousemove', function (): void {
                        toolbar.onMouseMove(row);
                    });
                }
            }
        }
    }

    private onMouseMove(
        row: Row
    ): void {
        const toolbar = this,
            rowCnt = row.container;

        let x, y;

        if (rowCnt) {
            x = rowCnt.offsetLeft;
            y = rowCnt.offsetTop;

            super.show(x, y, ['drag', 'resizeRow'], false);
            toolbar.row = row;
        }
    }

    public hide(): void {
        super.hide();
        this.row = void 0;
    }
}

namespace RowEditToolbar {
    export interface Options extends EditToolbar.Options {}
}

export default RowEditToolbar;
