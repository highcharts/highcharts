Ant-Contrib library

This library is for contributed Ant tasks that have
not been approved for inclusion into the ant core or
optional library.

The easiest way to use the tasks is to use

<taskdef resource="net/sf/antcontrib/antcontrib.properties">
  <classpath>
    <pathelement location="your/path/to/ant-contrib.jar" />
  </classpath>
</taskdef>

in your build file.  If ant-contrib.jar is on your CLASSPATH or in
ANT_HOME/lib you can even simplify this to read

<taskdef resource="net/sf/antcontrib/antcontrib.properties" />


Requirements
-------------------------
Runtime:
	Requires APACHE Ant Version 1.5 or above.  Note, that output
	handlers on the ForEach task will not properly report the
	task which is outputting the message unless you are using
	Ant version 1.5.2 or greater.

Compilation:
	Ant Version 1.5.2.