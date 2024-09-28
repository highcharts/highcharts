const labelsNumber = 40;

Highcharts.chart('container', {
    title: {
        text: 'Highcharts Annotations'
    },

    subtitle: {
        text: 'Labels should not overlap'
    },

    series: [{
        type: 'scatter',
        keys: ['x', 'y', 'id'],
        data: (function () {
            const data = [];

            for (let i = 0; i <= labelsNumber; i++) {
                data.push([i / labelsNumber * 2, i, 'id' + i]);
            }

            return data;
        }())
    }],

    xAxis: {
        min: 0,
        max: 2
    },

    annotations: [{
        labels: (function () {
            const labels = [];

            for (let i = 0; i <= labelsNumber; i++) {
                labels.push({
                    point: 'id' + i
                });
            }

            return labels;
        }()),
        labelOptions: {
            //  allowOverlap: false
        }
    }]
});