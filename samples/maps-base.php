<?php
$data = array();
$separatorSeries = '';
if ($mapkey = $_GET['mapkey']) {

    if ($file = file_get_contents('https://code.highcharts.com/mapdata/'. $mapkey .'.geo.json')) {
        $shapes = json_decode($file);

        $i = 0;
        foreach ($shapes->features as $feature) {
            array_push($data, "{ 'hc-key': '" . $feature->properties->{'hc-key'} . "', value: $i }");
            $i++;
        }
    }

    if (strstr($file, '__separator_lines__') !== false) {
        $separatorSeries = ", {
                        name: 'Separators',
                        type: 'mapline',
                        data: Highcharts.geojson(Highcharts.maps['$mapkey'], 'mapline'),
                        color: 'silver',
                        showInLegend: false,
                        enableMouseTracking: false
                    }";
    }
}

?><!DOCTYPE HTML>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title>Highmaps Example</title>

        <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
        <style type="text/css">
            #container {
                height: 500px; 
                min-width: 310px; 
                max-width: 800px; 
                margin: 0 auto; 
            }
            .loading {
                margin-top: 10em;
                text-align: center;
                color: gray;
            }
        </style>
        <script type="text/javascript">
            $(function () {

                // Prepare demo data
                var data = [<?php echo join($data, ",\n                    "); ?>];

                    
                // Initiate the chart
                $('#container').highcharts('Map', {
                    
                    title : {
                        text : 'Highmaps basic demo'
                    },

                    subtitle : {
                        text : 'Source map: <a href="https://code.highcharts.com/mapdata/<?php echo $mapkey ?>.js"><?php echo $mapkey ?></a>'
                    },

                    mapNavigation: {
                        enabled: true,
                        buttonOptions: {
                            verticalAlign: 'bottom'
                        }
                    },

                    colorAxis: {
                        min: 0
                    },

                    series : [{
                        data : data,
                        mapData: Highcharts.maps['<?php echo $mapkey ?>'],
                        joinBy: 'hc-key',
                        name: 'Random data',
                        states: {
                            hover: {
                                color: '#BADA55'
                            }
                        },
                        dataLabels: {
                            enabled: true,
                            format: '{point.name}'
                        }
                    }<?php echo $separatorSeries ?>]
                });
            });
        </script>
    </head>
    <body>
        <script src="https://code.highcharts.com/maps/highmaps.js"></script>
        <script src="https://code.highcharts.com/maps/modules/exporting.js"></script>
        <script src="https://code.highcharts.com/mapdata/<?php echo $mapkey ?>.js"></script>


        <div id="container"></div>

    </body>
</html>
