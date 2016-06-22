<?php

class Settings {
	// Path to the Git Executable
	//static $git = "C:\Git\bin\git"; // Typical Windows path
	static $git = "/usr/bin/git";

	static $leftPath = "http://code.highcharts.com";
	static $rightPath = "http://code.highcharts.%s"; // inserts top domain from utils.highcharts.{whatever}/samples
	static $exportServer = "http://export.highcharts.com";
	static $jQueryVersion = "1.8.3";

	// Use this when default settings have changed, to rule out all difference related 
	// to one or more specific changes. May be a call to setOptions or wrapping Highcharts
	// functions.
	static $overrides = "
		Highcharts.setOptions({
			chart: {
				marginTop: 30
			}
		});
	";
}

?>