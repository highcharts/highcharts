
Highcharts.chart('container', {

    title: {
        text: 'Export button texts'
    },

    credits: {
        enabled: false
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0,
            135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
    }],

    navigation: {
        buttonOptions: {
            theme: {
                // Good old text links
                style: {
                    color: '#039',
                    textDecoration: 'underline'
                }
            }
        }
    },

    exporting: {
        buttons: {
            contextButton: {
                enabled: false
            },
            exportButton: {
                text: 'Download',
                // Use only the download related menu items from the default
                // context button
                menuItems: [
                    'downloadPNG',
                    'downloadJPEG',
                    'downloadPDF',
                    'downloadSVG'
                ]
            },
            printButton: {
                text: 'Print',
                onclick: function () {
                    this.print();
                }
            }
        }
    }

});