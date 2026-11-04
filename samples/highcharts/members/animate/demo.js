// Custom animation without an owner element
Highcharts.animate(undefined, undefined, {
    // The step function. The `pos` argument animates from 0 to 1.
    step: pos => {
        document.getElementById('container').innerText =
            `${(pos * 100).toFixed(1)}%`;
    },
    duration: 2000
});