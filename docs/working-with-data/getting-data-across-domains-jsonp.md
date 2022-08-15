Cross domain data
=================

It is not possible to use the jQuery .getJSON() function on JSON files outside of your own domain. It is however possible to use JSONP.

The difference between JSON and JSONP is that in a regular JSON file you would just use the ordinary JSON syntax. This cannot be returned cross domain. With JSONP what is done is wrapping the JSON content with a callback function in PHP which returns a json object. This can come in handy if the data you wish to display is on another domain than your own. A great number of data providers have JSONP services, for example Google and Twitter.

Here is an example:

*   The serverside php file:

```php
<?php
header("content-type: application/json"); 

$array = array(7,4,2,8,4,1,9,3,2,16,7,12);

echo $_GET['callback']. '('. json_encode($array) . ')';    

?>
```
    

*   The JavaScript calling the callback function using jQuery.

```js
$(document).ready(function() {
    var options = {
        chart: {
            renderTo: 'container',
            type: 'spline'
        },
        series: [{}]
    };
    
    var url =  "http://url-to-your-remote-server/jsonp.php?callback=?";
    $.getJSON(url,  function(data) {
        options.series[0].data = data;
        var chart = new Highcharts.Chart(options);
    });
});
```