// import * as dfd from "danfojs"
import { readCSV } from "danfojs"
// import { Series } from "danfojs/dist/danfojs-base"

interface Point {
    variable: string;
    point_value: number;
    analysis_yielded: string;
}

interface Timestamp {
    time: string;
    points: Point[];
}

export function data_processing(
    input_data: any
): any {
    readCSV(input_data)
        .then((df) => {
            // assume date column is first
            df.drop({ columns: [''], inplace: true });
            var columns = df.columns.slice(1,)
            var key_points = []

            // find min/max of all colunns (1 for now)
            for (var column of columns) {
                key_points.push(absolute_max_min(df, column))
            }

            // find simple key points using df functions
            var final_json = JSON.stringify(key_points)
            console.log(final_json)
            return final_json

        }).catch(err => {
            console.log(err);
        })
};

export function absolute_max_min(
    df: any,
    col: string
): any {
    var date_col = df.columns[0]
    df = df.asType(col, "int32")

    let col1_max = df[col].max({ axis: 0 })
    let max_timestamps: string[] = df.loc({ rows: df[col].eq(col1_max) })[date_col].values

    let absolute_max: Point = {
        variable: col,
        point_value: col1_max,
        analysis_yielded: "absolute maximum",
    };

    let max_points: Timestamp = {
        time: max_timestamps[0],
        points: [absolute_max]
    }

    console.log(max_points)
    return max_points
    // let col1_min = df[col1].min({ axis: 0 })
    // let min_timestamps = df.loc({ rows: df[col1].eq(col1_min) })[date_col].values

};