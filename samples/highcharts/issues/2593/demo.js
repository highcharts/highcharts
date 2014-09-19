
$(function () {

    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            type: 'gauge'

        },
        title: {
            text: 'Regression in 3.0.8 caused mispositioned categories'
        },

        pane: [{
            startAngle: -120,
            endAngle: 120,
            background: null
        }],

        yAxis: {
            min: 0,
            max: 14,
            categories: ['', 'Ingen bestand', '', 'Svært god', '', 'God', '', 'Moderat påvirket', '', 'Dårlig', '', 'Svært dårlig', '', 'Kritisk<br/> eller tapt', ''],
            tickPosition: 'outside',
            labels: {
                rotation: 0,
                distance: 30,
                y: 5
            }

        },

        plotOptions: {
            gauge: {
                enableMouseTracking: false,
                dataLabels: {
                    enabled: false
                },
                dial: {
                    radius: '100%'
                }
            }
        },

        series: [{
            data: [1]
        }]
    });
});