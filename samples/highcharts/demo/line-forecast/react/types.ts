export type ForecastResponse = {
    properties: {
        timeseries: {
            time: string;
            data: { instant: { details: { air_temperature: number } } };
        }[];
    };
};

export type Forecast = {
    data: [number, number][];
    today: number;
};
