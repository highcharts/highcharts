(function () {
    const state = {
        fetchCalls: [],
        grid: null,
        totalRowCount: 5
    };

    function createFetchResult(offset, limit, orderedIds) {
        const safeIds = orderedIds || Array.from(
            { length: state.totalRowCount },
            (_, i) => i
        );
        const ids = safeIds.slice(offset, offset + limit);
        return {
            columns: {
                id: ids,
                name: ids.map(id => `name-${id}`)
            },
            totalRowCount: state.totalRowCount,
            rowIds: ids.map(id => `row-${id}`)
        };
    }

    function getSortedIds(query) {
        const ids = Array.from(
            { length: state.totalRowCount },
            (_, i) => i
        );
        const sortingOrder = query?.sorting?.currentSorting?.order;

        if (sortingOrder === 'desc') {
            ids.reverse();
        }

        return ids;
    }

    function createGrid(options) {
        const {
            totalRowCount = 5,
            data = {},
            pagination = { enabled: false },
            columns
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
                fetchCallback: (query, offset, limit) => {
                    const sortedIds = getSortedIds(query);
                    state.fetchCalls.push({ offset, limit });
                    return createFetchResult(offset, limit, sortedIds);
                }
            },
            columns,
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
