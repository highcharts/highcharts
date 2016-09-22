$(function () {
    $('#container').highcharts('StockChart', {

        rangeSelector: {
            selected: 4
        },

        plotOptions: {
            series: {
                dataGrouping: {
                    forced: true,
                    units: [
                        ['week', [1]]
                    ]
                }
            }
        },

        series: [{
            name: 'ADBE',
            data: ADBE,
            dataGrouping: {
                type: 'column'
            },
            tooltip: {
                valueDecimals: 2
            }
        }, {
            name: 'Data point count (confidence)',
            data: ADBE,
            dataGrouping: {
                approximation: function () {
                    console.log(
                        'dataGroupInfo:',
                        this.dataGroupInfo,
                        'Raw data:',
                        this.options.data.slice(this.dataGroupInfo.start, this.dataGroupInfo.start + this.dataGroupInfo.length)
                    );
                    return this.dataGroupInfo.length;
                },
                forced: true
            },
            type: 'column'
        }]
    });
});