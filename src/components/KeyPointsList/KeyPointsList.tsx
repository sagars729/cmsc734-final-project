import { conditionalExpression } from '@babel/types';
import moment from 'moment';
import React, { useState} from 'react';
import './KeyPointsList.css';


const UserInput = (props : any) => {
    //place holder values. these will be taken from shubham
    let counter = 1;

    const printData = (data:any) => {
        console.log(data);
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

        let newData = [...props.data];

        newData.find(val => {return val.time === time})?.points.splice(index, 1);
        var len = newData.find(val => {return val.time === time})?.points.length;
        
        if (len === 0) {
            var toRemove = newData.findIndex(val => {return val.time === time});
            newData.splice(toRemove, 1);
            // console.log(data);

            // newData.sort( (a, b) => a.time.localeCompare(b.time));
            newData.sort((a,b) => {
                return new Date(a.time).getTime() - 
                    new Date(b.time).getTime()
            });
        }
        
        props.setData(newData);        

    }
    
    // the keypoints function is not adding to the overall data
    return (
        <div>
            <div className="centered">
                <h1> Key Points </h1>
                {props.data.map((item:any) => (

                    <div id={item.time} key={item.time} className="parent">
                        <h4>{item.time}</h4>
                        <div>
                            {item.points.map( (point:any, i:number) => (
                                <div key={i + "_" + point.variable} className="child">
                                    <p>Variable: {point.variable}</p>
                                    <textarea 
                                        defaultValue={point.analysis_yielded}
                                        onChange={(e) => {
                                            point.analysis_yielded = e.target.value;
                                        }}>   
                                    </textarea>
                                    <div>
                                        <button onClick={ (e) => deletePoint(item.time, i)} disabled={props.disabled}>
                                            delete key_point
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                
                <button onClick={(e) => {
                        var timeStamp = moment()
                        .utcOffset('+08:30')
                        .format('YYYY-MM-DD');

                        var variableStr = "something";
                        props.addKeyPoints(timeStamp, variableStr);
                    } }
                    disabled={props.disabled}>

                    add key_point
                </button>
                <button onClick={(e) => {
                    printData(props.data)
                    }  }
                    disabled={props.disabled}>
                    submit data!
                </button>
                
            </div>

                
        </div>
    )
}

export default UserInput;
