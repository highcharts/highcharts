import type Layout from './Layout.js';

class GUI {
    /* *
    *
    *  Constructors
    *
    * */
    public constructor(
        options: Layout.Options
    ) {
        this.options = options;
        this.createHTML();
    }

    /* *
    *
    *  Properties
    *
    * */
    public options: Layout.Options;
    /* *
    *
    *  Functions
    *
    * */
    public createHTML(): string {
        /*
        * TODO
        *
        * 1. Assing HTML to layout's container
        * 2. Create layout structure
        * 3. Create cols
        * 4. Create rows
        *
        */

        /**
         * Static HTML for demo
         */
        return `
            <div class="row">
                <div class="col"></div>
                <div class="col"></div>
                <div class="col"></div>
            </div>
            <div class="row">
                <div class="col"></div>
                <div class="col"></div>
                <div class="col"></div>
            </div>            
            <div class="row">
                <div class="col"></div>
                <div class="col"></div>
                <div class="col"></div>
            </div>`;
    }
}
interface GUI {

}

namespace GUI {
    export interface Options {
        enabled: boolean;
        layouts: Array<Layout.Options>;
    }
}

export default GUI;
