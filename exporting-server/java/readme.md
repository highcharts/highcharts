#Steps to build the Highcharts Server application for Java#
###Prerequisites###

The java based Highcharts export-server has the following prerequisites:
- installed an application server (for example: Apache Tomcat, Jboss, TC server, jetty for development)
- installed Java 1.6 or later
- installed Maven 2 or later
- installed Phantom on the server, <a href="https://github.com/highslide-software/highcharts.com/blob/master/exporting-server/phantomjs/readme.md">see here</a> This isn't required when you don't want to create graphs serverside

###Building a .war file###
Now you have configured the application, such that it's pointing to your new Highcharts export-server, you can compile the project files. Browse to the Highchart-Export folder and while standing here type the following in a terminal: <ul style="list-style-type:none"><li><pre>mvn clean package</pre></li></ul>
After compiling you will find a highcharts-export.war residing in the target folder. Upload/copy this to the application server.

###Testing###
We supplied the <a hre="http://jetty.codehaus.org/jetty/">Jetty Server</a> dependency in pom.xml file. For running the export-server locally during development or testing, fire the command:
    mvn jetty:run
The application is then accessible at http://localhost:8080/highcharts-export.

###Good to know###
- Change you url configuration in the exporting option, and point it to the new installed exporting-server.

    <pre><code>exporting:{ 
        url:'http://new.server.com/highcharts-export' 
    }</code></pre>
- When using this application in a non SUN-java environment, it's necessary to change the property-files in: .m2/repository/org/apache/xmlgraphics/batik-codec/1.7/batik-codec.jar/META-INF/services</p>
- Install necessary fonts on the server. Install them on the server, Batik will pick them up there.</p>
