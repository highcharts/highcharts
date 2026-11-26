import { useEffect, useState } from 'react';
import { StockChart } from '@highcharts/react/Stock';
import { Title } from '@highcharts/react';
import { LineSeries } from '@highcharts/react/series/Line';
import type { LineSeriesProps } from '@highcharts/react/series/Line';
import { Exporting } from '@highcharts/react/modules/Exporting';

export default function MaskinsideFalseChart() {
    const [usdeur, setUsdeur] = useState<NonNullable<
        LineSeriesProps['data']
    > | null>(null);

    useEffect(() => {
        let cancelled = false;

        fetch('https://www.highcharts.com/samples/data/usdeur.json')
            .then((response) => response.json())
            .then((json) => {
                if (!cancelled) {
                    setUsdeur(json);
                }
            })
            .catch((error) => console.error(error));

        return () => {
            cancelled = true;
        };
    }, []);

    if (!usdeur) {
        return null;
    }

    return (
        <StockChart
            options={{
                navigator: {
                    maskInside: false
                },
                rangeSelector: {
                    selected: 4
                }
            }}
            containerProps={{ id: 'container' }}
        >
            <Title>Navigator mask is outside zoomed range</Title>
            <Exporting />
            <LineSeries name="USD to EUR" data={usdeur} />
        </StockChart>
    );
}
