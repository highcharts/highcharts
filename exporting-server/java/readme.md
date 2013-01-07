#Steps to build the Highcharts Server application for Java#
###Prerequisites###

The java based Highcharts export-server has the following prerequisites:
- installed an application server (for example: Apache Tomcat, Jboss, TC server, jetty for development)
- installed Java 1.6 or later
- installed Maven 2 or later
- installed Phantom on the server, <a href="https://github.com/highslide-software/highcharts.com/blob/master/exporting-server/phantomjs/readme.md">see here</a> This isn't required when you don't want to create graphs serverside

###Configuration###
- Edit the app.properties file in <a href="https://github.com/highslide-software/highcharts.com/blob/master/exporting-server/java/highcharts-export/src/main/webapp/WEB-INF/spring/app.properties">highcharts-export/src/main/webapp/WEB-INF/spring/app.properties</a> and change the <pre>webapp.url=http://my.exportserver.com</pre> property to the url for of your export-server
- Do the same for dev.properties and prod.properties in highcharts-export/src/main/properties. With these properties you can compile the project for development- or production environment. You can do this with specifying the right profile during compiling. 

    mvn clean package -Pproduction 
or for during development
    mvn clean package -Pdevelopment
    
- Specify the location of PhantomJS and the highcharts-convert script in the SVGCreator.java file. This is found here: <a href="https://github.com/highslide-software/highcharts.com/blob/master/exporting-server/java/highcharts-export/src/main/java/com/highcharts/export/util/SVGCreator.java">highcharts-export/src/main/java/com/highcharts/export/util/SVGCreator.java</a> change these lines:

    private final String PHANTOM_EXEC = "/usr/local/bin/phantomjs";
    private String PHANTOM_SCRIPT = "highcharts-convert.js";

-You can change the name of the script, but it's expected to be in this folder: highcharts-export/src/main/webapp/WEB-INF/phantomjs/


###Building a .war file###
Now you have configured the application, such that it's pointing to your new Highcharts export-server, you can compile the project files. Browse to the Highchart-Export folder and while standing here type the following in a terminal: <ul style="list-style-type:none"><li><pre>mvn clean package -Pproduction</pre></li></ul>
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
