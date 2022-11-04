import React from 'react';
import './UserInput.css';
// import key_points from "../../json_data.json";

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
          "analysis_yielded":"absolute minimum"
       }
    ]
}

const printData = () => {
    console.log(data);
}

const addKeyPoint = () => {

}

function UserInput() {
    return (
        <div>
                <div className="centered">
                    <h1> Key Points </h1>
                    
                    {Object.keys(data).map( (time, idx, arr) => {
                        return (
                            <div key={time}>
                                <h4>Time: {arr[idx]}</h4>
                                {Object.values(data).at(idx)?.map((key_point, i) => {
                                    return (
                                        <div key={i}>
                                            <p>index: {i}</p>
                                            <p>value: {key_point.point_value}</p>
                                            <p>Variable: {key_point.variable}</p>
                                            <input type='text' 
                                                defaultValue={key_point.analysis_yielded}
                                                onChange={(e) => {
                                                    key_point.analysis_yielded = e.target.value;
                                                }}>   
                                            </input>
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
                <div className="bottom">
                    <button onClick={addKeyPoint}>
                        add key_point
                    </button>
                </div>
        </div>
    )
}

export default UserInput;