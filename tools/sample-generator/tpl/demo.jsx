import React from 'react';
import ReactDOM from 'react-dom';
/* __REACT_IMPORTS__ */
/* __HIGHCHARTS_SETUP__ */

export default function ChartComponent() {
    /* __DATA_STATE_BLOCK__ */
    const chartOptions = React.useMemo(() => (
        __CHART_OPTIONS__
    ), __DEPENDENCIES__);

    return (
        <__COMPONENT_NAME__ options={chartOptions} />
    );
}

ReactDOM.createRoot(
    document.querySelector('#container')
)?.render(<ChartComponent />);
