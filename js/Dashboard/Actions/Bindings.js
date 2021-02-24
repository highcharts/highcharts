import ChartComponent from './../Component/ChartComponent.js';
import HTMLComponent from './../Component/HTMLComponent.js';
import GroupComponent from './../Component/GroupComponent.js';
var Bindings = /** @class */ (function () {
    function Bindings() {
    }
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
    Bindings.prototype.addComponent = function (options) {
        var compontentParent = document.getElementById(options.column);
        var component;
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
            component === null || component === void 0 ? void 0 : component.render();
        }
        return component;
    };
    /**
     * chartComponent
     */
    Bindings.prototype.chartComponent = function (compontentParent) {
        return new ChartComponent({
            parentElement: compontentParent,
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
    };
    /**
     * HTMLComponent
     */
    Bindings.prototype.HTMLComponent = function (compontentParent) {
        return new HTMLComponent({
            parentElement: compontentParent,
            elements: [{
                    tagName: 'img',
                    attributes: {
                        src: 'https://i.ytimg.com/vi/qlO4M6MfDFY/hqdefault.jpg',
                        title: 'I heard you like components'
                    }
                }]
        });
    };
    /**
     * groupComponent
     */
    Bindings.prototype.groupComponent = function (compontentParent) {
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
    };
    return Bindings;
}());
export default Bindings;
