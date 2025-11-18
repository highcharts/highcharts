---
sidebar_label: "Installation"
---

# Grid Installation

Highcharts Grid ships in two editions that share the same API but differ in feature scope and licensing.

| Edition | Package | Highlights |
| --- | --- | --- |
| Grid Lite | `@highcharts/grid-lite` | Free, focused on viewing and interacting with data. |
| Grid Pro | `@highcharts/grid-pro` | Commercial, adds editing, validation, sparklines, events and advanced workflows. |

Start with Lite if you only need read-only tables; switch to Pro when you need editing, validation or deep Highcharts Dashboards integration.

## 🚀 Try before installing

See Grid in action without installing anything:

- **[Try in CodePen →](https://www.highcharts.com/samples/grid/demo/grid-column-filtering?codepen)**
- **[Try in JSFiddle →](https://www.highcharts.com/samples/grid/demo/grid-column-filtering?jsfiddle)**

## Installation

Get started with Highcharts Grid using either a bundler (Path A) or a CDN (Path B):

### 📦 Path A: NPM/ESM (Modern bundlers)

Best for: Projects using Vite, Webpack, Next.js, or other modern build tools

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

That's it!

> **TIP:** Using TypeScript? Types are included automatically - no `@types` package needed.

### ⚡ Path B: CDN (No build tools)

Best for: Quick prototypes, CodePen, JSFiddle, or projects without build tools

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
        if (!containerRef.current) {
            return;
        }

        const grid = Grid.grid(containerRef.current, config);

        // Cleanup on unmount
        return () => {
            grid?.destroy();
        };
    }, [config]);

    return <div ref={containerRef} />;
}
```

**App.tsx:**
```tsx
import { GridComponent } from './components/GridComponent';

export default function App() {
    return <GridComponent config={{
        dataTable: {
            columns: {
                product: ['Apple', 'Pear', 'Plum', 'Banana'],
                price: [1.5, 2.53, 5, 4.5]
            }
        }
    }} />;
}
```

> **NOTE:** For Next.js and other SSR frameworks, the `useEffect` hook ensures Grid only runs in the browser.

**[View complete React guide →](https://www.highcharts.com/docs/grid/wrappers/grid-with-react)**

Need Vue or Angular? Follow the [Vue guide](https://www.highcharts.com/docs/grid/wrappers/grid-with-vue) or [Angular guide](https://www.highcharts.com/docs/grid/wrappers/grid-with-angular) for full templates and CLI instructions.

## Next steps

Now that Grid is installed, explore what you can build:

- **[Introduction guide](https://www.highcharts.com/docs/grid/general)** – Build more complex grids with real data
- **[Understanding Grid](https://www.highcharts.com/docs/grid/understanding-grid)** – Configure columns, data sources, and events
- **[Theming guide](https://www.highcharts.com/docs/grid/theming/theming)** – Customize the look and feel
- **[API Reference](https://api.highcharts.com/grid/)** – Complete options and methods documentation

> **Upgrading from an older version?** See the [Migration Guide](https://www.highcharts.com/docs/dashboards/grid-migration) for detailed upgrade instructions from Grid 1.x or Dashboards 3.x.
