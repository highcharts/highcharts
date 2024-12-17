Data from a database
====================

Highcharts runs on the client side only, and is completely ignorant of how your server is set up. This means that if your server is running PHP and MySQL, or any other type of server technology coupled with any SQL engine, you can dynamically produce the HTML and JavaScript required by Highcharts. 

There are a number of ways to do this. One way is to make a specific PHP file that only contains the data, call this dynamically from jQuery using Ajax, and add it to the configuration object before the chart is generated. Or you can have one PHP file that returns the entire JavaScript setup of your chart. Or, in the most basic way, just add some PHP code within your parent HTML page that handles the data from the chart. Below is a basic, low level example of how to pull data from a MySQL table and add it to your chart.

**Simple data with regular x intervals**

    
    <?php
    while ($row = mysql_fetch_array($result)) {
       $data[] = $row['value'];
    }
    ?>
    var chart = new Highcharts.Chart({
          chart: {
             renderTo: 'container'
          },
          series: [{
             data: [<?php echo join($data, ',') ?>],
             pointStart: 0,
             pointInterval
          }]
    });

**Including x values**

Say you have a datetime x axis and irregular intervals between the points. Then you can't use the pointInterval approach like above, but you need to get the datetime for each point. Your code may now look like this:

    
    <?php
    while ($row = mysql_fetch_array($result)) {
       extract $row;
       $datetime *= 1000; // convert from Unix timestamp to JavaScript time
       $data[] = "[$datetime, $value]";
    }
    ?>
    var chart = new Highcharts.Chart({
          chart: {
             renderTo: 'container'
          },
          series: [{
             data: [<?php echo join($data, ',') ?>]
          }]
    });

As an alternative to this low-level approach, also consider [json_encode](https://php.net/manual/en/function.json-encode.php) for writing the entire options structure in PHP.