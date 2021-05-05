import U from '../../Core/Utilities.js';
import { HTMLDOMElement } from '../../Core/Renderer/DOMElementType.js';
import Popup from '../../Extensions/Annotations/Popup.js';
import EditGlobals from './EditGlobals.js';
import EditRenderer from './EditRenderer.js';
import { Callbacks } from 'jquery';
import CellEditToolbar from './Toolbar/CellEditToolbar.js';
import RowEditToolbar from './Toolbar/RowEditToolbar.js';

const {
    createElement
} = U;

class ConfirmationPopup extends Popup {
    /* *
    *
    *  Static Properties
    *
    * */

    /* *
    *
    *  Constructor
    *
    * */
    constructor(
        parentNode: HTMLDOMElement,
        options: ConfirmationPopup.Options
    ) {
        super(
            parentNode,
            options.close.icon,
            void 0
        );

        this.options = options;
    }

    /* *
    *
    *  Properties
    *
    * */
    public options: ConfirmationPopup.Options;
    public contentContainer: HTMLDOMElement|undefined;

    /* *
    *
    *  Functions
    *
    * */

    public renderContent(
        confirmCallback: Function,
        context: RowEditToolbar|CellEditToolbar
    ): void {
        // render content wrapper
        this.contentContainer = createElement(
            'div', {
                className: EditGlobals.classNames.popupContentContainer
            }, {},
            this.container
        );

        // render text
        EditRenderer.renderText(
            this.contentContainer,
            'Do you want to destroy the element?'
        );

        // render buttons
        // Cancel
        EditRenderer.renderButton(
            this.contentContainer,
            {
                value: 'Cancel',
                callback: (): void => {
                    this.closePopup();
                }
            }
        );

        // Confirm
        EditRenderer.renderButton(
            this.contentContainer,
            {
                value: 'Confirm',
                className: EditGlobals.classNames.popupConfirmBtn,
                callback: (): void => {
                    // run callback
                    confirmCallback.call(context);
                    // hide popup
                    this.closePopup();
                }
            }
        );
    }

    public show(
        confirmCallback: Function,
        context: RowEditToolbar|CellEditToolbar
    ): void {
        this.showPopup();
        this.renderContent(
            confirmCallback,
            context
        );
    }
}

namespace ConfirmationPopup {
    export interface Options {
        close: CloseIcon;
    }

    export interface CloseIcon {
        icon: string;
    }
}

export default ConfirmationPopup;
