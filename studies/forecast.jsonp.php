<?php

$xml = simplexml_load_file(dirname(__FILE__) . '/forecast.xml');
$json = json_encode($xml);
$callback = $_GET['callback'] ? $_GET['callback'] : 'callback';
echo "$callback($json)";


?>