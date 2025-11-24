---
sidebar_label: "Installation"
---

# Grid Installation

Highcharts Grid ships in two editions that share the same API but differ in feature scope and licensing.

| Edition | Package | Highlights |
| --- | --- | --- |
| **Grid Lite** | `@highcharts/grid-lite` | **Free**. Focused on viewing and interacting with data. |
| **Grid Pro** | `@highcharts/grid-pro` | **Commercial**. Adds editing, validation, sparklines, events and advanced workflows. |

Start with Lite if you only need read-only, interactive tables. Switch to Pro when you need editing, data validation, events or sparklines.

## Try before installing

See Grid in action without installing anything:

- **[Try in CodePen →](https://www.highcharts.com/samples/grid/demo/general?codepen)**
- **[Try in JSFiddle →](https://www.highcharts.com/samples/grid/demo/general?jsfiddle)**

## Installation

Get started with Highcharts Grid using either a bundler (Option 1) or a CDN (Option 2).

### Option 1: NPM & Bundlers

Best for projects using Vite, Webpack, Next.js, or other modern build tools.

**Step 1: Install**
```bash
npm install @highcharts/grid-lite
```

**Step 2: Add a container to your HTML**
```html
<div id="container"></div>
```

**Step 3: Create the grid**
```javascript
import Grid from '@highcharts/grid-lite/es-modules/masters/grid-lite.src.js';
import '@highcharts/grid-lite/css/grid-lite.css';

Grid.grid('container', {
    dataTable: {
        columns: {
            product: ['Apple', 'Pear', 'Plum', 'Banana'],
            price: [1.5, 2.53, 5, 4.5]
        }
    }
});
```

> **TIP:** Using TypeScript? Types are included automatically - no `@types` package needed.

### Option 2: CDN & Static

Best for quick prototypes, CodePen, JSFiddle, or projects without build tools.

**Grid Lite - Complete HTML:**
```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/@highcharts/grid-lite/grid-lite.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@highcharts/grid-lite/css/grid-lite.css" />
</head>
<body>
    <div id="container"></div>

    <script>
    Grid.grid('container', {
        dataTable: {
            columns: {
                product: ['Apple', 'Pear', 'Plum', 'Banana'],
                price: [1.5, 2.53, 5, 4.5]
            }
        }
    });
    </script>
</body>
</html>
```

> **TIP:** Want to lock to a specific version? Use: `https://cdn.jsdelivr.net/npm/@highcharts/grid-lite@2.0.0/grid-lite.js`

---

### Option 3: Download and self-host

Best when you need an offline setup or must serve assets from your own domain.

1. Download the latest Grid package from [highcharts.com/download](https://www.highcharts.com/download/).
2. Place the JS/CSS files on your server.
3. Reference them directly:

```html
<script src="/assets/grid/grid-lite.js"></script>
<link rel="stylesheet" href="/assets/grid/css/grid-lite.css" />
```

For Grid Pro, swap the filenames:

```html
<script src="/assets/grid/grid-pro.js"></script>
<link rel="stylesheet" href="/assets/grid/css/grid-pro.css" />
```

---

## Using Grid Pro

Switch to Grid Pro for editing, validation, sparklines, and advanced features.

### Install Grid Pro

```bash
# Basic installation
npm install @highcharts/grid-pro
```

### Import and configure

```javascript
import Grid from '@highcharts/grid-pro/es-modules/masters/grid-pro.src.js';
import '@highcharts/grid-pro/css/grid-pro.css';

// Create grid with Pro features
Grid.grid('container', {
    dataTable: {
        columns: {
            product: ['Apple', 'Pear', 'Plum', 'Banana'],
            price: [1.5, 2.53, 5, 4.5],
            inStock: [true, true, false, true]
        }
    },
    columns: [{
        id: 'product',
        cells: {
            editable: true
        }
    }, {
        id: 'price',
        cells: {
            editable: true,
            format: '${value}'
        }
    }, {
        id: 'inStock',
        cells: {
            editable: true
        }
    }]
});
```

## Framework integration

Grid works seamlessly with most major JavaScript frameworks.

### React

**Installation:**
```bash
npm install @highcharts/grid-lite
```

**GridComponent.tsx:**
```tsx
import { useEffect, useRef } from 'react';
import Grid from '@highcharts/grid-lite/es-modules/masters/grid-lite.src.js';
import '@highcharts/grid-lite/css/grid-lite.css';

export function GridComponent({ config }: { config: Grid.Options }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const grid = Grid.grid(containerRef.current, config);
        return () => grid?.destroy();
    }, [config]);

    return <div ref={containerRef} />;
}
```

**[View complete React guide →](https://www.highcharts.com/docs/grid/wrappers/grid-with-react)**

### Other Frameworks

| Framework | Guide |
| --- | --- |
| **Vue** | [View Vue Guide →](https://www.highcharts.com/docs/grid/wrappers/grid-with-vue) |
| **Angular** | [View Angular Guide →](https://www.highcharts.com/docs/grid/wrappers/grid-with-angular) |

## Next steps

Now that Grid is installed, explore what you can build:

- **[Introduction guide](https://www.highcharts.com/docs/grid/general)** – Build more complex grids with real data
- **[Understanding Grid](https://www.highcharts.com/docs/grid/understanding-grid)** – Configure columns, data sources, and events
- **[Theming guide](https://www.highcharts.com/docs/grid/theming/theming)** – Customize the look and feel
- **[API Reference](https://api.highcharts.com/grid/)** – Complete options and methods documentation

> **Upgrading from an older version?** See the [Migration Guide](https://www.highcharts.com/docs/dashboards/grid-migration) for detailed upgrade instructions from Grid 1.x or Dashboards 3.x.
