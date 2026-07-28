# Chart instance

If you need to access the specific chart instance, you can use the `ref` prop.
The `ref` prop will be passed a reference to the chart instance, as well as the
chart container element.

```tsx
import { Chart, type HighchartsReactRefObject } from "@highcharts/react";

function RefExample() {
  const ref = useRef<HighchartsReactRefObject>(null);

  useEffect(() => {
    if (ref.current?.chart) {
      // Access the chart instance.
    }
    if (ref.current?.container) {
      // Access the chart container element.
    }
  }, []);

  return <Chart ref={ref} />;
}
```
