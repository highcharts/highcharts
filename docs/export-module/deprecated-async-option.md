Deprecated the export server async option
------------------------------------------

Version 2.2 of the Highcharts Node.js Export Server deprecated the `async` option. The reasons for that is that it made the application dependent on saving state, and complicated load balancing. Furthermore it is no longer needed in browsers because we can render the returned image directly as a base64 encoded `src`.

Here's how to migrate from the `async` option.

### Browser

In the browser, the config can be posted and the returned data be rendered using the FormData, fetch and FileReader API's. See the [example on jsFiddle](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/export-data/export-from-config/) for how to set this up with an async-await based syntax.

If legacy browsers are a requirement, see also the [old jQuery based demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/export-data/export-post-request/). Note that this approach uses the export server's `b64` option to do the base64 encoding on the server side.

### Node.js

If you're running a Node.js environment, the recommended approach would be to use the export server as a Node.js module instead of posting content to Highsoft's online server. For details, see the chapter [Using as a Node.js Module](https://github.com/highcharts/node-export-server/blob/master/README.md#using-as-a-nodejs-module) in the project repo.

### PHP

For PHP, we can use curl to post the config to the server. This is a working example:
```php
<?php
/**
 * PHP script to create image exports using the Highcharts Export Server
 */

$type = 'png'; // Can be png, jpeg or pdf

// Chart options
$options = [
    'series' => [[
        'data' => [1, 4, 3, 5],
        'type' => 'column'
    ]]
];

$arr = [
    'type' => $type,
    'width' => 400,
    'infile' => $options
];

$data = json_encode($arr);
$curlProcess = curl_init();
curl_setopt( $curlProcess, CURLOPT_URL, 'https://export.highcharts.com/' );
curl_setopt(
    $curlProcess,
    CURLOPT_HTTPHEADER,
    array(
        'Content-Type: application/json',
        'Content-Length: ' . strlen( $data ), 'Accept: application/json'
    )
);
curl_setopt( $curlProcess, CURLOPT_HEADER, 0 );
curl_setopt( $curlProcess, CURLOPT_TIMEOUT, 30 );
curl_setopt( $curlProcess, CURLOPT_POST, 1 );
curl_setopt( $curlProcess, CURLOPT_POSTFIELDS, $data );
curl_setopt( $curlProcess, CURLOPT_RETURNTRANSFER, TRUE );
$content = curl_exec( $curlProcess );
curl_close( $curlProcess );

file_put_contents("chart.$type", $content);

?>
```