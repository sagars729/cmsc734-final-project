import moment from 'moment';
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
    
    //place holder values. these will be taken from shubham
    let counter = 1;

    const [data, setData] = useState(originalData);

    const printData = (data:any) => {
        console.log(data);
    }
    
    const addKeyPoint = (time:string, attribute:string) => {
        let newData = [...data];

        //temporarily adding fake dates
        var i = moment()
        .utcOffset('+08:30')
        .format('MM-DD-YY hh:mm:ss');
        

        var jsonPoints = [{ "variable": attribute, "point_value": "" + counter, "analysis_yielded": "<input>"}]
        var jsonObj = { "time": i, "points": jsonPoints};

        newData.push(jsonObj);
        newData.sort( (a, b) => a.time.localeCompare(b.time));
        setData(newData);        
    }

    // don't think we'll need this
    const componentDidUpdate = (id:any) => {
        var element = document.getElementById(id);
        if (element != null){
            element.scrollIntoView();
            element.scrollIntoView({behavior: "smooth"}); 
        }
    }
    
    const deletePoint = (time:string , index:number) => {

        let newData = [...data];

        newData.find(val => {return val.time === time})?.points.splice(index, 1);
        var len = newData.find(val => {return val.time === time})?.points.length;
        
        if (len === 0) {
            var toRemove = newData.findIndex(val => {return val.time === time});
            newData.splice(toRemove, 1);
            // console.log(data);

            newData.sort( (a, b) => a.time.localeCompare(b.time));
        }
        
        setData(newData);        

    }
    
    return (
        <div>
            <div className="centered">
                <h1> Key Points </h1>
                {data.map(item => {
                    return (
                        <div id={item.time} key={item.time} className="parent">
                            <h4>{item.time}</h4>
                            <div>
                            {item.points.map( (point, i) => {
                                return (
                                    <div key={i} className="child">
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
                
                <button onClick={(e) => {
                        var timeStamp = moment()
                        .utcOffset('+08:30')
                        .format('MM-DD-YYYY hh:mm:ss');

                        var variableStr = "something";
                        addKeyPoint(timeStamp, variableStr);
                    } }>

                    add key_point
                </button>
                <button onClick={(e) => printData(data)}>
                    submit data!
                </button>
                
            </div>

                
        </div>
    )
}

export default UserInput;
