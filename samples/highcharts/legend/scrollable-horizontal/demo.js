/**
 * Custom Legend extension to allow scrollbar on legend area. Note that the
 * plugin needs enabled legend.useHTML option to move legend into separate SVG
 * element inside div element.
 */

(function (H) {
    const { defined } = H;

    H.addEvent(H.Legend, 'afterRender', function () {
        const legend = this,
            chart = legend.chart,
            {
                custom,
                useHTML,
                layout
            } = legend.options,
            isHorizontal = layout === 'horizontal';

        if (
            defined(custom) &&
            defined(custom.scrollableLegendArea) &&
            useHTML &&
            legend.group.div
        ) {
            const {
                minHeight,
                minWidth
            } = custom.scrollableLegendArea;

            if (!legend.legendWrapper) {
                // Create additional SVG element to put inside additional div
                // after first render
                legend.legendWrapper = chart.renderer
                    .createElement('svg')
                    .attr({
                        version: '1.1',
                        class: 'highcharts-scrollable-legend',
                        height: legend.legendHeight,
                        width: isHorizontal ?
                            legend.contentGroup.getBBox().width :
                            legend.legendWidth
                    });
            }
            const { element } = legend.legendWrapper;
            // Move legend group to the new SVG element
            legend.group.add(legend.legendWrapper);

            // Add SVG element to div
            legend.group.div.appendChild(element);

            // Add style to use native browser scrollbar
            legend.group.div.style.overflow = 'auto';

            if (minHeight) {
                legend.group.div.style.height = minHeight + 'px';
                // Overwrite legend's height
                legend.legendHeight = minHeight;
            }
            if (minWidth) {
                legend.group.div.style.width = minWidth + 'px';
                // Overwrite legend's width
                legend.legendWidth = minWidth;
            }

            legend.align();
            legend.group.element.removeAttribute('transform');
        }
    });
}(Highcharts));

Highcharts.chart('container', {

    title: {
        text: 'Horizontal Scrollable Legend demo'
    },

    exporting: {
        chartOptions: {
            legend: {
                width: void 0
            }
        }
    },

    legend: {
        layout: 'horizontal',
        // Set useHTML to true to put legend SVG into div
        useHTML: true,
        // Set big value for the scrollable legend
        width: 1e6,
        // Use custom properties to configure scrollable legend
        custom: {
            scrollableLegendArea: {
                minWidth: 300
            }
        },
        // Extra space for the Windows scrollbar
        y: -10
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