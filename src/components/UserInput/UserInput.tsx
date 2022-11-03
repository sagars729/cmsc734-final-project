import React from 'react';
import CardList from '../CardList/CardList';
import './UserInput.css';
// import key_points from "../../json_data.json";

let key_points = [
    {
        time: "01-02-22 12:34:23",
        points:[
            {
                "variable":"cases",
                "point_value":"131",
                "analysis_yielded":"absolute maximum"
            },
            {
                "variable":"deaths",
                "point_value":"16",
                "analysis_yielded":"highest rise"
            }
        ]
    },
    {
        time: "04-14-20 08:51:14",
        points:[
            {
                "variable":"deaths",
                "point_value":"43",
                "analysis_yielded":"absolute maximum"
            }
        ]
    }
]

let data = {
    "01-02-22 12:34:23":[
       {
          "variable":"cases",
          "point_value":"131",
          "analysis_yielded":"absolute maximum"
       },
       {
          "variable":"deaths",
          "point_value":"16",
          "analysis_yielded":"highest rise"
       }
    ],
    "04-14-20 08:51:14":[
       {
          "variable":"deaths",
          "point_value":"43",
          "analysis_yielded":"absolute maximum"
       }
    ]
}
const printData = () => {
    console.log(data);
}

function UserInput() {
    return (
        <div>
            <div className="split left">
                <div className="centered">
                    <h1> CardList </h1>
                    {/* { key_points.map((kp) => {
                        return (
                            <div>
                                <h4>{kp.time}</h4>
                                <div>
                                    {kp.points.map((point, i) => {
                                        return (
                                            <div key={i}>
                                                <p>{point.variable}</p>
                                                <p>{point.point_value}</p>
                                                <input type='text' defaultValue={point.analysis_yielded}></input>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    } ) } */}
                    
                    {Object.keys(data).map( (time, idx, arr) => {
                        console.log("new iter!!");
                        return (
                            <div>
                                <h4>Time: {arr[idx]}</h4>
                                {Object.values(data).at(idx)?.map((key_point, i) => {
                                    console.log(key_point);
                                    return (
                                        <div>
                                            <p>index: {i}</p>
                                            <p>Variable: {key_point.variable}</p>
                                            <input type='text' defaultValue={key_point.analysis_yielded}></input>
                                        </div>
                                        
                                    )
                                })}
                            </div>
                        )

                    } )}
                    
                </div>
                <div className="bottom">
                    <button onClick={printData}>
                        submit data!
                    </button>
                </div>
            </div>

            <div className="split right">
                <div className="centered">
                    <h2>Graph from Shubham</h2>
                </div>
            </div>
        </div>
    )
}

export default UserInput;