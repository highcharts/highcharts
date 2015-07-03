$(function () {

    var converters = {
        // Latin to Farsi
        fa: function (number) {
            return number.toString().replace(/\d/g, function (d) {
                return String.fromCharCode(d.charCodeAt(0) + 1728);
            });
        },
        // Latin to Arabic
        ar: function (number) {
            return number.toString().replace(/\d/g, function (d) {
                return String.fromCharCode(d.charCodeAt(0) + 1584);
            });
        }
    };

    Highcharts.setOptions({
        lang: {
            decimalPoint: '\u066B',
            thousandsSeparator: '\u066C'
        }
    });

    Highcharts.wrap(Highcharts, 'numberFormat', function (proceed) {
        var ret = proceed.apply(0, [].slice.call(arguments, 1));
        return converters.ar(ret);
    });

    $('#container').highcharts({

        chart: {
            type: 'column'
        },

        title: {
            text: 'Arabic digits in Highcharts'
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
            dataLabels: {
                enabled: true,
                format: '{y:.1f}',
                style: {
                    fontSize: '13px'
                }
            }
        }]
    });
});