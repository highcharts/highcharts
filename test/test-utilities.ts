/*!*
 *
 *  Copyright (c) Highsoft AS. All rights reserved.
 *
 *!*/

/**
 * Useful functions for test purposes.
 */
class TestUtilities {

    /* *
     *
     *  Constants
     *
     * */

    private static readonly timeString: string = new Date().toTimeString();

    /**
     * A string representation for the current browser. Possible values are
     * `Chrome`, `Edge`, `Firefox`, `MSIE`, `Netscape`, `Opera`, `PhantomJS`,
     * `Safari`, and an empty string for unknown browsers.
     */
    public static readonly browser: string = (function () {
        var userAgent = window.navigator.userAgent;
        if ((new RegExp('MSIE|Trident', 'i')).test(userAgent) &&
            !(new RegExp('Opera', 'i')).test(userAgent)
        ) {
            return 'MSIE';
        }
        if ((new RegExp('Firefox', 'i')).test(userAgent)) {
            return 'Firefox';
        }
        if ((new RegExp('Edge', 'i')).test(userAgent)) {
            return 'Edge';
        }
        if ((new RegExp('Chrome', 'i')).test(userAgent)) {
            return 'Chrome';
        }
        if ((new RegExp('PhantomJS', 'i')).test(userAgent)) {
            return 'PhantomJS';
        }
        if ((new RegExp('Safari', 'i')).test(userAgent)) {
            return 'Safari';
        }
        if ((new RegExp('Opera', 'i')).test(userAgent)) {
            return 'Opera';
        }
        if ((new RegExp('Netscape', 'i')).test(userAgent)) {
            return 'Netscape';
        }
        return '';
    }());

    /**
     * Indiciates, if system time runs in CET timezone.
     */
    private static readonly isCET: boolean = (
        TestUtilities.timeString.indexOf('CET') !== -1 ||
        TestUtilities.timeString.indexOf('CEST') !== -1 ||
        TestUtilities.timeString.indexOf('W. Europe Standard Time') !== -1
    );

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Calls a function only, if the system is set to specific timezones.
     *
     * @param timezones
     * Possible values are CET, CEST, etc.
     *
     * @param fn
     * The function to call. First argument is the matching timezone string.
     */
    public static ifTimezone<T>(
        timezones: Array<string>, fn: (timezoneString: string) => T
    ): (T | undefined) {

        var timezoneString;

        for (var i = 0, ie = timezones.length; i < ie; ++i) {
            if (TestUtilities.timeString.indexOf(timezones[i]) >= 0) {
                timezoneString = timezones[i];
                break;
            }
        }

        if (timezoneString) {
            return fn(timezoneString);
        }
    }

    /**
     * Convenient wrapper for installing lolex and bypassing
     * requestAnimationFrame. Returns a clock object.
     *
     * @param lolexConfig
     *        Config supplied to lolex.install
     */
    private static lolexInstall (lolexConfig?: any): (LolexClock|undefined) {
        if (!lolex) {
            return;
        }

        const win = (window as any);

        win.backupRequestAnimationFrame = win.requestAnimationFrame;
        win.requestAnimationFrame = null;

        // Abort running animations, otherwise they will take over
        (Highcharts as any).timers.length = 0;

        return lolex.install(lolexConfig);
    }

    /**
     * Convenient wrapper for uninstalling lolex.
     *
     * @param clock
     * The clock object
     */
    private static lolexUninstall (clock?: LolexClock) {

        if (!clock || !lolex) {
            return;
        }

        const win = (window as any);

        clock.uninstall();

        // Reset native requestAnimationFrame
        win.requestAnimationFrame = win.backupRequestAnimationFrame;
        delete win.backupRequestAnimationFrame;
    }

    /**
     * Convenience wrapper for running timeouts and uninstalling lolex.
     *
     * @param clock
     * The clock object
     */
    private static lolexRunAndUninstall (clock?: LolexClock) { // eslint-disable-line no-unused-vars

        if (!clock || !lolex) {
            return;
        }

        clock.runAll();

        TestUtilities.lolexUninstall(clock);
    }
}
