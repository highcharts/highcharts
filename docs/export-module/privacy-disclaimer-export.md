Export server Terms of Use 
=============

These terms are about the export server running at [https://export.highcharts.com](https://export.highcharts.com). This server is used to export charts to images or PDF files.

Fair Usage Policy
------------------

We are dedicated to providing excellent service to all our licence holders, and to ensure a fair experience we have established a Fair Usage Policy for our public export server.

Our goal is uninterrupted, high-quality service for everyone. Excessive usage by a few users can negatively impact others, so we reserve the right to manage or restrict usage at our discretion, especially during peak times. While we do not set specific individual limits, we monitor overall system activity to maintain balance. If we detect usage significantly above normal levels, we may adjust or limit access to protect service performance at our discretion.

**Important requirements**

All requests **must include the HTTP referer and user-agent headers**; requests without these headers will be blocked. Providing correct header information helps us improve the service and allows us to reach out a hand if we identify ways to optimise your requests. 

Please also note that repeatedly sending misconfigured requests to the server in short intervals may result in temporary blocking of your requests.

For users with higher demands than our shared infrastructure can accommodate, we offer the option to [set up your own export server](https://highcharts.com/docs/export-module/setting-up-the-server). This allows you to handle greater workloads and customise the service to your needs without affecting others.

Thank you for helping us maintain a reliable, high-quality service for everyone. If you have any questions or concerns about this policy, please feel free to contact us.

Privacy Disclaimer
------------------

We do not gather any personally identifiable information from incoming requests. Server logs are limited to displaying error messages and timing information, to help us improve the service. All chart data and headers are stripped out of the logs.

The HTTP protocol is used for communication between client and the export server and is unsecured. When security and privacy is an issue to you, we recommend [setting up your own export server](https://highcharts.com/docs/export-module/setting-up-the-server) which holds the level of security you need. 

Description of data saved on the export server
----------------------------------------------

Almost all requests to the export server are handled and converted in memory, where nothing is stored on the server at all.

The exception to this is PDF conversion. For this we store data on the export server, but the storage time is kept to a minimum period of time. The resulting file is saved to a temporary folder which is emptied every minute. 

License
-------

The export server released by Highcharts is available under the [MIT license](https://raw.githubusercontent.com/highcharts/node-export-server/master/LICENSE)
