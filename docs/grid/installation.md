# DataGrid Installation

Highcharts Grid comes in two versions: **Grid Lite** and **Grid Pro**.
- **Grid Lite** is a free version of Grid Pro with a limited feature set.
- **Grid Pro** will be available after the release of Highcharts Dashboards v4. Currently, its functionality is part of the **Dashboards** package.

## Installing Grid

### Install via NPM
One way to add Grid to your web page is by installing it via npm:

```bash
npm install @highcharts/grid-lite
```

Then, import the package into your project:

```js
import Grid from '@highcharts/grid-lite/grid-lite';
```

### Include Grid via `<script>` tag
You can also load Grid Lite by adding the appropriate JavaScript file to your page's `<head>` section:

```html
<script src="https://code.highcharts.com/grid/grid-lite.js"></script>
```

Alternatively, you can download the file from [highcharts.com](https://www.highcharts.com/download/) and host it on your own server:

```html
<script src="../code/grid/grid-lite.js"></script>
```

### Importing CSS
The library does not include styles by default, so you need to import them manually:

```css
@import url("https://code.highcharts.com/grid/css/grid.css");
```

Or if you are using the NPM package:


```js
import '@highcharts/grid-lite/css/grid.css';
```

### Get Started
Once installed, you are ready to use Grid Lite. Check out [Your First Grid](https://www.highcharts.com/docs/grid/general) to learn more.

## Installing Grid Pro
Currently, Grid Pro is part of Highcharts Dashboards and will be available as a standalone library after the release of Dashboards v4.

