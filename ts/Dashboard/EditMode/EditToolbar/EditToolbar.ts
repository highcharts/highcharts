import EditMode from '../EditMode.js';
import { HTMLDOMElement } from '../../../Core/Renderer/DOMElementType.js';
import EditGlobals from '../EditGlobals.js';
import U from '../../../Core/Utilities.js';
import type { CSSJSONObject } from '../../../Data/DataCSSObject';

const {
    createElement,
    css,
    merge
} = U;

abstract class EditToolbar {
    /* *
    *
    *  Static Properties
    *
    * */

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
        }
    }

    /* *
    *
    *  Constructor
    *
    * */
    constructor(
        editMode: EditMode,
        options: EditToolbar.Options
    ) {
        this.editMode = editMode;
        this.isVisible = false;
        this.activeTools = [];
        this.options = options;
        this.tools = {};

        this.setContainer();
    }

    /* *
    *
    *  Properties
    *
    * */
    public options: EditToolbar.Options;
    public editMode: EditMode;
    public container?: HTMLDOMElement;
    public isVisible: boolean;
    public tools: Record<string, EditToolbar.Tool>;
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

    protected initTools(
        tools: Record<string, EditToolbar.ToolOptions>
    ): void {
        const toolbar = this;

        let toolOptions,
            element;

        for (let i = 0, iEnd = toolbar.options.tools.length; i < iEnd; ++i) {
            toolOptions = toolbar.options.tools[i];

            const toolSchema = typeof toolOptions === 'string' ? tools[toolOptions] :
                toolOptions.type ? tools[toolOptions.type] : {};

            const tool: EditToolbar.ToolOptions = typeof toolOptions === 'string' ?
                merge(toolSchema, { type: toolOptions }) : merge(toolSchema, toolOptions);

            element = createElement(
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

            // Save initialized tools.
            toolbar.tools[tool.type] = {
                type: tool.type,
                element: element
            };
        }
    }

    public show(
        x: number,
        y: number,
        tools: Array<string>
    ): void {
        const toolbar = this;

        let tool;

        if (toolbar.editMode.isActive() && toolbar.container) {
            css(toolbar.container, {
                left: x + 'px',
                top: y + 'px'
            });

            for (let i = 0, iEnd = tools.length; i < iEnd; ++i) {
                tool = toolbar.tools[tools[i]];

                // Activate tool.
                tool.element.style.display = 'block';
                toolbar.activeTools.push(tool);
            }

            toolbar.isVisible = true;
        }
    }

    public hide(): void {
        const toolbar = this;

        let tool;

        if (toolbar.container) {
            css(toolbar.container, {
                left: '-9999px',
                top: '-9999px'
            });

            for (let i = 0, iEnd = toolbar.activeTools.length; i < iEnd; ++i) {
                tool = toolbar.activeTools[i];

                // Deactivate tool.
                tool.element.style.display = 'none';
            }

            toolbar.activeTools.length = 0;
            toolbar.isVisible = false;
        }
    }
}

namespace EditToolbar {
    export interface Options {
        enabled: boolean;
        tools: Array<ToolOptions|string>;
    }

    export interface ToolOptions {
        type: string;
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
