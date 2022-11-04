import React, { useState} from 'react';
import './KeyPointsList.css';
// import key_points from "../../json_data.json";

const UserInput = () => {
    let originalData =  [
        {
        time: "01-02-22 12:34:23",
        points: [
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
              "analysis_yielded":"absolute minimum"
           }
        ]
    }]
    
    const [data, setData] = useState(originalData);

    const printData = (data:any) => {
        console.log(data);
    }
    
    const addKeyPoint = () => {
        
    
    }
    
    const deletePoint = (time:string , index:number) => {
        console.log(time);
        console.log(index);

        console.log("data length =" + data.length);

        let newData = [...data];

        newData.find(val => {return val.time === time})?.points.splice(index, 1);
        var len = newData.find(val => {return val.time === time})?.points.length;
        console.log("array length =" + len);
        // var kk = jsonObj?.points.splice(index, 1);
        if (len === 0) {
            console.log("0000");    
            var toRemove = newData.findIndex(val => {return val.time === time});
            console.log("index to remove " + toRemove);
            newData.splice(toRemove, 1);
            // console.log(data);
        }
        
        setData(newData);
        

    }
    
    return (
        <div>
                <div className="centered">
                    <h1> Key Points </h1>
                    {data.map(item => {
                        return (
                            <div key={item.time}>
                                <h4>{item.time}</h4>
                                <div>
                                {item.points.map( (point, i) => {
                                    return (
                                        <div key={i}>
                                            <p>value: {point.point_value}</p>
                                            <p>Variable: {point.variable}</p>
                                            <textarea 
                                                defaultValue={point.analysis_yielded}
                                                onChange={(e) => {
                                                    point.analysis_yielded = e.target.value;
                                                }}>   
                                            </textarea>
                                            <div>
                                                <button onClick={ (e) => deletePoint(item.time, i)}>
                                                    delete key_point
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                                </div>
                            </div>
                        )
                    })}
                    
                    
                    
                </div>
                <div className="bottom">
                    <button onClick={(e) => printData(data)}>
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
