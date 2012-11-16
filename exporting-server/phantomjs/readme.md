EXAMPLE USAGE: phantomjs highcharts-convert.js -infile URL -outfile filename -scale 2.5 -width 300 -constr Chart -callback callback.js'

Description of commandline parameters

-infile: the file to convert, assumes it's either a JSON file, the script checks for the input file to have the extension '.json', or otherwise it assumes to be a svg file.

-outfile: must be a filename with the extension .jpg, .png .pdf or .svg

-scale: to set the zoomFactor of the page rendered by PhantomJs. This works only when you don't use the width parameter!

-width: set the exact pixelwidth of the exported image or pdf.

-constr: Can be of 'Chart' or 'StockChart'. This depends on wether you want to generate StockCharts or Highcharts

-callback: filename of the callback. The callback is a function wich will be called in the constructor of highcharts
        new Highcharts.Chart({configOptions},callbackFunction);

        All code of the callback must be enclosed by a function. See this example of contents of the callback file:

            function(chart) {
                chart.renderer.arc(200, 150, 100, 50, -Math.PI, 0).attr({
                    fill : '#FCFFC5',
                    stroke : 'black',
                    'stroke-width' : 1
                 }).add();
            }
