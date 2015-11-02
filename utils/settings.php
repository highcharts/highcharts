<?php

class Settings {
	// Path to the Git Executable
	//static $git = "C:\Git\bin\git"; // Typical Windows path
	static $git = '/usr/local/git/bin/git';

	static $leftPath = "http://code.highcharts.com";
	//static $leftPath = "2f426113781d40f0236e66046de4b3022e89f7e8"; // This is how to compare against a commit
	static $rightPath = "http://code.highcharts.local";
	static $exportServer = "http://export.highcharts.com";
	static $jQueryVersion = "1.8.3";
}

?>