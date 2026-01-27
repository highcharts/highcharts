(function () {
    const state = {
        fetchCalls: [],
        grid: null,
        totalRowCount: 5
    };

    function createFetchResult(offset, limit) {
        const count = Math.max(
            0,
            Math.min(limit, state.totalRowCount - offset)
        );
        const ids = Array.from(
            { length: count },
            (_, i) => offset + i
        );
        return {
            columns: {
                id: ids,
                name: ids.map(id => `name-${id}`)
            },
            totalRowCount: state.totalRowCount,
            rowIds: ids.map(id => `row-${id}`)
        };
    }

    function createGrid(options) {
        const {
            totalRowCount = 5,
            data = {},
            pagination = { enabled: false }
        } = options || {};

        state.totalRowCount = totalRowCount;
        state.fetchCalls.length = 0;

        if (state.grid) {
            state.grid.destroy();
        }

        state.grid = Grid.grid('container', {
            data: {
                providerType: 'remote',
                ...data,
                fetchCallback: (_query, offset, limit) => {
                    state.fetchCalls.push({ offset, limit });
                    return createFetchResult(offset, limit);
                }
            },
            pagination
        });

        return state.grid;
    }

    window.remoteDataProviderTest = {
        createGrid,
        getGrid: () => state.grid,
        getFetchCalls: () => state.fetchCalls.slice(),
        getCacheState: () => {
            const dp = state.grid && state.grid.dataProvider;
            const dataChunks = dp && dp.dataChunks;
            const rowIdToChunkInfo = dp && dp.rowIdToChunkInfo;
            const chunkKeys = dataChunks ? Array.from(dataChunks.keys()) : [];

            return {
                chunkKeys,
                chunkCount: chunkKeys.length,
                rowIdCount: rowIdToChunkInfo ? rowIdToChunkInfo.size : 0
            };
        }
    };

    createGrid();
}());
