const dataURL = 'https://demo-live-data.highcharts.com/aapl-historical.json';

/**
 * Load new data depending on the selected min and max
 */
function afterSetExtremes(e) {
    const { chart } = e.target;
    chart.showLoading('Loading data from server...');
    fetch(`${dataURL}?start=${Math.round(e.min)}&end=${Math.round(e.max)}`)
        .then(res => res.ok && res.json())
        .then(data => {
            chart.series[0].setData(data);
            chart.hideLoading();
        }).catch(error => console.error(error.message));
}

fetch(dataURL)
    .then(res => res.ok && res.json())
    .then(data => {

        // Add a null value for the end date
        data.push([Date.UTC(2011, 9, 14, 18), null, null, null, null]);

        // create the chart
        Highcharts.stockChart('container', {
            chart: {
                type: 'candlestick',
                zoomType: 'x'
            },

            navigator: {
                adaptToUpdatedData: false,
                series: {
                    data: data
                }
            },

            scrollbar: {
                liveRedraw: false
            },

            title: {
                text: 'AAPL history by the minute from 1998 to 2011',
                align: 'left'
            },

            subtitle: {
                text: 'Displaying 1.7 million data points in Highcharts Stock by async server loading',
                align: 'left'
            },

            rangeSelector: {
                buttons: [{
                    type: 'hour',
                    count: 1,
                    text: '1h'
                }, {
                    type: 'day',
                    count: 1,
                    text: '1d'
                }, {
                    type: 'month',
                    count: 1,
                    text: '1m'
                }, {
                    type: 'year',
                    count: 1,
                    text: '1y'
                }, {
                    type: 'all',
                    text: 'All'
                }],
                inputEnabled: false, // it supports only days
                selected: 4 // all
            },

            xAxis: {
                events: {
                    afterSetExtremes: afterSetExtremes
                },
                minRange: 3600 * 1000 // one hour
            },

            yAxis: {
                floor: 0
            },

            series: [{
                data: data,
                dataGrouping: {
                    enabled: false
                }
            }]
        });
    }).catch(error => console.error(error.message));