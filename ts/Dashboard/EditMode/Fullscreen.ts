import Dashboard from '../Dashboard.js';
import U from '../../Core/Utilities.js';

const { addEvent } = U;

class Fullscreen {
    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Prepares the dashboard class to support fullscreen.
     * @param {typeof_Dashboard} DashboardClass
     *        The dashboard class to decorate with fullscreen support.
     */
    public static compose(DashboardClass: Dashboard): void {
        // Initialize fullscreen
        DashboardClass.fullscreen = new Fullscreen(DashboardClass);
    }

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
    public unbindFullscreenEvent?: Function;


    /* *
    *
    *  Functions
    *
    * */


    /**
     * Toggles displaying the dashboard in fullscreen mode.
     */
    public toggle(): void {
        const fullscreen = this;

        if (!fullscreen.isOpen) {
            fullscreen.open();
        } else {
            fullscreen.close();
        }
    }

    /**
     * Display dashboard in fullscreen.
     */
    public open(): void {
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
                }
            }
        );

        fullscreen.unbindFullscreenEvent = (): void => {
            unbindChange();
        };

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        dashboard.container.requestFullscreen()['catch']((): void => {
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
    }

}

namespace Fullscreen {

}

export default Fullscreen;
