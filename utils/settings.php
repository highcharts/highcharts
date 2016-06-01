<?php

class Settings {
	// Path to the Git Executable
	//static $git = "C:\Git\bin\git"; // Typical Windows path
	static $git = '/usr/bin/git'; // Typical Mac path

	// The correct or expected (old) version. Set it to commit id to test against a certain commit. To test against
	// a certain version, use the version's commit id.
	static $leftPath = "http://code.highcharts.com";
	// The candidate for release, new version. Inserts top domain from utils.highcharts.{whatever}/samples. 
	// This means that if you are running your tests from utils.highcharts.local/samples, the code
	// will run from code.highcharts.local. If you run your tests from utils.highcharts.th/samples,
	// the code will run from code.highcharts.th.
	// Set rightPath to commit id to test against a certain commit. This is mostly done for regression
	// testing on previous commits, not for candidate testing.
	static $rightPath = "http://code.highcharts.%s";
	
	static $exportServer = "http://export.highcharts.com";
	static $jQueryVersion = "1.8.3";
}

?>