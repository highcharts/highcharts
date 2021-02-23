import ChartComponent from './../Component/ChartComponent.js';
import HTMLComponent from './../Component/HTMLComponent.js';

import type {
    HTMLDOMElement
} from '../../Core/Renderer/DOMElementType';
class Bindings {
    /* *
    *
    *  Constructors
    *
    * */
    // public constructor() {
    // }

    /* *
    *
    *  Properties
    *
    * */

    /* *
    *
    *  Functions
    *
    * */
    public addComponent(
        options: Bindings.ComponentType
    ): HTMLComponent|undefined {
        const compontentCard = document.querySelectorAll('#' + options.column + ' > .highcharts-dashboard-card')[0];

        let component;
        if (compontentCard) {
            component = new HTMLComponent({
                parentElement: compontentCard as HTMLDOMElement,
                elements: [{
                    tagName: 'img',
                    attributes: {
                        src: 'https://i.ytimg.com/vi/qlO4M6MfDFY/hqdefault.jpg',
                        title: 'I heard you like components'
                    }
                }]
            });

            component.render();
        }

        return component;
    }
}

namespace Bindings {
    export interface Options {

    }

    export interface ComponentType {
        column: string;
    }    
    export interface ComponentOptions {
        options: any;
        component: ChartComponent|HTMLComponent|undefined;
    }
}

export default Bindings;
