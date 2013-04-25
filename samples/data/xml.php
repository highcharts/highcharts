<?php

$url = $_GET['url'];
if (preg_match('/^http:\/\/[\/\w \.-]*\.xml$/', $url)) {
	header("Content-type: text/xml; charset=utf-8");
	echo file_get_contents($url);
}

?>