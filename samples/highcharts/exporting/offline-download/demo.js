$(function () {

    /**
     * Experimental Highcharts plugin to allow download to PNG (through canvg) and SVG
     * using the HTML5 download attribute.
     * 
     * WARNING: This plugin uses the HTML5 download attribute which is not generally 
     * supported. See http://caniuse.com/#feat=download for current uptake.
     *
     * TODO:
     * - Find a flowchart at Dropbox\Highsoft\Teknisk\Docs. The flowchart has not been updated to fit the new logic of implementing FileSaver ourselves.
     * - Existing code was abandoned in the middle of a revamp, probably needs cleanup.
     * - Implement "FileSaver.js"-like functionality for cross-browser support. Where Blob would need to be pulled in (old FF/Opera/Safari), emit error msg.
     * - Option to fall back to online export server on missing support. Display error to user if option disabled and there is no support.
     */
    (function (Highcharts) {

        // Dummy object so we can reuse our canvas-tools.js without errors
        Highcharts.CanVGRenderer = {};

        /**
         * Downloads a script and executes a callback when done.
         * @param {String} scriptLocation
         * @param {Function} callback
         */
        function getScript(scriptLocation, callback) {
            var head = document.getElementsByTagName('head')[0],
                script = document.createElement('script');

            script.type = 'text/javascript';
            script.src = scriptLocation;
            script.onload = callback;

            head.appendChild(script);
        }

        /**
         * Add a new method to the Chart object to invoice a local download
         */
        Highcharts.Chart.prototype.exportChartLocal = function (options) {

            var chart = this,
                svg = this.getSVG(), // Get the SVG
                canvas,
                canvasCxt,
                a,
                href,
                extension,
                download = function () {

                    var blob;

                    // IE specific
                    if (navigator.msSaveOrOpenBlob) { 

                        // Get PNG blob
                        if (extension === 'png') {
                            blob = canvas.msToBlob();

                        // Get SVG blob
                        } else {
                            blob = new MSBlobBuilder;
                            blob.append(svg);
                            blob = blob.getBlob('image/svg+xml');
                        }

                        navigator.msSaveOrOpenBlob(blob, 'chart.' + extension);

                    } else {
                        a = document.createElement('a');
                        if (typeof a.download !== 'undefined') {
                            
                            // HTML5 download attribute
                            a.href = href;
                            a.download = 'chart.' + extension;
                            document.body.appendChild(a);
                            a.click();

                        } else {
                            // Implement FileSaver functionality, or fall back to export server
                        }

                        a.remove();
                    }
                },
                prepareCanvas = function () {
                    canvas = document.createElement('canvas'); // Create an empty canvas
                    window.canvg(canvas, svg); // Render the SVG on the canvas

                    href = canvas.toDataURL('image/png');
                    extension = 'png';
                };

            // Add an anchor and apply the download to the button
            if (options && options.type === 'image/svg+xml') {
                href = 'data:' + options.type + ',' + svg;
                extension = 'svg';
                download();

            } else {

                // It's included in the page or preloaded, go ahead
                if (window.canvg) {
                    prepareCanvas();
                    download();                
                
                // No CanVG
                } else {
                    // If browser supports SVG canvas rendering directly - do that
                    canvas = document.createElement('canvas');
                    canvasCxt = canvas.getContext && canvas.getContext('2d');
                    if (canvasCxt /* && canvasCxt.drawImage --NOTE: do we need this? */) {
                        canvasCxt.drawImage(svg, 0, 0);
                        download();
                    } else {
                        // We need to load canvg before continuing                        
                        // TODO: If browser does not support SVG & canvas, fallback to export server
                        this.showLoading();
                        getScript(Highcharts.getOptions().global.canvasToolsURL, function () {
                            chart.hideLoading();
                            prepareCanvas();
                            download();
                        });
                    }
                }
            }
        };


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