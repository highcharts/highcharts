<?php

class Settings {
	// Path to the Git Executable
	//static $git = "C:\Git\bin\git"; // Typical Windows path
	static $git = '/usr/local/git/bin/git';

	// Set it to commit id to test against a certain commit. To test against
	// a certain version, use the version's commit id.
	static $leftPath = "http://code.highcharts.com";
	// Inserts top domain from utils.highcharts.{whatever}/samples. 
	// Set it to commit id to test against a certain commit.
	static $rightPath = "http://code.highcharts.%s";
	
	static $exportServer = "http://export.highcharts.com";
	static $jQueryVersion = "1.8.3";
}

?>