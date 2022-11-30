// import * as dfd from "danfojs"
import { readCSV } from "danfojs"
// import { Series } from "danfojs/dist/danfojs-base"

interface Point {
    variable: any;
    point_value: number;
    analysis_yielded: string;
}

interface Timestamp {
    time: string;
    points: Point[];
}

export function data_processing(
    input_data: any,
    selectedColumns: any,
    smoothing: boolean
): any {
    return readCSV(input_data)
        .then((df) => {
            if(smoothing){
                df = df
            }

            // we know date column is first
            var columns = selectedColumns.slice(1,)
            var key_points: Array<Timestamp> = []

            // find min/max of all colunns (1 for now)
            columns.forEach(function (column: string, i: number) {
                key_points = key_points.concat(absolute_max_min(df, column))
                for(var column2 of columns.slice(i+1,)){
                    key_points = key_points.concat(bivariate_analysis(df, column, column2))
                }
            });
        
            var final_json = JSON.parse(JSON.stringify(key_points))
            return final_json

        }).catch(err => {
            console.log(err);
        })
};

export function data_smoothing(
    input_data: any,
    selectedColumns: any
): any {
    return readCSV(input_data, selectedColumns)
        .then((df) => {
            // we know date column is first
            var columns = selectedColumns.slice(1,)
            var key_points: Array<Timestamp> = []

            // find min/max of all colunns (1 for now)
            columns.forEach(function (column: string, i: number) {
                key_points = key_points.concat(absolute_max_min(df, column))
                for(var column2 of columns.slice(i+1,)){
                    key_points = key_points.concat(bivariate_analysis(df, column, column2))
                }
            });
        
            var final_json = JSON.parse(JSON.stringify(key_points))
            return final_json

        }).catch(err => {
            console.log(err);
        })
};

function bivariate_analysis(
    df: any,
    col1: string,
    col2: string
): any {
    var date_col = df.columns[0]

    df['diff'] = (df[col1].sub(df[col2])).abs()
    let col_max = df['diff'].max({ axis: 0 })
    let col_min = df['diff'].min({ axis: 0 })

    let max_timestamps: string[] = df.loc({ rows: df['diff'].eq(col_max) })[date_col].values
    let min_timestamps: string[] = df.loc({ rows: df['diff'].eq(col_min) })[date_col].values

    let ret = []
    ret.push(create_point([col1, col2], col_max, "absolute difference maximum", max_timestamps[0]))
    ret.push(create_point([col1, col2], col_min, "absolute difference minimum", min_timestamps[0]))

    return ret
};

function absolute_max_min(
    df: any,
    col: string
): any {
    var date_col = df.columns[0]

    let col_max = df[col].max({ axis: 0 })
    let max_timestamps: string[] = df.loc({ rows: df[col].eq(col_max) })[date_col].values

    let col_min = df[col].min({ axis: 0 })
    let min_timestamps: string[] = df.loc({ rows: df[col].eq(col_min) })[date_col].values

    let ret = []
    ret.push(create_point([col], col_max, "absolute maximum", max_timestamps[0]))
    ret.push(create_point([col], col_min, "absolute minimum", min_timestamps[0]))

    return ret
};

function create_point(
    cols: any,
    col_value: number,
    description: string,
    time: any
): any {

    let point: Point = {
        variable: cols,
        point_value: col_value,
        analysis_yielded: description,
    };

    let item: Timestamp = {
        time: time,
        points: [point]
    }
    return item
};