/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Sebastian Bochan
 *  - Wojciech Chmiel
 *  - Gøran Slettemark
 *  - Sophie Bremer
 *
 * */

import Board from '../Board.js';
import U from '../../Core/Utilities.js';
import Globals from '../Globals.js';

const { addEvent } = U;

class Fullscreen {

    /* *
    *
    *  Constructor
    *
    * */
    constructor(DashboardClass: Board) {
        this.isOpen = false;
        this.board = DashboardClass;

        // Add class to allow scroll element
        this.board.boardWrapper.classList.add(
            Globals.classNamePrefix + '-fullscreen'
        );
    }

    /* *
    *
    *  Properties
    *
    * */

    public board: Board;
    public isOpen: boolean;
    private unbindFullscreenEvent?: Function;


    /* *
    *
    *  Functions
    *
    * */

    /**
     * Toggles displaying the board in fullscreen mode.
     *
     * @param container
     * The container to be displayed in fullscreen mode.
     */
    public toggle(container?: HTMLElement): void {
        const fullscreen = this,
            isOpen = this.isOpen;

        fullscreen[isOpen ? 'close' : 'open'](container);
    }

    /**
     * Display board in fullscreen.
     */
    public open(container?: HTMLElement): void {
        if (this.isOpen) {
            return;
        }
        const fullscreen = this;
        const board = fullscreen.board;
        const elementToFullscreen = container || board.boardWrapper;

        // Handle exitFullscreen() method when user clicks 'Escape' button.
        const unbindChange = addEvent(
            board.boardWrapper.ownerDocument, // Dashboard's document
            'fullscreenchange',
            function (): void {
                if (fullscreen.isOpen) {
                    fullscreen.isOpen = false;
                    fullscreen.close();
                } else {
                    fullscreen.isOpen = true;
                    fullscreen.setButtonText();
                }
            }
        );

        fullscreen.unbindFullscreenEvent = (): void => {
            unbindChange();
        };

        const promise = elementToFullscreen.requestFullscreen();

        promise['catch']((): void => {
            throw new Error('Full screen is not supported.');
        });
    }

    /**
     * Stops displaying the dashboard in fullscreen mode.
     */
    public close(): void {
        const fullscreen = this;
        const board = fullscreen.board;

        // Don't fire exitFullscreen() when user exited using 'Escape' button.
        if (
            fullscreen.isOpen &&
            board.boardWrapper.ownerDocument instanceof Document
        ) {
            void board.boardWrapper.ownerDocument.exitFullscreen();
        }

        // Unbind event as it's necessary only before exiting from fullscreen.
        if (fullscreen.unbindFullscreenEvent) {
            fullscreen.unbindFullscreenEvent =
                fullscreen.unbindFullscreenEvent();
        }

        fullscreen.isOpen = false;
        this.setButtonText();
    }

    /**
     * Set the correct text depending of the fullscreen is on or of.
     */
    public setButtonText(): void {
        const editMode = this.board.editMode,
            contextMenu = editMode && editMode.tools.contextMenu,
            button = contextMenu && contextMenu.items.viewFullscreen;

        if (button && button.innerElement) {
            const lang = editMode.lang;

            button.innerElement.innerHTML =
                (this.isOpen ? lang.exitFullscreen : lang.viewFullscreen) || '';
        }
    }
}

namespace Fullscreen {

}

export default Fullscreen;
