import EditMode from './EditMode.js';
import { HTMLDOMElement } from '../../Core/Renderer/DOMElementType.js';
import EditGlobals from './EditGlobals.js';
import U from '../../Core/Utilities.js';
import Cell from './../Layout/Cell.js';
import type { CSSJSONObject } from './../../Data/DataCSSObject';

const {
    addEvent,
    createElement,
    css,
    merge
} = U;

class EditToolbar {
    /* *
    *
    *  Static Properties
    *
    * */
    protected static readonly defaultOptions: EditToolbar.Options = {
        enabled: true,
        tools: ['drag', 'resize']
    }

    public static tools: Record<string, EditToolbar.ToolOptions> = {
        separator: {
            type: 'separator',
            text: '',
            className: EditGlobals.classNames.separator
        },
        drag: {
            type: 'drag',
            // className: EditGlobals.classNames.editToolbarItem,
            text: 't1',
            events: {
                click: function (this: EditToolbar, e: any): void {}
            }
        },
        resize: {
            type: 'resize',
            // className: EditGlobals.classNames.editToolbarItem,
            text: 't2',
            events: {
                click: function (): void {}
            }
        }
    }

    /* *
    *
    *  Constructor
    *
    * */
    constructor(
        editMode: EditMode,
        options?: EditToolbar.Options|undefined
    ) {
        this.editMode = editMode;
        this.isVisible = false;
        this.activeTools = [];
        this.options = merge(EditToolbar.defaultOptions, options || {});

        this.setContainer();
        this.setEvents();
        this.initTools();
    }

    /* *
    *
    *  Properties
    *
    * */
    public options: EditToolbar.Options;
    public editMode: EditMode;
    public container?: HTMLDOMElement;
    public cell?: Cell;
    public isVisible: boolean;
    public activeTools: Array<EditToolbar.Tool>;

    /* *
    *
    *  Functions
    *
    * */
    private setContainer(): void {
        const toolbar = this,
            dashboard = this.editMode.dashboard;

        toolbar.container = createElement(
            'div', {
                className: EditGlobals.classNames.editToolbar
            }, {
                width: '30px',
                height: '80px',
                top: '-9999px',
                left: '-9999px',
                backgroundColor: 'red',
                position: 'absolute',
                zIndex: 99
            }, dashboard.container
        );
    }

    private initTools(): void {
        const toolbar = this;

        let toolOptions;

        for (let i = 0, iEnd = toolbar.options.tools.length; i < iEnd; ++i) {
            toolOptions = toolbar.options.tools[i];

            const toolSchema = typeof toolOptions === 'string' ? EditToolbar.tools[toolOptions] :
                toolOptions.type ? EditToolbar.tools[toolOptions.type] : {};

            const tool: EditToolbar.ToolOptions = typeof toolOptions === 'string' ?
                merge(toolSchema, { type: toolOptions }) : merge(toolSchema, toolOptions);

            createElement(
                'div', {
                    textContent: tool.text,
                    onclick: function (): void {
                        if (tool.events && tool.events.click) {
                            tool.events.click.apply(toolbar, arguments);
                        }
                    },
                    className: EditGlobals.classNames.editToolbarItem + ' ' +
                        (tool.className || '')
                },
                tool.style || {},
                toolbar.container
            );
        }
    }

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

        if (toolbar.container && cellCnt) {
            css(toolbar.container, {
                left: ((cellCnt.parentElement || {}).offsetLeft || 0) +
                  cellCnt.offsetLeft + cellCnt.offsetWidth - 30 + 'px',
                top: ((cellCnt.parentElement || {}).offsetTop || 0) +
                  cellCnt.offsetTop + 'px'
            });

            toolbar.isVisible = true;
            toolbar.cell = cell;
        }
    }
}

namespace EditToolbar {
    export interface Options {
        enabled: boolean;
        tools: Array<ToolOptions|string>;
    }

    export interface ToolOptions {
        type?: string;
        text?: string;
        className?: string;
        events?: Record<Event['type'], Function>;
        style?: CSSJSONObject;
    }

    export interface Tool {
        type: string;
        element: HTMLDOMElement;
    }
}

export default EditToolbar;
