<h1>Steps to build the Highcharts Server application for Java.</h1>
<h3>Prerequisites</h3>
<p>
The java based Highcharts export-server has the following prerequisites:
    <ul style="list-style-type:none">
        <li>- installed an application server (for example: Apache Tomcat, Jboss, TC server, jetty for development)</li>
        <li>- installed Java 1.6 or later </li>
        <li>- installed Maven 2 or later</li>
        <li>- installed Phantom on the server, <a href="https://github.com/highslide-software/highcharts.com/blob/master/exporting-server/phantomjs/readme.md">see here</a> This isn't required when you don't want to create graphs serverside<li>        
    </ul>
</p>
<h3>Configuration</h3>
 <ul style="list-style-type:none">
   <li>- Edit the app.properties file in <a href="https://github.com/highslide-software/highcharts.com/blob/master/exporting-server/java/highcharts-export/src/main/webapp/WEB-INF/spring/app.properties">highcharts-export/src/main/webapp/WEB-INF/spring/app.properties</a> and change the <pre>webapp.url=http://my.exportserver.com</pre> property to the url for of your export-server</li>
     <li>- Do the same for dev.properties and prod.properties in highcharts-export/src/main/properties. With these properties you can compile the project for development- or production environment. You can do this with specifying the right profile during compiling. <pre>mvn clean package -Pproduction</pre> or <pre>mvn clean package -Pdevelopment</pre></li>
     <li>- Specify the location of PhantomJS and the highcharts-convert script in the SVGCreator.java file. This is found here: <a href="https://github.com/highslide-software/highcharts.com/blob/master/exporting-server/java/highcharts-export/src/main/java/com/highcharts/export/util/SVGCreator.java">highcharts-export/src/main/java/com/highcharts/export/util/SVGCreator.java</a> change these lines: <pre>private final String PHANTOM_EXEC = "/usr/local/bin/phantomjs";
private String PHANTOM_SCRIPT = "highcharts-convert.js";</pre>
         You can change the name of the script, but it's expected to be in this folder: highcharts-export/src/main/webapp/WEB-INF/phantomjs/
     </li></ul>

<h3>Building a .war file</h3>
<p>Now you have configured the application, such that it's pointing to your new Highcharts export-server, you can compile the project files. Browse to the Highchart-Export folder and while standing here type the following in a terminal: <ul style="list-style-type:none"><li><pre>mvn clean package -Pproduction</pre></li></ul>
After compiling you will find a highcharts-export.war residing in the target folder. Upload/copy this to the application server.
</p>
      <h3> Other things </h3>
<p>- Change you url configuration in the exporting option, that it is pointing to your new installed exporting-server.
    exporting:{
                url:'http://new.server.com/highcharts-export'
    }
            </p>
<p>- When using this application in a non SUN-java environment, it's necessary to change the property-files in: .m2/repository/org/apache/xmlgraphics/batik-codec/1.7/batik-codec.jar/META-INF/services</p>
<p>- Install necessary fonts on the server. Install them on the server, Batik will pick them up there.</p> 
