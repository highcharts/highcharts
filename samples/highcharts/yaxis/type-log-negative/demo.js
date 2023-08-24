/**
 * Custom Axis extension to allow emulation of negative values on a logarithmic
 * Y axis. Note that the scale is not mathematically correct, as a true
 * logarithmic axis never reaches or crosses zero.
 */
(function (H) {
    /* eslint-disable no-underscore-dangle */
    const logAdditions =
        H._modules['Core/Axis/LogarithmicAxis.js'].Additions.prototype;

    H.addEvent(H.Axis, 'afterInit', function () {
        const logarithmic = this.logarithmic;

        if (logarithmic && this.options.custom.allowNegativeLog) {

            // Avoid errors on negative numbers on a log axis
            this.positiveValuesOnly = false;

            // Override the converter functions
            logarithmic.log2lin = num => {
                const isNegative = num < 0;

                let adjustedNum = Math.abs(num);

                if (adjustedNum < 10) {
                    adjustedNum += (10 - adjustedNum) / 10;
                }

                const result = Math.log(adjustedNum) / Math.LN10;
                return isNegative ? -result : result;
            };

            logarithmic.lin2log = num => {
                const isNegative = num < 0;

                let result = Math.pow(10, Math.abs(num));
                if (result < 10) {
                    result = (10 * (result - 1)) / (10 - 1);
                }
                return isNegative ? -result : result;
            };
        }
    });

    // Add support for negative axis values to the tick positioning function.
    H.wrap(logAdditions, 'getLogTickPositions', function (
        proceed,
        interval,
        min,
        max,
        minor
    ) {
        if (
            !this.axis.options.custom.allowNegativeLog ||
            interval >= 0.5 ||
            interval < 0.08
        ) {
            return proceed.call(this, interval, min, max, minor);
        }

        const log = this,
            roundedMin = Math.floor(min),
            positions = [];
        let intermediate,
            i,
            j,
            len,
            pos,
            lastPos,
            break2;

        if (interval > 0.3) {
            intermediate = [1, 2, 4];
        } else if (interval > 0.15) {
            intermediate = [1, 2, 4, 6, 8];
        } else {
            intermediate = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        }

        for (i = roundedMin; i < max + 1 && !break2; i++) {
            len = intermediate.length;
            if (i <= 0) {
                for (j = len - 1; j >= 0 && !break2; j--) {
                    pos = -log.log2lin(
                        (log.lin2log(-i) || 1) * intermediate[j]
                    );

                    if (pos > min &&
                        (!minor || lastPos <= max) &&
                        typeof lastPos !== 'undefined') {
                        positions.push(lastPos);
                    }
                    if (lastPos > max) {
                        break2 = true;
                    }
                    lastPos = pos;
                }

                if (lastPos < min || lastPos > max) {
                    lastPos = undefined;
                }
            }

            if (i === 0 && min <= 0 && max >= 0) {
                positions.push(0);
            }

            if (i >= 0) {
                for (j = 0; j < len && !break2; j++) {
                    pos = log.log2lin((log.lin2log(i) || 1) * intermediate[j]);

                    if (pos > min &&
                        (!minor || lastPos <= max) &&
                        typeof lastPos !== 'undefined') {
                        positions.push(lastPos);
                    }
                    if (lastPos > max) {
                        break2 = true;
                    }
                    lastPos = pos;
                }
            }
        }

        return positions;
    });

}(Highcharts));


Highcharts.chart('container', {

    title: {
        text: 'Logarithmic axis with custom conversion allows negative values'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    yAxis: {
        type: 'logarithmic',
        custom: {
            allowNegativeLog: true
        }
    },

    series: [{
        data: [-1000, -100, -10, -1, -0.1, 0, 0.1, 1, 10, 100, 1000]
    }]

});
