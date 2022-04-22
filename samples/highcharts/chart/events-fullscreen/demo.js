Highcharts.chart('container', {

    chart: {
        events: {
            fullscreenOpen: function () {
                this.update({
                    title: {
                        style: {
                            fontSize: '30px'
                        }
                    },
                    subtitle: {
                        style: {
                            color: 'red'
                        }
                    }
                });
            },
            fullscreenClose: function () {
                this.update({
                    title: {
                        style: {
                            fontSize: '18px'
                        }
                    }
                });
            }
        }
    },

    title: {
        text: 'Fullscreen events'
    },

    subtitle: {
        text: 'Click the context menu and choose "View in full screen".<br>The title size will be larger.'
    },

    series: [{
        data: [2, 1, 1, 5, 1, 3, 3, 7]
    }]

});
