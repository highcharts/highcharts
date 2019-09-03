/*!*
 *
 *  Copyright (c) Highsoft AS. All rights reserved.
 *
 *!*/
/**
 * Useful functions for test purposes.
 */
declare class TestUtilities {
    private static readonly timeString;
    /**
     * A string representation for the current browser. Possible values are
     * `Chrome`, `Edge`, `Firefox`, `MSIE`, `Netscape`, `Opera`, `PhantomJS`,
     * `Safari`, and an empty string for unknown browsers.
     */
    static readonly browser: string;
    /**
     * Indiciates, if system time runs in CET timezone.
     */
    private static readonly isCET;
    /**
     * Calls a function only, if the system is set to specific timezones.
     *
     * @param timezones
     * Possible values are CET, CEST, etc.
     *
     * @param fn
     * The function to call. First argument is the matching timezone string.
     */
    static ifTimezone<T>(timezones: Array<string>, fn: (timezoneString: string) => T): (T | undefined);
    /**
     * Convenient wrapper for installing lolex and bypassing
     * requestAnimationFrame. Returns a clock object.
     *
     * @param lolexConfig
     *        Config supplied to lolex.install
     */
    private static lolexInstall;
    /**
     * Convenient wrapper for uninstalling lolex.
     *
     * @param clock
     * The clock object
     */
    private static lolexUninstall;
    /**
     * Convenience wrapper for running timeouts and uninstalling lolex.
     *
     * @param clock
     * The clock object
     */
    private static lolexRunAndUninstall;
}
