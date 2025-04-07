import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import {
    Chart,
    Series,
    Title,
    XAxis
} from '@highcharts/react';

function TitleFormat({ country }) {
    return (
        <>
            Fruit consumption in {country}
        </>
    )
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

            <h2>Select country</h2>
            {Object.keys(countryData).map((countryName) => (
                <label key={countryName}>
                    <input
                        type="radio"
                        name="country"
                        value={countryName}
                        checked={country === countryName}
                        onChange={() => setCountry(countryName)}
                    />
                    {countryName}
                </label>
            ))}
        </div>
    );
}

ReactDOM.createRoot(
    document.querySelector('#container')
)?.render(<ChartComponent />);
