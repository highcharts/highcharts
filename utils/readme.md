# Highcharts Utilities

Highcharts Utilities is a set of tools to run quality checks, maintenance and issue tracking on Highcharts. It runs
on PHP and is intended to be hosted from the local system.

## Requirements
* A web server with PHP enabled to run the utilities.
* In order to run the issue-by-commit tool, git needs to be installed on the system and available in the system path.

## Setup
You can run most the utilities by simply putting the highcharts.com folder in a place where PHP can reach it, and
point the browser to the `/utils` folder. However, the `/samples` page needs a local virtual host, `code.highcharts.local` in
order to run concatenated scripts from the local repo. Best practice is also to set up a virtual host for the utilities.

1. Add the two sites to the hosts file:
```
127.0.0.1    utils.highcharts.local
127.0.0.1    code.highcharts.local
```

2. Add them to the httpd.conf config file for Apache:
```xml
<VirtualHost *>
DocumentRoot "/Users/{...}/highcharts.com/js"
ServerName code.highcharts.local
</VirtualHost>
```
```xml
<Directory "/Users/{...}/highcharts.com/js">
	AllowOverride All
</Directory>
```
```xml
<VirtualHost *>
DocumentRoot "/Users/{...}/highcharts.com/utils"
ServerName utils.highcharts.local
</VirtualHost>
```

3. Restart your browser and point it to <a href="http://utils.highcharts.local">utils.highcharts.local</a>.

