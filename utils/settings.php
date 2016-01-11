<?php

class Settings {
	// Path to the Git Executable
	//static $git = "C:\Git\bin\git"; // Typical Windows path
	static $git = '/usr/local/git/bin/git';

	static $leftPath = "http://code.highcharts.com";
	static $rightPath = "http://code.highcharts.%s"; // inserts top domain from utils.highcharts.{whatever}/samples
	static $exportServer = "http://export.highcharts.com";
	static $jQueryVersion = "1.8.3";
}

?>