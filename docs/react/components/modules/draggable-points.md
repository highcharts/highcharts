# DraggablePoints

You can add the draggable-points module to your chart using the `DraggablePoints` component:

```tsx
import { Chart, YAxis } from "@highcharts/react";
import { BubbleSeries } from "@highcharts/react/series/Bubble";
import { DraggablePoints } from "@highcharts/react/modules/DraggablePoints";

export default function DraggablePointsChart() {
  return (
    <Chart>
      <DraggablePoints />
      <YAxis softMin={0} softMax={350} />
      <BubbleSeries
        data={[
          [100, 240, 3],
          [200, 130, 10],
          [450, 290, 15],
        ]}
        options={{
          cursor: "move",
          dragDrop: {
            draggableX: true,
            draggableY: true,
          },
        }}
      />
    </Chart>
  );
}
```

To configure draggable-points behavior on your chart, see the [series.dragDrop](https://api.highcharts.com/highcharts/series.line.dragDrop) API option.
