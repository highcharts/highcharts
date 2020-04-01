/**
 * Custom Axis extension to allow emulation of negative values on a logarithmic
 * Y axis. Note that the scale is not mathematically correct, as a true
 * logarithmic axis never reaches or crosses zero.
 */
(function (H) {
    H.addEvent(H.Axis, 'init', function (e) {
        this.allowNegativeLog = e.userOptions.allowNegativeLog;
    });

    // Override conversions
    H.wrap(H.Axis.prototype, 'log2lin', function (proceed, num) {

        if (!this.allowNegativeLog) {
            return proceed.call(this, num);
        }

        var isNegative = num < 0,
            adjustedNum = Math.abs(num),
            result;
        if (adjustedNum < 10) {
            adjustedNum += (10 - adjustedNum) / 10;
        }
        result = Math.log(adjustedNum) / Math.LN10;
        return isNegative ? -result : result;
    });
    H.wrap(H.Axis.prototype, 'lin2log', function (proceed, num) {
        if (!this.allowNegativeLog) {
            return proceed.call(this, num);
        }

        var isNegative = num < 0,
            absNum = Math.abs(num),
            result = Math.pow(10, absNum);
        if (result < 10) {
            result = (10 * (result - 1)) / (10 - 1);
        }
        return isNegative ? -result : result;
    });
}(Highcharts));


Highcharts.chart('container', {

    title: {
        text: 'Logarithmic axis with custom conversion allows negative values'
    },

    subtitle: {
        text: 'Note: This sample exists for legacy testing purposes and will be removed after version 8',
        style: {
            color: 'red',
            fontSize: 30
        },
        floating: true,
        y: 150
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    yAxis: {
        type: 'logarithmic',
        allowNegativeLog: true
    },

    series: [{
        data: [-1000, -100, -10, -1, -0.1, 0, 0.1, 1, 10, 100, 1000]
    }]

});