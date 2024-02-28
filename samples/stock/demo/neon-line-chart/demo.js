(async () => {
    // Load the dataset
    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-ohlc.json'
    ).then(response => response.json());

    Highcharts.setOptions({
        lang: {
            rangeSelectorZoom: ''
        }
    });

    Highcharts.stockChart('container', {
        chart: {
            styledMode: true
        },

        rangeSelector: {
            verticalAlign: 'bottom',
            x: 0,
            y: 0,
            buttonSpacing: 40
        },

        navigator: {
            enabled: false
        },

        title: {
            text: 'AAPL',
            align: 'left',
            x: 50,
            y: 50
        },

        plotOptions: {
            series: {
                marker: {
                    enabled: false
                }
            }
        },

        xAxis: {
            visible: false,
            crosshair: {
                snap: false
            }
        },

        yAxis: {
            visible: false,
            crosshair: {
                snap: false
            }
        },

        defs: {
            neon: {
                tagName: 'filter',
                id: 'neon',
                children: [{
                    tagName: 'feDropShadow',
                    dx: 0,
                    dy: 0,
                    stdDeviation: 1,
                    'flood-color': '#ffffff'
                }, {
                    tagName: 'feDropShadow',
                    dx: 0,
                    dy: 0,
                    stdDeviation: 2,
                    'flood-color': '#ffffff',
                    'flood-opacity': 0.5
                }, {
                    tagName: 'feDropShadow',
                    dx: 0,
                    dy: 0,
                    stdDeviation: 2,
                    'flood-color': '#f27ce6'
                }, {
                    tagName: 'feDropShadow',
                    dx: 0,
                    dy: 0,
                    stdDeviation: 8,
                    'flood-color': '#f27ce6',
                    'flood-opacity': 0.7
                }]
            },

            neonSubtle: {
                tagName: 'filter',
                id: 'neon-subtle',
                x: -50,
                y: -50,
                width: 100,
                height: 100,
                children: [{
                    tagName: 'feDropShadow',
                    dx: 0,
                    dy: 0,
                    stdDeviation: 0.8,
                    'flood-color': '#ffffff'
                }, {
                    tagName: 'feDropShadow',
                    dx: 0,
                    dy: 0,
                    stdDeviation: 1,
                    'flood-color': '#ffffff'
                }, {
                    tagName: 'feDropShadow',
                    dx: 0,
                    dy: 0,
                    stdDeviation: 2,
                    'flood-color': '#f27ce6',
                    'flood-opacity': 0.5
                }, {
                    tagName: 'feDropShadow',
                    dx: 0,
                    dy: 0,
                    stdDeviation: 3,
                    'flood-color': '#f27ce6'
                }, {
                    tagName: 'feDropShadow',
                    dx: 0,
                    dy: 0,
                    stdDeviation: 10,
                    'flood-color': '#f27ce6',
                    'flood-opacity': 0.5
                }]
            }
        },

        series: [{
            name: 'AAPL Stock Price',
            data: data
        }]
    });
})();
