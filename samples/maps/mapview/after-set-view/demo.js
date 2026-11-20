(async () => {
    const play = document.getElementById('play'),
        reset = document.getElementById('reset'),
        status = document.getElementById('status'),
        mapData = await fetch(
            'https://code.highcharts.com/mapdata/custom/world.topo.json'
        ).then(response => (response.ok ? response.json() : null))
            .catch(() => null);

    if (!mapData) {
        status.textContent = 'Could not load the map. Reload to try again.';
        return;
    }

    const paris = [2.35, 48.86],
        destinationZoom = 6,
        duration = 6000,
        reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

    const chart = Highcharts.mapChart('container', {
        title: { text: 'Fly to Paris' },
        mapNavigation: {
            enabled: true,
            enableMouseWheelZoom: false
        },
        mapView: {
            center: [-15, 42],
            zoom: 2.5
        },
        series: [{ mapData }, {
            type: 'mappoint',
            name: 'Destination',
            data: [{
                name: 'Paris',
                lon: paris[0],
                lat: paris[1]
            }]
        }]
    });

    const view = chart.mapView,
        startingCenter = [...view.center],
        startingZoom = view.zoom;

    let flight,
        frame,
        settingView = false;

    function pause(message) {
        cancelAnimationFrame(frame);
        frame = undefined;
        play.textContent = 'Play';
        status.textContent = message;
    }

    function animate(time) {
        flight.elapsed = Math.max(0, time - flight.startedAt);

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
            flight = undefined;
            pause('Arrived in Paris.');
        }
    }

    const unbindViewChange = Highcharts.addEvent(view, 'afterSetView', () => {
        if (flight && !settingView) {
            flight = undefined;
            pause('Manual control. Play to fly to Paris.');
        }
    });

    function togglePlayback() {
        if (frame !== undefined) {
            pause('Paused.');
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
        flight.startedAt = performance.now() - flight.elapsed;
        play.textContent = 'Pause';
        status.textContent = 'Drag the map or zoom to take control.';
        frame = requestAnimationFrame(animate);
    }

    function resetCamera() {
        flight = undefined;
        pause('Returned to the starting view.');
        view.setView(startingCenter, startingZoom, true, false);
    }

    play.addEventListener('click', togglePlayback);
    reset.addEventListener('click', resetCamera);
    status.textContent = 'Ready.';
    play.disabled = false;
    reset.disabled = false;

    Highcharts.addEvent(chart, 'destroy', () => {
        pause(status.textContent);
        unbindViewChange();
        play.removeEventListener('click', togglePlayback);
        reset.removeEventListener('click', resetCamera);
        play.disabled = true;
        reset.disabled = true;
    });
})();
