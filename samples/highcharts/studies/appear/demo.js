/**
 * Highcharts plugin to defer initial series animation until the element has
 * appeared.
 *
 * Updated 2019-04-10
 *
 * @todo
 * - If the element is greater than the viewport (or a certain fraction of it),
 *   show the series when it is partially visible.
 */
(function (H) {

    const pendingRenders = [];

    // https://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport/7557433#7557433
    function isElementInViewport(el) {

        const rect = el.getBoundingClientRect();

        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (
                window.innerHeight ||
                document.documentElement.clientHeight
            ) &&
            rect.right <= (
                window.innerWidth ||
                document.documentElement.clientWidth
            )
        );
    }

    H.wrap(H.Series.prototype, 'render', function deferRender(proceed) {
        const series = this,
            renderTo = this.chart.container.parentNode;

        // It is appeared, render it
        if (isElementInViewport(renderTo) || !series.options.animation) {
            proceed.call(series);

        // It is not appeared, halt renering until appear
        } else  {
            pendingRenders.push({
                element: renderTo,
                appear: function () {
                    proceed.call(series);
                }
            });
        }
    });

    function recalculate() {
        pendingRenders.forEach(function (item) {
            if (isElementInViewport(item.element)) {
                item.appear();
                H.erase(pendingRenders, item);
            }
        });
    }

    if (window.addEventListener) {
        ['DOMContentLoaded', 'load', 'scroll', 'resize']
            .forEach(function (eventType) {
                addEventListener(eventType, recalculate, false);
            });
    }

}(Highcharts));

Highcharts.chart('container1', {

    chart: {
        type: 'area'
    },

    title: {
        text: 'Area chart'
    },

    xAxis: {
        type: 'category'
    },

    series: [{
        data: [
            ['Jan', 29.9],
            ['Feb', 71.5],
            ['Mar', 106.4],
            ['Apr', 129.2],
            ['May', 144.0],
            ['Jun', 176.0],
            ['Jul', 135.6],
            ['Aug', 148.5],
            ['Sep', 216.4],
            ['Oct', 194.1],
            ['Nov', 95.6],
            ['Dec', 54.4]
        ]
    }]

});

Highcharts.chart('container2', {

    chart: {
        type: 'pie'
    },

    title: {
        text: 'Pie chart'
    },

    series: [{
        data: [
            ['Jan', 29.9],
            ['Feb', 71.5],
            ['Mar', 106.4],
            ['Apr', 129.2],
            ['May', 144.0],
            ['Jun', 176.0],
            ['Jul', 135.6],
            ['Aug', 148.5],
            ['Sep', 216.4],
            ['Oct', 194.1],
            ['Nov', 95.6],
            ['Dec', 54.4]
        ]
    }]

});

Highcharts.chart('container3', {

    chart: {
        type: 'column'
    },

    title: {
        text: 'Column chart'
    },

    xAxis: {
        type: 'category'
    },

    series: [{
        data: [
            ['Jan', 29.9],
            ['Feb', 71.5],
            ['Mar', 106.4],
            ['Apr', 129.2],
            ['May', 144.0],
            ['Jun', 176.0],
            ['Jul', 135.6],
            ['Aug', 148.5],
            ['Sep', 216.4],
            ['Oct', 194.1],
            ['Nov', 95.6],
            ['Dec', 54.4]
        ]
    }]

});

Highcharts.chart('container4', {

    chart: {
        type: 'bubble'
    },

    title: {
        text: 'Bubble chart'
    },

    series: [{
        data: [
            [1, 2, 3],
            [5, 4, 3],
            [7, 5, 4],
            [8, 4, 5],
            [7, 5, 4]
        ]
    }]

});
