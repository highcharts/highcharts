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
    ): HTMLComponent|ChartComponent|undefined {
        const compontentCard = document.querySelectorAll('#' + options.column + ' > .highcharts-dashboard-card')[0];

        let component;

        if (compontentCard) {
            if (options.type === 'chart') {
                component = new ChartComponent({
                    parentElement: compontentCard as HTMLDOMElement,
                    chartOptions: {
                        series: [{
                            name: 'Series from options',
                            data: [1, 2, 3, 4]
                        }],
                        chart: {
                            animation: false
                        }
                    },
                    dimensions: {
                        width: 400,
                        height: 400
                    }
                });
            } else {
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
            }

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
        type: string;
    }    
    export interface ComponentOptions {
        options: any;
        component: ChartComponent|HTMLComponent|undefined;
    }
}

export default Bindings;
