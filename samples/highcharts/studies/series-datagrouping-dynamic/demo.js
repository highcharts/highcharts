$(function () {
    
    /**
     * This snippet reads the dataGrouping custom option on range selector buttons, and applies
     * data grouping before selecting the range.
     * TODO: 
     * - Release forced data grouping on setting extremes.
     * - Button to release force data grouping, probably simply by ommitting the dataGrouping option.
     */
    (function (H) {
        H.wrap(H.RangeSelector.prototype, 'clickButton', function (proceed, i, redraw) {
            var dataGrouping = this.buttonOptions[i].dataGrouping,
                baseAxis = this.chart.xAxis[0];

            if (baseAxis && dataGrouping) {
                H.each(baseAxis.series, function (series) {
                    series.update({
                        dataGrouping: {
                            forced: true,
                            units: [dataGrouping]
                        }
                    }, false);
                });
                            
                proceed.call(this, i, redraw);
            }
        });

        H.setOptions({
            lang: {
                rangeSelectorZoom: 'Grouping'
            }
        });
    }(Highcharts));

    $.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=aapl-c.json&callback=?', function (data) {
        // Create the chart
        $('#container').highcharts('StockChart', {            

            rangeSelector : {
                buttons: [{
                    type: 'month',
                    count: 1,
                    text: 'Daily',
                    dataGrouping: ['day', [1]]
                }, {
                    type: 'year',
                    count: 1,
                    text: 'Weekly',
                    dataGrouping: ['week', [1]]
                }, {
                    type: 'all',
                    text: 'Monthly',
                    dataGrouping: ['month', [1]]
                }],
                buttonTheme: {
                    width: 60
                }
            },

            title : {
                text : 'AAPL Stock Price'
            },

            subtitle: {
                text: 'Custom data grouping tied to range selector'
            },

            series : [{
                name : 'AAPL',
                data : data,
                tooltip: {
                    valueDecimals: 2
                }
            }]
        });
    });

});
