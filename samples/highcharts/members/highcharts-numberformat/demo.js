$(function () {

    Highcharts.setOptions({
        lang: {
            decimalPoint: '\u066B',
            thousandsSeparator: '\u066C'
        }
    });
    Highcharts.wrap(Highcharts, 'numberFormat', function (proceed) {
        var ret = proceed.apply(0, [].slice.call(arguments, 1)),
            replacements = [
                '\u0660',
                '\u0661',
                '\u0662',
                '\u0663',
                '\u0664',
                '\u0665',
                '\u0666',
                '\u0667',
                '\u0668',
                '\u0669'
            ],
            i;

        for (i = 0; i < 10; i++) {
            ret = ret.replace(i, replacements[i]);
        }


        return ret;
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
                format: '{y:.1f}'
            }
        }]
    });
});