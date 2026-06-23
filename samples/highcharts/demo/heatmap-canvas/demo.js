(async () => {
    const csv = await fetch(
        // Source: https://p.vikjavev.no/ver/highcharts-demos/heatmap.csv.php?year=2025
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@4cb098f6c3/samples/data/large-heatmap.csv'
    ).then(res => res.text());

    const dataTable = new Highcharts.Data({
        csv,
        parseDate: false
    }).getDataTable();

    Highcharts.chart('container', {

        dataTable,

        chart: {
            type: 'heatmap'
        },

        boost: {
            useGPUTranslations: true
        },

        title: {
            text: 'Large heatmap',
            align: 'left',
            x: 40
        },

        subtitle: {
            text: 'Temperature variation by day and hour through 2025',
            align: 'left',
            x: 40
        },

        xAxis: {
            type: 'datetime',
            min: '2025-01-01',
            max: '2025-12-31 23:59:59',
            labels: {
                align: 'left',
                x: 5,
                y: 14,
                format: '{value:%B}' // long month
            },
            showLastLabel: false,
            tickLength: 16
        },

        yAxis: {
            title: {
                text: null
            },
            labels: {
                format: '{value}:00'
            },
            minPadding: 0,
            maxPadding: 0,
            startOnTick: false,
            endOnTick: false,
            tickPositions: [0, 6, 12, 18, 24],
            tickWidth: 1,
            min: 0,
            max: 23,
            reversed: true
        },

        colorAxis: {
            stops: [
                [0, '#3060cf'],
                [0.5, 'var(--highcharts-background-color)'],
                [0.9, '#fe6a35'],
                [1, '#c4463a']
            ],
            min: -15,
            max: 25,
            startOnTick: false,
            endOnTick: false,
            labels: {
                format: '{value}℃'
            }
        },

        series: [{
            dataMapping: {
                x: 'Date',
                y: 'Time',
                value: 'Temperature'
            },
            boostThreshold: 100,
            turboThreshold: 0, // To allow parsing date strings in data mapping
            borderWidth: 0,
            nullColor: '#EFEFEF',
            colsize: 24 * 36e5, // One day
            tooltip: {
                headerFormat: 'Temperature<br/>',
                pointFormat: '{point.x:%e %b, %Y} {point.y}:00: ' +
                    '<b>{point.value} ℃</b>'
            }
        }]

    });
})();
