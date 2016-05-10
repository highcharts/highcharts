$(function () {
    $('#container').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Highcharts 3.0.9: Line height in labels with em fontSize'
        },
        xAxis: {
            categories: [
                'Jan asd asdflk sasdflk ',
                'Feb asdflkdsa alsdkf',
                'Mar asdlkfa alsdkfsad lkfas',
                'Apr asdlk asdlfk adslfk asd',
                'May asdfsdlakf asdlfk',
                'Jun asdkjfasd afkjs dfa'
            ],
            labels: {
                autoRotationLimit: 60,
                style: {
                    fontSize: '0.8em'
                }
            }
        },
        series: [{
            name: 'Tokyo',
            data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0]

        }]
    });
});