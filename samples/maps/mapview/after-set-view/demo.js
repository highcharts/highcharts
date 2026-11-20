(async () => {
    const play = document.getElementById('play'),
        status = document.getElementById('status');

    let mapData;
    try {
        const response = await fetch(
            'https://code.highcharts.com/mapdata/custom/world.topo.json'
        );
        if (!response.ok) {
            throw new Error('Could not load the map.');
        }
        mapData = await response.json();
    } catch {
        status.textContent = 'Could not load the map. Reload to try again.';
        return;
    }

    const paris = [2.35, 48.86],
        destinationZoom = 6,
        duration = 6000,
        reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

    const chart = Highcharts.mapChart('container', {
        title: {
            text: 'Fly to Paris'
        },
        accessibility: {
            description: 'Use Play or Pause below the map to control the ' +
                'camera. Pan or zoom to take control.'
        },
        mapNavigation: {
            enabled: true,
            enableMouseWheelZoom: false
        },
        mapView: {
            center: [-15, 42],
            zoom: 2.5
        },
        series: [{
            mapData
        }, {
            type: 'mappoint',
            name: 'Destination',
            data: [{
                name: 'Paris',
                geometry: {
                    type: 'Point',
                    coordinates: paris
                }
            }]
        }]
    });

    const view = chart.mapView;

    let flight,
        frame,
        previousTime,
        settingView = false;

    function pause() {
        cancelAnimationFrame(frame);
        frame = undefined;
        previousTime = undefined;
        play.textContent = 'Play';
    }

    function animate(time) {
        flight.elapsed += time - (previousTime ?? time);
        previousTime = time;

        const progress = reducedMotion.matches ?
                1 : Math.min(1, flight.elapsed / duration),
            ease = progress * progress * (3 - 2 * progress),
            center = flight.center.map((value, i) =>
                value + (paris[i] - value) * ease
            ),
            zoom = flight.zoom + (destinationZoom - flight.zoom) * ease;

        // setView also fires afterSetView for each animation frame.
        settingView = true;
        view.setView(center, zoom, true, false);
        settingView = false;

        if (progress < 1) {
            frame = requestAnimationFrame(animate);
        } else {
            pause();
            flight = undefined;
            status.textContent = 'Arrived in Paris.';
        }
    }

    const unbindViewChange = Highcharts.addEvent(view, 'afterSetView', () => {
        if (flight && !settingView) {
            pause();
            flight = undefined;
            status.textContent = 'Manual control. Play to fly to Paris.';
        }
    });

    function togglePlayback() {
        if (frame !== undefined) {
            pause();
            status.textContent = 'Paused.';
            return;
        }

        const [lon, lat] = view.center;
        if (
            !flight &&
            view.zoom === destinationZoom &&
            Math.hypot(lon - paris[0], lat - paris[1]) < 1e-6
        ) {
            status.textContent = 'Arrived in Paris.';
            return;
        }

        flight = flight ?? {
            center: [lon, lat], zoom: view.zoom, elapsed: 0
        };
        play.textContent = 'Pause';
        status.textContent = 'Drag the map or zoom to take control.';
        frame = requestAnimationFrame(animate);
    }

    play.addEventListener('click', togglePlayback);
    status.textContent = 'Play to fly to Paris.';
    play.disabled = false;

    Highcharts.addEvent(chart, 'destroy', () => {
        pause();
        unbindViewChange();
        play.removeEventListener('click', togglePlayback);
        play.disabled = true;
    });
})();
