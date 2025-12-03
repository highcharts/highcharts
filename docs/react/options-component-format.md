# Format options with components

## React components and JSX
It is possible to use React components and JSX elements as children of certain option components:

```jsx
function TitleFormat({ country }) {
    return (
        <>Fruit consumption in <em>{country}</em></>
    );
}

function ChartComponent() {
    const countryData = {
        Norway: [
            ['Apples', 1],
            ['Pears', 2],
            ['Bananas', 3],
            ['Oranges', 4]
        ],
        Sweden: [
            ['Apples', 2],
            ['Pears', 1],
            ['Bananas', 5],
            ['Oranges', 1]
        ]
    };

    const [
        country,
        setCountry
    ] = useState(Object.keys(countryData)[0]);

    return (
        <div>
            <Chart>
                <Title>
                    <TitleFormat country={country} />
                </Title>
                <XAxis type="category" />
                <Series type="column" data={countryData[country]} />
            </Chart>

            <CountrySelect
                currentCountry={country}
                countryData={countryData}
                onChange={(c) => setCountry(c)}
            />
        </div>
    );
}
```

See [the full example here](https://www.highcharts.com/samples/embed/highcharts/react/reactive-title).

## Option binding

If you want to bind specific elements within your component to specific options, you can use the `data-hc-option` attribute. This attribute allows you to specify which sub-option the element should be bound to. Here's an example:

```jsx
function TooltipFormat() {
  return (
    <>
      <div data-hc-option="headerFormat">
        <strong>{'Series {series.name}'}</strong>
      </div>
      <div data-hc-option="pointFormat">
        {'X: {point.x}, Y: {point.y}'}
      </div>
      <div data-hc-option="footerFormat">
        <em>Footer text</em>
      </div>
    </>
  );
}

function ChartComponent() {
  return (
    <Chart>
      <Series type="column" data={[1, 2, 3]} />

      <Tooltip>
        <TooltipFormat />
      </Tooltip>
    </Chart>
  );
}
```

**Note:** The `data-hc-option` attributes links the elements to `tooltip.headerFormat`, `tooltip.pointFormat`, and `tooltip.footerFormat`.

## Caveats

As the components within the chart are parsed statically into Highcharts options, state changes within custom components will not be reflected.

Not all option components supports child components. See [Appendix A](https://www.highcharts.com/docs/react/component-children) for an overview.


## See also

A complete example combining multiple option components:

<iframe src="https://www.highcharts.com/samples/embed/highcharts/react/complex" style="width: 100%; height: 600px; border: 0;"></iframe>
