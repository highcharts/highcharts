// Experimental support `foreignObject`. This will resolve all z-index issues,
// and we can remove the `foreignObject` regex in Exporting.
(H => {
    // return;
    const { addEvent, css, HTMLElement, SVGElement } = H;

    addEvent(HTMLElement, 'afterInit', function () {

        const renderer = this.renderer,
            { x = 0, y = 0 } = this;

        this.fo = renderer.createElement('foreignObject')
            .attr({
                x,
                y: y - this.renderer.fontMetrics(this).b,
                zIndex: 2
            });
        this.foBody = renderer.createElement('body')
            .attr({ xmlns: 'http://www.w3.org/1999/xhtml' })
            .add(this.fo);
    });

    HTMLElement.prototype.add = function (
        parentGroup
    ) {

        this.fo.add(parentGroup);

        // Like super.add
        SVGElement.prototype.add.call(this, this.foBody);

        const { width, height } = this.getBBox();
        this.fo.attr({ width, height });

        css(this.element, { left: 0, top: 0 });

        return this;
    };
    HTMLElement.prototype.xSetter = function (
        value,
        key
    ) {
        this.fo?.attr(key, value);
        this.doTransform = true;
        css(this.element, { left: 0 });

    };
    HTMLElement.prototype.ySetter = function (
        value,
        key
    ) {
        value -= this.renderer.fontMetrics(this).b;
        this.fo?.attr(key, value);
        this.doTransform = true;
        css(this.element, { left: 0 });
    };

    const updateTransform = HTMLElement.prototype.updateTransform;
    HTMLElement.prototype.updateTransform = function () {
        updateTransform.call(this);
        const { width, height } = this.getBBox();
        this.fo?.attr({ width, height });
        css(this.element, { left: 0, top: 0 });
    };
})(Highcharts);

/*
const ren = new Highcharts.Renderer(
    document.getElementById('container'),
    600,
    400
);

ren.circle(100, 100, 3)
    .attr({
        fill: '#2caffe'
    })
    .add();
ren.text('Hello there', 100, 100, true)
    .add();
// */

Highcharts.chart('container', {

    chart: {
        type: 'column'
    },

    title: {
        text: 'HTML title <i class="fa fa-check"></i>',
        useHTML: true
    },

    yAxis: {
        title: {
            text: 'HTML y-axis <i class="fa fa-check"></i>',
            useHTML: true
        }
    },

    xAxis: {
        type: 'category',
        labels: {
            useHTML: true,
            format: '{value} <i class="fa fa-check"></i>'
        }
    },

    legend: {
        useHTML: true
    },

    tooltip: {
        useHTML: true
    },

    series: [{
        data: [
            ['Ein', 1234],
            ['To', 3456],
            ['Tre', 2345],
            ['Fire', 4567]
        ],
        dataLabels: {
            enabled: true,
            useHTML: true,
            format: '{y} <i class="fa fa-check"></i>'
        },
        name: 'HTML Series <i class="fa fa-check"></i>'
    }]

});
