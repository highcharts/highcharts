import ChartComponent from './../Component/ChartComponent.js';
import HTMLComponent from './../Component/HTMLComponent.js';
import GroupComponent from './../Component/GroupComponent.js';

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
    ): HTMLComponent|ChartComponent|GroupComponent|undefined {
        const compontentParent = document.getElementById(options.column);
        let component;

        if (compontentParent) {

            switch (options.type) {
                case 'chart':
                    component = this.chartComponent(compontentParent);
                    break;
                case 'html':
                    component = this.HTMLComponent(compontentParent);
                    break;
                case 'group':
                    component = this.groupComponent(compontentParent);
                    break;
                default:
                    component = void 0;
            }

            component?.render();
        }

        return component;
    }

    /**
     * chartComponent
     */
    public chartComponent(
        compontentParent: HTMLDOMElement
    ):ChartComponent {
        return new ChartComponent({
            parentElement: compontentParent as HTMLDOMElement,
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
    }

    /**
     * HTMLComponent
     */
    public HTMLComponent(
        compontentParent: HTMLDOMElement
    ):HTMLComponent {
        return new HTMLComponent({
            parentElement: compontentParent as HTMLDOMElement,
            elements: [{
                tagName: 'img',
                attributes: {
                    src: 'https://i.ytimg.com/vi/qlO4M6MfDFY/hqdefault.jpg',
                    title: 'I heard you like components'
                }
            }]
        });
    }

    /**
     * groupComponent
     */
    public groupComponent(
        compontentParent: HTMLDOMElement
    ): GroupComponent {
        return new GroupComponent({
            parentElement: compontentParent,
            direction: 'column',
            components: [
                new HTMLComponent({
                    elements: [{
                        tagName: 'img',
                        attributes: {
                            src: 'https://i.ytimg.com/vi/qlO4M6MfDFY/hqdefault.jpg',
                            title: 'I heard you like components'
                        }
                    }]
                }),
                new ChartComponent({
                    chartOptions: {
                        series: [{
                            type: 'pie',
                            data: [1, 2, 3]
                        }]
                    }
                })
            ]
        });
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
        component: ChartComponent|HTMLComponent|GroupComponent|undefined;
    }
}

export default Bindings;
