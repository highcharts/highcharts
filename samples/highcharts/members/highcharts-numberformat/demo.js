const converters = {
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
        thousandsSep: '\u066C'
    }
});

Highcharts.chart('container', {

    chart: {
        numberFormatter: function () {
            const ret = Highcharts.numberFormat.apply(0, arguments);
            return converters.ar(ret);
        },
        type: 'column'
    },

    title: {
        text: 'Arabic digits in Highcharts'
    },

    series: [{
        data: [
            29.9, 71.5, 106.4, 129.2, 144.0, 176.0,
            135.6, 148.5, 216.4, 194.1, 95.6, 54.4
        ],
        dataLabels: {
            enabled: true,
            format: '{y:.1f}',
            style: {
                fontSize: '13px'
            }
        }
    }]
});