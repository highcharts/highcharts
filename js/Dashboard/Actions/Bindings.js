import ChartComponent from './../Component/ChartComponent.js';
import HTMLComponent from './../Component/HTMLComponent.js';
import GroupComponent from './../Component/GroupComponent.js';
import U from '../../Core/Utilities.js';
var addEvent = U.addEvent, fireEvent = U.fireEvent;
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
        var compontentContainer = document.getElementById(options.column);
        var bindings = this;
        var events = options.events;
        var component;
        // add elements to containers
        if (compontentContainer) {
            switch (options.type) {
                case 'chart':
                    component = bindings.chartComponent(compontentContainer, options);
                    break;
                case 'html':
                    component = bindings.htmlComponent(compontentContainer, options);
                    break;
                /*case 'group':
                    component = bindings.groupComponent(
                        compontentContainer,
                        options.config
                    );
                    break;*/
                default:
                    component = void 0;
            }
            component === null || component === void 0 ? void 0 : component.render();
        }
        // add events
        if (component) {
            for (var key in events) {
                addEvent(component, key, events[key]);
            }
        }
        fireEvent(component, 'onLoad');
        return component;
    };
    /**
     * chartComponent
     */
    Bindings.prototype.chartComponent = function (compontentContainer, options) {
        return new ChartComponent({
            parentElement: compontentContainer,
            chartOptions: options.chartOptions,
            dimensions: options.dimensions
        });
    };
    /**
     * HTMLComponent
     */
    Bindings.prototype.htmlComponent = function (compontentContainer, options) {
        return new HTMLComponent({
            parentElement: compontentContainer,
            elements: options.elements
        });
    };
    /**
     * groupComponent
     */
    Bindings.prototype.groupComponent = function (compontentContainer) {
        return new GroupComponent({
            parentElement: compontentContainer,
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
