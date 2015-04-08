$(function () {
    
    /**
     * This snippet reads the dataGrouping custom option on range selector buttons, and applies
     * data grouping before selecting the range.
     * TODO: 
     * - Release forced data grouping on setting extremes.
     * - Button to release force data grouping, probably simply by ommitting the dataGrouping option.
     */
    (function (H) {

        /**
         * Force data grouping to a single unit.
         */
        H.RangeSelector.prototype.forceDataGrouping = function (dataGrouping, redraw) {
            var rangeSelector = this,
                baseAxis = this.chart.xAxis[0];

            redraw = H.pick(redraw, true);

            if (baseAxis) {
                H.each(baseAxis.series, function (series) {
                    series.update({
                        dataGrouping: {
                            forced: !!dataGrouping,
                            units: dataGrouping ? [dataGrouping] : null
                        }
                    });
                });
            }
        }

        // Set the forced data grouping when selecting a range
        H.wrap(H.RangeSelector.prototype, 'clickButton', function (proceed, i, redraw) {
            var dataGrouping = this.buttonOptions[i].dataGrouping;
                
            if (dataGrouping) {
                this.forceDataGrouping(dataGrouping, false);
            }

            proceed.call(this, i, redraw);
        });

        // Unset the forced data grouping when unselecting a range
        H.wrap(H.RangeSelector.prototype, 'setSelected', function (proceed, i) {
            var setToNull = i === null && this.selected !== null;
            proceed.call(this, i);                                        
            if (setToNull) {
                this.forceDataGrouping(false, true);
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
