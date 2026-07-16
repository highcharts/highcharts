/**
 * Grid-specific browser runtime. Registers mount/update helpers on
 * `window.__bench.grid` so scenarios stay declarative. A new product only
 * needs its own runtime file exposing the operations its scenarios use.
 */
(function () {
    var B = window.__bench = window.__bench || {};

    B.grid = {
        instance: null,

        /** Mounts a fresh Grid into a clean container. */
        mount: async function (options) {
            var container = B.reset();
            this.instance = await window.Grid.grid(container, options, true);
            return true;
        },

        /** Applies an options update to the current Grid instance. */
        update: async function (options) {
            await this.instance.update(options, true);
            return true;
        }
    };
})();
