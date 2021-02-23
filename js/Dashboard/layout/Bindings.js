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
        var compontentCard = document.querySelectorAll('#' + options.column + ' > .highcharts-dashboard-card')[0];
        var component;
        if (compontentCard) {
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
            component.render();
        }
        return component;
    };
    return Bindings;
}());
export default Bindings;
