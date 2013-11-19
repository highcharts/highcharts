/* ----------------------- EXPORT PATH & URL -------------------------------- */     /**
        * IMPORTANT: You need to change the location of folder where 
        *            the exported chart images/PDFs will be saved on your 
        *                         server. Please specify the path to a folder with 
        *                         write permissions in the constant SAVE_PATH below. 
        */ 
      define ( "SAVE_PATH",  "./" );
      /* Place your folder path here.*//**
        *       IMPORTANT: This constant HTTP_URL stores the HTTP reference to 
        *                  the folder where exported charts will be saved. 
        *                          Please enter the HTTP representation of that folder 
        *                          in this constant e.g., http://www.yourdomain.com/images/
        */
      define ( "HTTP_URL", "http://www.yourdomain.com/images/" );
      /* Define your HTTP Mapping URL here. *//**
*  OVERWRITEFILE sets whether the export handler will overwrite an existing file 
*  the newly created exported file. If it is set to false the export handler will
*  not overwrite. In this case if INTELLIGENTFILENAMING is set to true the handler
*  will add a suffix to the new file name. The suffix is a randomly generated UUID.
*  Additionally, you add a timestamp or random number as additional suffix.
* 
*/
define ( "OVERWRITEFILE", false );
define ( "INTELLIGENTFILENAMING", true ); 
define ( "FILESUFFIXFORMAT", "TIMESTAMP" ) ;// can be TIMESTAMP or RANDOM/* Define file over-write, auto-naming and naming suffix configuration here.*/

<html>
  <head>
    <title>My Chart</title>
    <script type="text/javascript" src="FusionCharts/FusionCharts.js"></script>
    <script type="text/javascript">
        function ExportMyChart() {
            var chartObject = getChartFromId('myChart');
            if( chartObject.hasRendered() ) chartObject.exportChart();
     }
    </script>
  </head>
  <body>
    <div id="chartContainerDiv">FusionCharts loaded here...</div>
    <script type="text/javascript">
        var myChart = new FusionCharts('FusionCharts/Column3D.swf', 'myChart', '900', '300', '0', '1');
        myChart.setXMLUrl('Data.xml');
        myChart.render('chartContainerDiv');
    </script>
    <input type="button" value="Export My Chart" onclick="ExportMyChart()" />
  </body>
</html>
