import React from 'react';
import ReactDOM from 'react-dom';
import { Series, Subtitle, Title } from '@highcharts/react';
import { StockChart } from '@highcharts/react/Stock';
import { SMASeries } from '@highcharts/react/indicators/SMA';
import { EMASeries } from '@highcharts/react/indicators/EMA';
import { PSARSeries } from '@highcharts/react/indicators/PSAR';
import { Accessibility } from '@highcharts/react/options/Accessibility';



const priceSeriesId = 'price-series';

const priceData = [
    ['2024-01-01', 172, 176, 169, 174],
    ['2024-01-02', 174, 179, 171, 177],
    ['2024-01-03', 177, 181, 173, 175],
    ['2024-01-04', 175, 180, 172, 179],
    ['2024-01-05', 179, 183, 175, 182],
    ['2024-01-08', 182, 186, 178, 185],
    ['2024-01-09', 185, 188, 181, 183],
    ['2024-01-10', 183, 187, 179, 181],
    ['2024-01-11', 181, 185, 177, 180],
    ['2024-01-12', 180, 184, 176, 178],
    ['2024-01-15', 178, 182, 174, 181],
    ['2024-01-16', 181, 185, 177, 184],
    ['2024-01-17', 184, 188, 180, 187],
    ['2024-01-18', 187, 191, 183, 189],
    ['2024-01-19', 189, 194, 185, 192]
];

const indicatorCatalog = [
    {
        id: 'sma-14',
        name: 'SMA (14)',
        type: 'sma',
        color: '#1aadce',
        params: {
            period: 14
        }
    },
    {
        id: 'ema-12',
        name: 'EMA (12)',
        type: 'ema',
        color: '#f28f43',
        params: {
            period: 12
        }
    },
    {
        id: 'sar',
        name: 'Parabolic SAR',
        type: 'psar',
        color: '#2b908f',
        params: {
            acceleration: 0.03,
            maxAcceleration: 0.3
        }
    }
];

const indicatorComponents = {
    sma: SMASeries,
    ema: EMASeries,
    psar: PSARSeries
};

function IndicatorControls({ activeIndicators, onAddIndicator, onReset }) {
    return (
        <div className="series-controls" role="group" aria-label="Indicator controls">
            {indicatorCatalog.map(indicator => {
                const isActive = activeIndicators.some(
                    active => active.id === indicator.id
                );

                return (
                    <button
                        key={indicator.id}
                        onClick={() => onAddIndicator(indicator)}
                        type="button"
                        disabled={isActive}
                    >
                        {isActive ? `${indicator.name} added` : `Add ${indicator.name}`}
                    </button>
                );
            })}

            <button
                disabled={activeIndicators.length === 0}
                onClick={onReset}
                type="button"
            >
                Reset indicators
            </button>
        </div>
    );
}

export default function ChartComponent() {
    const [indicatorSeries, setIndicatorSeries] = React.useState([]);

    const addIndicator = React.useCallback(indicator => {
        setIndicatorSeries(current => {
            if (current.some(entry => entry.id === indicator.id)) {
                return current;
            }

            return [
                ...current,
                {
                    ...indicator,
                    zIndex: 3
                }
            ];
        });
    }, []);

    const resetIndicators = React.useCallback(() => {
        setIndicatorSeries([]);
    }, []);

    return (
        <div className="dynamic-series-demo">
            <StockChart>
                <Title>Dynamic stock indicators</Title>
                <Subtitle>Add technical indicator series at runtime</Subtitle>

                <Accessibility />

                <Series
                    id={priceSeriesId}
                    name="Demo stock"
                    type="candlestick"
                    data={priceData}
                    zIndex={2}
                />

                {indicatorSeries.map(indicator => {
                    const IndicatorComponent = indicatorComponents[indicator.type];

                    if (!IndicatorComponent) {
                        return null;
                    }

                    const options = {
                        linkedTo: priceSeriesId,
                        id: indicator.id,
                        name: indicator.name,
                        color: indicator.color,
                        params: indicator.params,
                        zIndex: indicator.zIndex,
                    };

                    return (
                        <IndicatorComponent
                            key={indicator.id}
                            options={options}
                        />
                    );
                })}

            </StockChart>

            <IndicatorControls
                activeIndicators={indicatorSeries}
                onAddIndicator={addIndicator}
                onReset={resetIndicators}
            />
        </div>
    );
}

ReactDOM.createRoot(
    document.querySelector('#container')
)?.render(<ChartComponent />);
