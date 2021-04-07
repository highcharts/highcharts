import EditMode from '../EditMode.js';
import U from '../../../Core/Utilities.js';
import Row from '../../Layout/Row.js';
import EditGlobals from '../EditGlobals.js';
import Menu from '../Menu/Menu.js';
import MenuItem from '../Menu/MenuItem.js';

const {
    addEvent,
    merge,
    css,
    objectEach
} = U;

class RowEditToolbar extends Menu {
    /* *
    *
    *  Static Properties
    *
    * */
    protected static readonly defaultOptions: RowEditToolbar.Options = {
        enabled: true,
        className: EditGlobals.classNames.editToolbar,
        itemsClassName: EditGlobals.classNames.editToolbarItem,
        items: ['drag', 'resizeRow']
    }

    public static items: Record<string, MenuItem.Options> =
    merge(Menu.items, {
        drag: {
            type: 'drag',
            text: 't1',
            events: {
                click: function (): void {}
            }
        },
        resizeRow: {
            type: 'resizeRow',
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
        super(
            editMode.dashboard.container,
            merge(RowEditToolbar.defaultOptions, options || {})
        );

        this.editMode = editMode;

        // Temp.
        if (this.container) {
            css(this.container, {
                backgroundColor: '#252526'
            });
        }

        this.setEvents();

        super.initItems(RowEditToolbar.items);
    }

    /* *
    *
    *  Properties
    *
    * */
    public row?: Row;
    public editMode: EditMode;

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

        if (rowCnt && toolbar.editMode.isActive()) {
            x = rowCnt.offsetLeft;
            y = rowCnt.offsetTop;

            // Temp - activate all items.
            objectEach(toolbar.items, (item): void => {
                item.activate();
            });
            super.show(x, y);

            toolbar.row = row;
        }
    }

    public hide(): void {
        super.hide();
        this.row = void 0;
    }
}

namespace RowEditToolbar {
    export interface Options extends Menu.Options {}
}

export default RowEditToolbar;
