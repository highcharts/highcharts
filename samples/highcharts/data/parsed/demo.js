Highcharts.chart('container', {

    title: {
        text: 'Global temperature change'
    },

    subtitle: {
        text: 'Data module: parsed columns are modified, should start from 1950'
    },

    data: {
        csv: document.getElementById('csv').innerHTML,
        parsed: function (columns) {
            // We want to keep the values since 1950 only
            columns.forEach(column => {
                // Keep the first item which is the series name, then remove the following 70
                column.splice(1, 70);
            });
        }
    },

    plotOptions: {
        series: {
            marker: {
                enabled: false
            }
        }
    },

    series: [{
        lineWidth: 1
    }, {
        type: 'areaspline',
        color: '#c4392d',
        negativeColor: '#5679c4',
        fillOpacity: 0.5
    }]
});