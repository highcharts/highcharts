/**
 * Custom Legend extension to allow scrollbar on legend area. The plugin moves
 * the legend into a separate SVG element inside a scrollable div element.
 */

(function (H) {
    const { addEvent, createElement, css } = H;

    addEvent(H.Legend, 'afterRender', function () {
        const legend = this,
            { chart, group, options } = legend,
            area = options.custom && options.custom.scrollableLegendArea;

        if (!area || chart.options.chart.forExport) {
            return;
        }

        const { minHeight, minWidth } = area;

        if (!legend.scrollableDiv) {
            // Create a div with an SVG element to hold the legend group
            legend.scrollableDiv = createElement('div', {
                className: 'highcharts-scrollable-legend'
            }, {
                position: 'absolute',
                // Use native browser scrollbar
                overflow: 'auto'
            }, chart.container);

            legend.scrollableSvg = chart.renderer
                .createElement('svg')
                .attr({ version: '1.1' })
                // Inherit the root font styles
                .css(chart.renderer.style || {});

            legend.scrollableDiv.appendChild(legend.scrollableSvg.element);
            group.add(legend.scrollableSvg);
        }

        legend.scrollableSvg.attr({
            height: legend.legendHeight,
            width: options.layout === 'horizontal' ?
                legend.contentGroup.getBBox().width :
                legend.legendWidth
        });

        // Constrain only one dimension, the other one grows to fit the
        // scrollbar
        if (minHeight) {
            legend.scrollableDiv.style.height = minHeight + 'px';
            // Overwrite legend's height
            legend.legendHeight = minHeight;
        }
        if (minWidth) {
            legend.scrollableDiv.style.width = minWidth + 'px';
            // Overwrite legend's width
            legend.legendWidth = minWidth;
        }

        // Skip animation, the div is positioned from the final translation
        group.placed = false;
        legend.align();

        css(legend.scrollableDiv, {
            left: group.translateX + 'px',
            top: group.translateY + 'px'
        });
        group.element.removeAttribute('transform');
    });
}(Highcharts));

Highcharts.chart('container', {

    title: {
        text: 'Vertical Scrollable Legend demo'
    },

    legend: {
        layout: 'vertical',
        // Use custom properties to configure scrollable legend
        custom: {
            scrollableLegendArea: {
                minHeight: 100
            }
        }
    },

    xAxis: {
        categories: ['A', 'B', 'C', 'D', 'E']
    },

    series: [{
        data: [4.3, 6.22, 4.2, 3.24, 7.07]
    }, {
        data: [3.74, 5.23, 5.12, 4.58, 3.2]
    }, {
        data: [9.62, 4.99, 4.16, 5.77, 7.15]
    }, {
        data: [3.19, 2.57, 8.22, 5.74, 4.46]
    }, {
        data: [2.86, 7.17, 3.87, 5.02, 8.21]
    }, {
        data: [1.75, 4.59, 2.62, 7.54, 1.49]
    }, {
        data: [6.51, 7.1, 5.36, 5, 7.51]
    }, {
        data: [2.83, 1.65, 8.35, 9.37, 1.95]
    }, {
        data: [8.68, 9.94, 6.16, 6.75, 9.37]
    }, {
        data: [9.72, 4.95, 9.91, 4.05, 4.42]
    }, {
        data: [7.79, 5.46, 3.71, 4.39, 4.03]
    }, {
        data: [8.9, 6.47, 1.93, 7.48, 3.85]
    }]
});