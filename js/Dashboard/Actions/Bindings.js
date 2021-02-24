import ChartComponent from './../Component/ChartComponent.js';
import HTMLComponent from './../Component/HTMLComponent.js';
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
        var compontentCard = document.getElementById(options.column);
        var component;
        if (compontentCard) {
            if (options.type === 'chart') {
                component = new ChartComponent({
                    parentElement: compontentCard,
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
            else {
                component = new HTMLComponent({
                    parentElement: compontentCard,
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
    };
    return Bindings;
}());
export default Bindings;
