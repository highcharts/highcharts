$(function () {
    $('#container').highcharts({

        chart: {
            events: {
                load: function () {
                    var annotation = this.annotations.allItems[0];

                    $('#destroy').click(function () {
                        annotation.destroy();
                    });
                }
            }
        },

        title: {
            text: 'Chart title'
        },
        credits: {
            enabled: false
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, {
                y: 176.0,
                id: 'a'
            }, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }],

        annotations: [{
            linkedTo: 'a',
            anchorX: 'center',
            anchorY: 'top',
            title: {
                text: 'Annotation A',
                y: -30
            }
        }]
    });
});