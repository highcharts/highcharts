Highcharts TypeScript Declarations
==================================

Highcharts provides integrated support for TypeScript through bundled
declarations files. TypeScript-compatible editors can give you tooltips and
suggestions for Highcharts as you type. The TypeScript compiler watches and
points out potential problems while coding. The outcome is a faster and better
fail-proofed development cycle for your Highcharts-based solutions.



Installation
------------

You need a TypeScript-capable Editor, like Microsoft's Visual Studio Code, for
getting autocompletion and hints for Highcharts. Please note that Highcharts
contains comprehensive declarations, which makes increased memory usage in a few
editors like Webstorm necessary. The declarations are part of the Highcharts NPM
package. The Highcharts NPM package can be installed in your project folder with
`npm install highcharts`.



Configuration
-------------

### TypeScript

Highcharts is a charting library most often used in the web browser and in that
case you probably need to modify the TypeScript configuration for the target
platform. The `tsconfig.json` below, covers a typical use case of Highcharts:

```json
{
    "compilerOptions": {
        "strict": true,
        "target": "es2020",
        "module": "es6",
        "moduleResolution": "node",
        "outDir": "mychart/",
    },
    "exclude": [
        "node_modules"
    ]
}
```

If you place your TypeScript source code (`*.ts`) in one of your project
folders, the TypeScript compiler will automatically find it, compile it and
output the JavaScript compiled code (`*.js`) to the `outDir` folder.

With the `exclude` property you prevent specified folders from compiling to
TypeScript, for example files found in the `node_modules` folder.


### RequireJS

Not every web browser is capable to load ES6 modules. Here comes RequireJS for a
compiler target of `AMD` into action. It needs some configuration to support the
Highcharts package:

```js
require.config({
    packages: [{
        name: 'highcharts',
        main: 'highcharts'
    }],
    paths: {
        'highcharts': 'https://code.highcharts.com'
    }
})
```

For Highcharts Stock and other additions it is recommended to use the previous
configuration and load the module (`highcharts/modules/stock`) instead. For the
package you have to change the configuration in the following way:

```js
require.config({
    packages: [{
        name: 'highcharts',
        main: 'highstock'
    }],
    paths: {
        'highcharts': 'https://code.highcharts.com/stock'
    }
})
```

Details about the configuration options can be found in the
[RequireJS documentation](https://requirejs.org/docs/api.html#config).



Using Highcharts Typing
-----------------------

There are some subtle differences in using the Highcharts product bundles and
the modules, either in classic namespace-based projects or as ES-module-based
projects.


### Highcharts Bundles

Starting point is one of the product bundles in the Highcharts NPM package. Best
practice is to always use the default product bundle in TypeScript projects.
This avoids conflicts between competing product bundles.

- For classic projects use:
  ```ts
  import Highcharts from 'highcharts';
  ```

- For ES module projects use:
  ```ts
  import Highcharts from 'highcharts/es-modules/masters/highcharts';
  ```

Other possible product bundles are:
- `../highcharts-gantt`
- `../highmaps`
- `../highstock`


### Highcharts Modules

With the help of Highcharts modules you can extend a Highcharts bundle with
additional functionality, for example to provide A11y controls. 

- For classic projects use:
  ```ts
  import Accessibility from 'highcharts/modules/accessibility';
  Accessibility(Highcharts);
  ```

- For ES module projects use:
  ```ts
  import Accessibility from 'highcharts/es-modules/masters/modules/accessibility';
  ```



Extending Highcharts Typing
---------------------------

The Highcharts libraries come with a huge amount of possibilities right out of
the box, but for a special use case you might need to extend default behavior of
Highcharts. Extending Highcharts in TypeScript follows a straightforward pattern
as illustrated with the below example.

### Steps

* Use proper typing in your extensions
* Declare additional interfaces of your extensions in the Highcharts namespace
* Make use of existing
  [Highcharts types](https://api.highcharts.com/class-reference/Highcharts) and
  [interfaces](https://api.highcharts.com/class-reference/Highcharts.Dictionary_T_)
* For a deep dive into TypeScript declarations take a look at the official
  [TypeScript guide](http://www.typescriptlang.org/docs/handbook/declaration-files/deep-dive.html).


### Example

If you like to have a custom highlight function for you data points, you could
come up with the following code. You might notice, that the beginning code is
actually not real TypeScript and instead is just common ECMAScript, widely known
as JavaScript:

```ts
import * as Highcharts from 'highcharts';

Highcharts.Point.prototype.highlight = function (event) {
    event = this.series.chart.pointer.normalize(event);
    this.onMouseOver(event);
    this.series.chart.tooltip.refresh(this);
    this.series.chart.xAxis[0].drawCrosshair(event, this);
};
```

First you have to make TypeScript aware of the types in your function, so you
have to specify the type of the `event` parameter in this example:

```ts
// ...
Highcharts.Point.prototype.highlight = function (
    event: Highcharts.PointerEvent
): void {
// ...
```

Secondly assure TypeScript, that creating a new function on `Highcharts.Point`
is really made by intention. You can do this with declarations for the
Highcharts namespace - in a separate file like `./global.d.ts` or directly in
your code:

```ts
// ...
declare module 'highcharts' {
    interface Point {
        highlight (event: Highcharts.PointerEventObject): void;
    }
}
// ...
```

Finally the source code of the example would look like this:

```ts
import * as Highcharts from 'highcharts';

declare module 'highcharts' {
    interface Point {
        highlight (event: Highcharts.PointerEventObject): void;
    }
}

Highcharts.Point.prototype.highlight = function (
    event: Highcharts.PointerEvent
): void {
    event = this.series.chart.pointer.normalize(event);
    this.onMouseOver(event);
    this.series.chart.tooltip.refresh(this);
    this.series.chart.xAxis[0].drawCrosshair(event, this);
};
```

Note: If you like to replace existing functionality of Highcharts, listen to the
Highcharts events instead of overwriting functions and methods. That way you can
avoid many unintended side effects. 



Project Migration
-----------------

### Migration from JavaScript

For full fail-proofed development you may convert your project's source code to
TypeScript. The initial step is:

```sh
npm install typescript && npx tsc --init 
```

More information about migrating JavaScript projects to TypeScript can be found
in the official
[TypeScript handbook](http://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html).


### Migration from Definitely Typed

If you previously used TypeScript declarations for Highcharts like
`@types/highcharts`, you should uninstall them to prevent any mismatch:

```sh
npm uninstall @types/highcharts 
```



Solving Problems
----------------

### Debugging

If TypeScript is complaining about your Highcharts options, then it might not
find the correct series as a reference. If that is the case, cast the series
options explicitly to the desired type and you get more helpful error messages:

```ts
series: [{
    type: "line",
    data: [1, 2, "3", 4, 5]
} as Highcharts.LineSeriesOptions] 
```


### Reporting Bugs

Highcharts TypeScript declarations are in a beta state. They can be used in
production, but will bring breaking changings in a future major version. In
that case, some modifications to the types will be necessary. If you found
something in TypeScript that is not working as in our
[documentation](https://api.highcharts.com/) or
[demos](https://www.highcharts.com/demo), you can create an
[issue report](https://github.com/highcharts/highcharts/issues) to inform us.
