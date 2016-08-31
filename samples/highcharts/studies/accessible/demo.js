$(function () {

    // Code snippet for adding a HTML table representation of the chart data
    Highcharts.Chart.prototype.callbacks.push(function (chart) {

        var div = document.createElement('div'),
            ariaTable;

        chart.container.parentNode.appendChild(div);
        div.innerHTML = chart.getTable();
        ariaTable = div.getElementsByTagName('table')[0];

        // Set ARIA attributes
        chart.renderTo.setAttribute('aria-label', 'A chart. ' + chart.options.title.text + '. ' + chart.options.subtitle.text);
        chart.container.setAttribute('aria-hidden', true);
        div.setAttribute('aria-label', 'A tabular view of the data in the chart.');
        div.style.position = 'absolute';
        div.style.left = '-9999em';
        div.style.width = '1px';
        div.style.height = '1px';
        div.style.overflow = 'hidden';
    });


    $('#container').highcharts({

        title: {
            text: 'Accessible Highcharts'
        },

        subtitle: {
            text: 'A hidden but machine readable HTML table contains this chart\'s data'
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]

    });
});
