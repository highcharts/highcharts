Highcharts.chart('container', {

    chart: {
        events: {
            beforeFullscreenOpen: function () {
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
            beforeFullscreenClose: function () {
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
        text: 'Fullscreen'
    },

    subtitle: {
        text: 'Click the context menu and choose "Fullscreen".<br> The title size will be larger'
    },

    series: [{
        data: [2, 1, 1, 5, 1, 3, 3, 7]
    }]

});
