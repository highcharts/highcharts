<?php

class Settings {
	// Path to the Git Executable
	//static $git = "C:\Git\bin\git"; // Typical Windows path
	static $git = "git";

	// The path to compare against. To compare against a specific version or 
	// commit, the $leftPath can be set to a commit hash.
	static $leftPath = "http://code.highcharts.com";

	// The candidate for release, new version. Inserts top domain from utils.highcharts.{whatever}/samples. 
	// This means that if you are running your tests from utils.highcharts.local/samples, the code
	// will run from code.highcharts.local. If you run your tests from utils.highcharts.th/samples,
	// the code will run from code.highcharts.th.
	// Set rightPath to commit id to test against a certain commit. This is mostly done for regression
	// testing on previous commits, not for candidate testing.
	static $rightPath = "http://code.highcharts.%s";
	

	// When changing this, remember also to change the hard-coded versions in 
	// all demo.html and demo.details files. Change jQuery UI versions to 
	// a compatible one.
	static $exportServer = "http://export.highcharts.com";
	static $jQueryVersion = "3.1.1";
	static $jQueryVersionOldIE = "1.9.1";
	static $QUnitVersion = "2.0.1";

	// Use this when default settings have changed, to rule out all difference related 
	// to one or more specific changes. May be a call to setOptions or wrapping Highcharts
	// functions.
	static $overrides = "";
}

?>