import Dashboard from '../Dashboard.js';

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

        // eslint-disable-next-line no-console
        console.log('Constructor of fullscreen');
    }

    /* *
    *
    *  Properties
    *
    * */

    public dashboard: Dashboard;
    public isOpen: boolean;


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
        // eslint-disable-next-line no-console
        console.log('open');
        this.isOpen = false;
    }
    /**
     * Stops displaying the dashboard in fullscreen mode.
     */
    public close(): void {
        // eslint-disable-next-line no-console
        console.log('close');
        this.isOpen = true;
    }

}

namespace Fullscreen {

}

export default Fullscreen;
