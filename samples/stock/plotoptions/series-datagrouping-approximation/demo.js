
Highcharts.stockChart('container', {

    chart: {
        width: 800
    },

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
                var start = this.cropStart + this.dataGroupInfo.start;

                console.log(
                    'dataGroupInfo:',
                    this.dataGroupInfo,
                    'Raw data:',
                    this.options.data.slice(
                        start,
                        start + this.dataGroupInfo.length
                    )
                );

                // Individual point options can be applied to the grouped points
                if (this.dataGroupInfo.length < 5) {
                    this.dataGroupInfo.options = {
                        color: '#FF0000'
                    };
                }

                // We want the number of points to represent the value
                return this.dataGroupInfo.length;
            },
            forced: true
        },
        type: 'column'
    }]
});