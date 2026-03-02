# Next.js

## Server-side rendering

Highcharts interactive charts can not be generated on the server side, as the interactivity relies on a client environment.
Static images can be generated using the [Highcharts Export Server](https://www.highcharts.com/docs/export-module/setting-up-the-server).
In order to use Highcharts within recent versions (v13+) of Next.js using the app router,
you will have to add `'use client'` to files containing Highcharts components or
modules to ensure it is rendered on the client.

```jsx
"use client";

import { Chart, Title } from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";
import { Accessibility } from "@highcharts/react/modules/Accessibility";

export default function ChartPage() {
  return (
    <Chart>
      <Title>Hello NextJS!</Title>
      <LineSeries data={[1, 2, 3, 4, 5]} />
      <Accessibility />
    </Chart>
  );
}
```

## Pages router

If you’re using the pages router in Next.js, Highcharts can still be used easily as long as rendering is limited to the client side.
The main considerations are:

- Avoid using Highcharts directly in `getServerSideProps` or `getStaticProps`, since it requires a DOM environment.
- Components importing and rendering Highcharts should be standard React components, and will work as usual in pages under /pages.

## Streaming data from the server

While Highcharts does not work on the server, you can use server-side rendering
for data fetching and then stream the data to a client component rendering your chart.

Consider this `page.tsx` file:

```jsx
import { Suspense } from "react";
import DataChart from "./chart";

export default function Page() {
  const data = fetch("https://www.highcharts.com/samples/data/aapl.json").then(
    (res) => res.json(),
  );

  return (
    <Suspense fallback={<div>Loading data...</div>}>
      <DataChart data={data} />
    </Suspense>
  );
}
```

In combination with this `chart.tsx`:

```jsx
"use client";

import { use } from "react";

import { StockChart } from "@highcharts/react/Stock";
import { LineSeries } from "@highcharts/react/series/Line";
import { Title } from "@highcharts/react/options";
import { Accessibility } from "@highcharts/react/modules/Accessibility";

export default function DataChart({ data }) {
  const allData = use(data);

  return (
    <StockChart>
      <Title>Hello stock NextJS!</Title>
      <LineSeries data={allData} />
      <Accessibility />
    </StockChart>
  );
}
```

For more details, see the [Next.js documentation](https://nextjs.org/docs/app/getting-started/fetching-data#client-components).
