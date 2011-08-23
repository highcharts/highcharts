Building highcharts
===================

Prerequisites
-------------

1. First you will need to have the Git Bash shell installed, follow the instructions found here [msysgit](https://code.google.com/p/msysgit/).
2. We use `ant` to build the source so you also need to have java installed. [java jdk](http://java.oracle.com).
Don't forget to set the JAVA_HOME environment variable to point to the location where java is installed (eg: `C:\Program Files\Java\jdk1.6.0_24`)
3. When git and java is in place, clone the highcharts repository by running `git clone git://github.com/highslide-software/highcharts.git`.

Build system
------------

Highcharts is built from the command line and all build tasks are run from the top folder in the source tree, so first cd to the cloned repository:
`$ cd highcharts`

To make sure that `ant` is installed correctly, just type:
`$ ant -version`
It should respond with version number and build date.

### assemble
Running `$ ant assemble` will concatenate the parts into one file `highcharts.src.js`. This file is
a generated file so don't edit it directly. We keep the assembled file in github so to be able to
directly reference it from jsFiddle. E.g:
`https://raw.github.com/highslide-software/highcharts.com/v2.1.6/js/highcharts.src.js`
will get you the 2.1.6 release.

### lint
Running `$ ant lint` will do a lint-check of the source. We follow jslint's rules as much as we can,
but there is still a few "bad" parts that are tolerated. Those are noted as general exceptions to
jslint in the build file or inlined in the source.

### build
To build minified versions of the source you run `$ ant build`. This step will first assemble the
parts then do lint and then minify the source. Both Google Closure Compliler and YUI compressor are
used here, but YUI compressor is only used as an extra validation step.

Running unit tests
------------------

We use js-test-driver from Google as unit test runner. It is quite easy to use and allows for simple
testing in various browsers. Read more here [js-test-driver](http://code.google.com/p/js-test-driver/wiki/GettingStarted).

The test driver server is started by `$ ant server`, this small web-server opens at
[localhost port 4224](http://localhost:4224). Then start the browsers you would like to run the
tests in and click `capture`.

Next, running `$ ant test` will run the unit tests in the captured browsers. This setup uses the built-in
jquery adapter when running the tests and also use the latest jquery release. If you want to run tests
with mootools and prototype adapters and across various releases, run `$ ant test-all`

### Running unit tests with code-coverage

It is possible to collect coverage data at the same time as running tests. The coverage report is used
to see which lines in the code are tested and which is not.

To start the js-test-driver in coverage mode, run `$ ant server-coverage`. It will open on port 5225. Then capture
a browser and run `$ ant test-coverage` to execute the tests and `$ ant test-report` to build a test report.

Repository layout
-----------------

* js - The javascript sources
* test - The tests
* lib - Libraries needed to build highcharts
* tools - Tools used during building
* studies - Small examples or studies thats not really in the core product

Source branches
---------------

* master - Contains the main branch for highcharts.
* stock2 - Development branch containing highstock product.
* android - Development branch for adding support for older android versions that do not use SVG.
