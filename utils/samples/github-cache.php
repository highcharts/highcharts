<?php

/**
 * This file caches content from GitHub by the commit so that we are able to quickly run comparison
 * against a specific commit.
 */

$commit = $_GET['commit'];
$file = $_GET['file'];

$cachePath = 'cache/' . $commit . '-' . str_replace('/', '-', $file);

$file = preg_replace('/^\/stock/', '', $file);
$file = preg_replace('/^\/maps/', '', $file);

if (!is_dir('cache')) {
	mkdir('cache');
}
if (!is_file($cachePath)) {
	file_put_contents($cachePath, file_get_contents("http://github.highcharts.com/{$commit}{$file}"));
}

header("Content-type: text/javascript");
echo file_get_contents($cachePath);


?>