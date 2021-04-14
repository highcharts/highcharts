import EditMode from '../EditMode.js';
import U from '../../../Core/Utilities.js';
import Menu from '../Menu/Menu.js';
import { HTMLDOMElement } from '../../../Core/Renderer/DOMElementType.js';
import EditGlobals from '../EditGlobals.js';
import Row from '../../Layout/Row.js';
import Cell from '../../Layout/Cell.js';

const {
    defined,
    createElement,
    css
} = U;

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
            'div', {
                className: options.className
            }, {},
            editMode.dashboard.container
        );
        this.editMode = editMode;
        this.menu = new Menu(
            this.container,
            options.menu,
            this
        );

        this.options = options;
        this.isVisible = false;
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

    /* *
    *
    *  Functions
    *
    * */
    public hide(): void {
        this.setPosition(void 0, void 0);
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

    public maskNotEditedElements(
        element: Cell|Row,
        isRow?: boolean
    ): void {
        // reset current elements
        this.resetCurrentElements();

        // set current element
        (element.container as HTMLDOMElement).classList.add(
            isRow ? EditGlobals.classNames.currentEditedRow :
                EditGlobals.classNames.currentEditedCell
        );

        if (!isRow) {
            (element as Cell).row.layout.dashboard.container.classList.add(
                EditGlobals.classNames.disabledNotEditedCells
            );
        } else {
            (element as Row).layout.dashboard.container.classList.add(
                EditGlobals.classNames.disabledNotEditedRows
            );

            // add border

        }
    }

    public resetCurrentElements(): void {
        // reset current cells
        const currentCells = document.getElementsByClassName(
            EditGlobals.classNames.currentEditedCell
        );

        if (currentCells && currentCells.length) {
            currentCells[0].classList.remove(
                EditGlobals.classNames.currentEditedCell
            );
        }

        // reset current rows
        const currentRows = document.getElementsByClassName(
            EditGlobals.classNames.currentEditedRow
        );

        if (currentRows && currentRows.length) {
            currentRows[0].classList.remove(
                EditGlobals.classNames.currentEditedRow
            );
        }
    }
}

namespace EditToolbar {
    export interface Options {
        enabled: boolean;
        className: string;
        menu: Menu.Options;
    }
}

export default EditToolbar;
