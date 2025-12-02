Highcharts.chart('container', {

    title: {
        text: 'Modify context button menu items'
    },

    subtitle: {
        text: 'Adding download to WebP'
    },

    credits: {
        enabled: false
    },

    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec'
        ]
    },

    series: [{
        data: [
            29.9, 71.5,
            106.4, 129.2,
            144.0, 176.0,
            135.6, 148.5,
            216.4, 194.1,
            95.6, 54.4
        ]
    }],

    exporting: {
        buttons: {
            contextButton: {
                menuItems: [
                    'printChart',
                    'separator',
                    'downloadPNG',
                    'downloadJPEG',
                    'downloadWebP',
                    'downloadSVG'
                ]
            }
        },
        menuItemDefinitions: {
            downloadWebP: {
                text: 'Download WebP Image',
                onclick: function () {
                    this.exportChart({
                        type: 'image/webp'
                    });
                }
            }
        }
    }

});