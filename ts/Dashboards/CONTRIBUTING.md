# Contributor Notes

Thank you for contributing to Highcharts Dashboards! :clap: :tada:

This file contains additional guidelines for contributing source code to
Highcharts Dashboards. The main guidelines can be found in
[../../CONTRIBUTING.md](../../CONTRIBUTING.md).



## API documentation

Highcharts Dashboards uses a TypeDoc setup to provide API documentation.
Therefor documentation comments do not need to contain type information. The
exception is shared code which is also consumed by Highcharts.

You can create the API documentation in `build/api/dashboards` with the
following command:

``` Shell
npx gulp dashboards/api-docs
```

Open the documentation with a browser of your choice:

``` Shell
open build/api/dashboards/index.html
```
