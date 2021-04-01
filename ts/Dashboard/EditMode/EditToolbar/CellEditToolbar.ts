import EditMode from '../EditMode.js';
import U from '../../../Core/Utilities.js';
import Cell from '../../Layout/Cell.js';
import EditToolbar from './EditToolbar.js';

const {
    addEvent,
    merge
} = U;

class CellEditToolbar extends EditToolbar {
    /* *
    *
    *  Static Properties
    *
    * */
    protected static readonly defaultOptions: CellEditToolbar.Options = {
        enabled: true,
        tools: ['drag', 'resizeCell']
    }

    public static tools: Record<string, EditToolbar.ToolOptions> =
    merge(EditToolbar.tools, {
        resizeCell: {
            type: 'resizeCell',
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
        options?: CellEditToolbar.Options|undefined
    ) {
        super(editMode, merge(CellEditToolbar.defaultOptions, options || {}));
        this.setEvents();

        super.initTools(CellEditToolbar.tools);
    }

    /* *
    *
    *  Properties
    *
    * */
    public cell?: Cell;

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

                for (let k = 0, kEnd = row.cells.length; k < kEnd; ++k) {
                    const cell = row.cells[k];

                    if (cell.container) {
                        addEvent(cell.container, 'mousemove', function (): void {
                            toolbar.onMouseMove(cell);
                        });
                    }
                }
            }
        }
    }

    private onMouseMove(
        cell: Cell
    ): void {
        const toolbar = this,
            cellCnt = cell.container;

        let x, y;

        if (cellCnt) {
            x = ((cellCnt.parentElement || {}).offsetLeft || 0) +
              cellCnt.offsetLeft + cellCnt.offsetWidth - 30;

            y = ((cellCnt.parentElement || {}).offsetTop || 0) +
              cellCnt.offsetTop;

            super.show(x, y, ['drag', 'resizeCell']);
            toolbar.cell = cell;
        }
    }

    public hide(): void {
        super.hide();
        this.cell = void 0;
    }
}

namespace CellEditToolbar {
    export interface Options extends EditToolbar.Options {}
}

export default CellEditToolbar;
