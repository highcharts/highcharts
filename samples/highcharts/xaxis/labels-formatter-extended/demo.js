
Highcharts.chart('container', {

    title: {
        text: 'Demo of reusing but modifying default X axis label formatter'
    },

    subtitle: {
        text: 'X axis labels should have thousands separators'
    },

    xAxis: {
        labels: {
            formatter: function () {
                var label = this.axis.defaultLabelFormatter.call(this);

                // Use thousands separator for four-digit numbers too
                if (/^[0-9]{4}$/.test(label)) {
                    return Highcharts.numberFormat(this.value, 0);
                }
                return label;
            }
        }
    },

    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
        pointStart: 9000,
        type: 'column'
    }]

});
