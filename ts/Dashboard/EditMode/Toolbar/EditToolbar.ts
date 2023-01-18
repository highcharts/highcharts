/* *
 *
 *  (c) 2009 - 2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sebastian Bochan
 *  - Wojciech Chmiel
 *  - Gøran Slettemark
 *  - Sophie Bremer
 *
 * */

'use strict';

import EditMode from '../EditMode.js';
import U from '../../../Core/Utilities.js';
const {
    defined,
    createElement,
    css
} = U;
import Menu from '../Menu/Menu.js';
import { HTMLDOMElement } from '../../../Core/Renderer/DOMElementType.js';
import GUIElement from '../../Layout/GUIElement.js';


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
            'div',
            {
                className: options.className
            },
            void 0,
            editMode.dashboard.container
        );

        this.editMode = editMode;
        this.menu = new Menu(
            this.container,
            options.menu,
            editMode,
            this
        );

        this.options = options;
        this.isVisible = false;

        if (this.options.outline) {
            this.outline = createElement(
                'div',
                {
                    className: options.outlineClassName
                },
                void 0,
                this.container
            );
        }
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
    public outline?: HTMLDOMElement;

    /* *
     *
     *  Functions
     *
     * */

    public hide(): void {
        this.setPosition(void 0, void 0);
    }

    public refreshOutline(
        x: number,
        y: number,
        guiElement?: GUIElement,
        offset: number = 0
    ): void {
        const toolbar = this,
            guiElemCnt = (guiElement || {}).container;

        if (toolbar.outline && guiElemCnt) {
            css(toolbar.outline, {
                display: 'block',
                left: x - offset + 'px',
                top: y - offset + 'px',
                width: guiElemCnt.offsetWidth + offset * 2 + 'px',
                height: guiElemCnt.offsetHeight + offset * 2 + 'px'
            });
        }
    }

    public hideOutline(): void {
        if (this.outline) {
            this.outline.style.display = 'none';
        }
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

    // public maskNotEditedElements(
    //     currentElement: Cell|Row,
    //     isRow?: boolean
    // ): void {
    //     const components = isRow ?
    //         (currentElement as Row).layout.dashboard.mountedComponents :
    //         (currentElement as Cell).row.layout.dashboard.mountedComponents;

    //     // set opacity
    //     for (let i = 0, iEnd = components.length; i < iEnd; ++i) {
    //         (components[i].cell.container as HTMLDOMElement).classList.add(
    //             EditGlobals.classNames.maskElement
    //         );
    //     }

    //     // highlight current element
    //     if (isRow) {
    //         this.unmaskRow(
    //             currentElement as Row
    //         );
    //     } else {
    //         (currentElement.container as HTMLDOMElement).classList.remove(
    //             EditGlobals.classNames.maskElement
    //         );
    //     }
    // }

    // public unmaskRow(
    //     row: Row
    // ): void {
    //     const cells = row.cells;
    //     let nestedLayout: Layout|undefined;
    //     let rows;

    //     for (let i = 0, iEnd = cells.length; i < iEnd; ++i) {
    //         nestedLayout = cells[i].nestedLayout;

    //         if (nestedLayout) {
    //             rows = nestedLayout.rows;
    //             for (let j = 0, jEnd = rows.length; j < jEnd; ++j) {
    //                 this.unmaskRow(
    //                     rows[j]
    //                 );
    //             }
    //         } else {
    //             (cells[i].container as HTMLDOMElement).classList.remove(
    //                 EditGlobals.classNames.maskElement
    //             );
    //         }
    //     }
    // }

    // public resetCurrentElements(
    //     currentElement: Cell|Row,
    //     isRow?: boolean
    // ): void {
    //     if (currentElement) {
    //         const components = isRow ?
    //             (currentElement as Row).layout.dashboard.mountedComponents :
    //          (currentElement as Cell).row.layout.dashboard.mountedComponents;
    //         let cellContainer;

    //         // set opacity
    //         for (let i = 0, iEnd = components.length; i < iEnd; ++i) {
    //             cellContainer = components[i].cell.container;
    //             if (cellContainer) {
    //                 (cellContainer as HTMLDOMElement).classList.remove(
    //                     EditGlobals.classNames.maskElement
    //                 );
    //             }
    //         }
    //     }
    // }
}

namespace EditToolbar {
    export interface Options {
        enabled: boolean;
        className: string;
        outline: boolean;
        outlineClassName: string;
        menu: Menu.Options;
    }
}

export default EditToolbar;
