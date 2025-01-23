# A wind of change with Highcharts version 12

Highcharts v12 has introduced new Webpack-based UMD packages to make Highcharts modules easier to use and faster.
Thanks to this change everyone can soon also use the full potential of ESM packages.
The new UMD is with some setups compatible to the previous UMD, while it also brings some changes for other setups.
This document lays out the changes of Highcharts v12 packages.

### 1. No module factory

The new UMD does not come with a factory for Highcharts modules anymore.
Instead of calling each factory with the Highcharts namespace, all modules will recognize automatically the shared namespace.
This means less code to load Highcharts modules.

Before v12:
```js
import Highcharts from 'highcharts';
import HighchartsExport from 'highcharts/modules/exporting';
HighchartsExport(Highcharts);
```

With v12:
```js
import Highcharts from 'highcharts';
import 'highcharts/modules/exporting';
```

Support both variants:
```js
import Highcharts from 'highcharts';
import HighchartsExport from 'highcharts/modules/exporting';
typeof HighchartsExport === 'function' && HighchartsExport(Highcharts);
```

### 2. Asynchronous / Lazy loading requires ESM

Because of the nature of UMD, async support for Highcharts modules was limited to certain setups only.
The new UMD is now consistently expecting synchronous loading in all setups.
For an asynchronous approach, one needs to use the ESM variants, which can be found in the `highcharts/es-modules/masters/` path.

* HTML Example:
  ```js
  <script type="module">
  import Highcharts from 'https://code.highcharts.com/highcharts/es-modules/masters/highcharts.js';
  import 'https://code.highcharts.com/highcharts/es-modules/masters/highcharts-more.js';
  import 'https://code.highcharts.com/highcharts/es-modules/masters/modules/exporting.js';
  import 'https://code.highcharts.com/highcharts/es-modules/masters/modules/accessibility.js';
  </scripts>
  ```

* Node.js / Next.js Example:
  ```js
  import Highcharts from 'highcharts/es-modules/masters/highcharts.js';
  import 'highcharts/es-modules/masters/highcharts-more.js';
  import 'highcharts/es-modules/masters/modules/exporting.js';
  import 'highcharts/es-modules/masters/modules/accessibility.js';
  ```

### 3. No Highcharts._modules event

Highcharts before v12 included an internal module system to allow instant modifications.
This internal module system has been removed.
Alternative ways of instant modifications can be accomplished with
[custom packages](https://www.highcharts.com/docs/getting-started/how-to-create-custom-highcharts-packages)
and dynamic imports.

## More changes

To learn more about all changes see our
[blog post about Highcharts v12](https://www.highcharts.com/blog/news/highcharts-version-12/).
