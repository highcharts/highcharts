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

import Dashboard from '../Dashboard.js';
import U from '../../Core/Utilities.js';

const { addEvent } = U;

class Fullscreen {

    /* *
    *
    *  Constructor
    *
    * */

    constructor(DashboardClass: Dashboard) {
        this.isOpen = false;
        this.dashboard = DashboardClass;
    }

    /* *
    *
    *  Properties
    *
    * */

    public dashboard: Dashboard;
    public isOpen: boolean;
    private unbindFullscreenEvent?: Function;


    /* *
    *
    *  Functions
    *
    * */

    /**
     * Toggles displaying the dashboard in fullscreen mode.
     */
    public toggle(): void {
        const fullscreen = this,
            isOpen = this.isOpen;

        fullscreen[isOpen ? 'close' : 'open']();
    }

    /**
     * Display dashboard in fullscreen.
     */
    public open(): void {
        if (this.isOpen) {
            return;
        }
        const fullscreen = this,
            dashboard = fullscreen.dashboard;

        // Handle exitFullscreen() method when user clicks 'Escape' button.
        const unbindChange = addEvent(
            dashboard.container.ownerDocument, // dashboard's document
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

        const promise = dashboard.container.requestFullscreen();

        // eslint-disable-next-line highcharts/quote-members
        promise.catch((): void => {
            throw new Error('Full screen is not supported.');
        });
    }

    /**
     * Stops displaying the dashboard in fullscreen mode.
     */
    public close(): void {
        const fullscreen = this,
            dashboard = fullscreen.dashboard;

        // Don't fire exitFullscreen() when user exited using 'Escape' button.
        if (
            fullscreen.isOpen &&
            dashboard.container.ownerDocument instanceof Document
        ) {
            void dashboard.container.ownerDocument.exitFullscreen();
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
        const editMode = this.dashboard.editMode,
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
