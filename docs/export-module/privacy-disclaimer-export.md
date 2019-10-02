Export server Terms of Use 
=============

These terms are about the export server running at [https://export.highcharts.com](https://export.highcharts.com). This server is used to export charts to images or PDF files.

This service is based on fair usage policy. To this extent, rate limiting is in place. The rate limiting operates within windows of one minute, in which up to 10 requests can be made. This ensures that the service works well for everyone, even in times with heavy traffic.

Privacy Disclaimer
------------------

We do not gather any personally identifiable information from incoming requests. Server logs are limited to displaying error messages and timing information, to help us improve the service. All chart data and headers are stripped out of the logs.

The HTTP protocol is used for communication between client and the export server and is unsecured. When security and privacy is an issue to you, we recommend [setting up your own export server](https://highcharts.com/docs/export-module/setting-up-the-server) which holds the level of security you need. 

Description of data saved on the export server
----------------------------------------------

Almost all requests to the export server are handled and converted in memory, where nothing is stored on the server at all.

The two exceptions are PDF conversion and asynchronous requests. For this we store data on the export server, but the storage time is kept to a minimum period of time. 

1.  For a conversion to PDF is the resulting file saved to a temporary folder which is emptied every minute. 
2.  The export server supports asynchronous requests. The converted files are stored on the server in a temporary folder and are waiting to get called by the client. This folder is checked every minute and deletes files older than 30 seconds.

License
-------

The export server released by Highcharts is available under the [MIT license](https://raw.githubusercontent.com/highcharts/node-export-server/master/LICENSE)
