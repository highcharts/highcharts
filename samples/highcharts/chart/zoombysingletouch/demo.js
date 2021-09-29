const chart = Highcharts.chart('container', {

    title: {
        text: 'Single touch zooming demo'
    },

    chart: {
        zoomBySingleTouch: true,
        zoomType: 'x'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    series: [{
        data: [
            29.9, 71.5, 106.4, 129.2, 144.0, 176.0,
            135.6, 148.5, 216.4, 194.1, 95.6, 54.4
        ]
    }]
});

document.querySelector('.toggle-buttons').addEventListener(
    'click',
    e => {
        const value = e.target.dataset.zoombysingletouch;
        if (value) {
            const zoomBySingleTouch = value === 'true';
            chart.update({
                chart: {
                    zoomBySingleTouch
                }
            });

            // Toggle buttons state
            [].forEach.call(
                document.querySelectorAll('.toggle-buttons button'),
                button => button.classList.remove('active')
            );
            e.target.classList.add('active');

        }
    }
);