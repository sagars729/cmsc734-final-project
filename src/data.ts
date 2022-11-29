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
    input_data: any,
    selectedColumns: any
): any {
    return readCSV(input_data, selectedColumns)
        .then((df) => {
            // we know date column is first
            var columns = selectedColumns.slice(1,)
            var key_points = []

            // find min/max of all colunns (1 for now)
            for (var column of columns) {
                if(df.column(column).dtypes[0] === 'int32'){
                    key_points.push(absolute_max_min(df, column))
                } 
            }

            // find simple key points using df functions
            var final_json = JSON.parse(JSON.stringify(key_points))
            return final_json

        }).catch(err => {
            console.log(err);
        })
};

function absolute_max_min(
    df: any,
    col: string
): any {
    var date_col = df.columns[0]
    df = df.asType(col, "int32")

    let col_min = df[col].min({ axis: 0 })
    let min_timestamps: string[] = df.loc({ rows: df[col].eq(col_min) })[date_col].values

    //how to account for multiple minimums?
    // if(max_timestamps.length > 3){
    //     return;
    // }

    return create_point(col, col_min, "absolute minimum", min_timestamps[0])
};

function create_point(
    col: string,
    col_max: number,
    description: string,
    time: any
): any {

    let absolute_max: Point = {
        variable: col,
        point_value: col_max,
        analysis_yielded: description,
    };

    let max_point: Timestamp = {
        time: time,
        points: [absolute_max]
    }

    return max_point
};