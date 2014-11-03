$(function () {

    /**
     * Experimental Highcharts plugin to allow download to PNG (through canvg) and SVG
     * using the HTML5 download attribute.
     * 
     * WARNING: This plugin uses the HTML5 download attribute which is not generally 
     * supported. See http://caniuse.com/#feat=download for current uptake.
     *
     * TODO:
     * - Lazy load canvg to lower initial page weight.
     * - Add crossbrowser support by utilizing the Downloadify Flash library?
     */
    (function (Highcharts) {

        /**
         * Add a new method to the Chart object to invoice a local download
         */
        Highcharts.Chart.prototype.exportChartLocal = function (options) {

            var svg = this.getSVG(), // Get the SVG
                canvas = document.createElement('canvas'), // Create an empty canvas
                a,
                href,
                download;

            // Render the SVG on the canvas
            window.canvg(canvas, svg);

            // Add an anchor and apply the download to the button
            if (options && options.type === 'image/svg+xml') {
                href = 'data:' + options.type + ',' + svg;
                download = 'chart.svg';

            } else {
                href = canvas.toDataURL('image/png');
                download = 'chart.png';
            }

            a = document.createElement('a');
            a.href = href;
            a.download = download;
            document.body.appendChild(a);
            a.click();
            a.remove();

        }

        // Extend the default options to use the local exporter logic
        Highcharts.getOptions().exporting.buttons.contextButton.menuItems = [{
            textKey: 'printChart',
            onclick: function () {
                this.print();
            }
        }, {
            separator: true
        }, {
            textKey: 'downloadPNG',
            onclick: function () {
                this.exportChartLocal();
            }
        }, {
            textKey: 'downloadSVG',
            onclick: function () {
                this.exportChartLocal({
                    type: 'image/svg+xml'
                });
            }
        }];
    }(Highcharts));



    $('#container').highcharts({

        title: {
            text: 'Offline export'
        },

        subtitle: {
            text: 'Click the button to download as PNG'
        },
        
        chart: {
            type: 'area'
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]

    });

});  
    