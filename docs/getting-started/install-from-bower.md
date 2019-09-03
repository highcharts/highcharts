Installing with Bower
---------------------

Bower is no longer the dependency manager of choice for front-end projects. While the open source project is still maintained, its creators decided to deprecate it, and advise how to migrate to other solutions—namely Yarn and webpack.

The Bower package contains Highcharts, Highstock and Highmaps. Start by loading Highcharts from Bower:

`bower install highcharts`

Load Highcharts
---------------

    
    <script src="./bower[components/highcharts/highcharts.js"></script>  
      
    <script>  
    // Create the chart
    Highcharts.Chart('container', { /\*Highcharts options\*/ });
    </script>

Load additional modules
-----------------------

To load additional functionality onto Highcharts, include the modules.

    
    <script src="./bower[components/highcharts/modules/exporting.js"></script>

Load Highstock or Highmaps
--------------------------

Highcharts is already included in Highstock, so it not necessary to load both. The highstock.js file is included in the package. The highmaps.js file is also included, but unlike highstock.js, this doesn't include the complete Highcharts feature set. To load the full suite in one page, load Highmaps as a module.

    
    <script src="./bower[components/highcharts/highstock.js"></script>
    <script src="./bower[components/highcharts/modules/map.js"></script>
    

Alternatively when only map functionality is needed, and not stock.

    
    <script src="./bower[components/highcharts/highmaps.js"></script>
