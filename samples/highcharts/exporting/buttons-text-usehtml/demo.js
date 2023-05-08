Highcharts.chart('container', {

    title: {
        text: 'Export button text icons'
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
                style: {
                    fontSize: '20px',
                    color: '#888'
                },
                states: {
                    hover: {
                        style: {
                            color: '#000'
                        }
                    }
                }
            },
            useHTML: true
        }
    },

    exporting: {
        buttons: {
            contextButton: {
                enabled: false
            },
            exportButton: {
                text: '<i class="fa fa-download"></i>',
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
                text: '<i class="fa fa-print"></i>',
                onclick: function () {
                    this.print();
                }
            }
        }
    }

});