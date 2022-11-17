import React from 'react';
import './KeyPointsList.css';

const UserInput = (props : any) => {

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
        <div className="centered">
            <h1> Key Points </h1>
            {props.data.map((item:any, idx:number) => (

                <div id={item.time} key={item.time} className="parent">
                    <h4>{item.time}</h4>
                    <div>
                        {item.points.map( (point:any, pointIndex:number) => (
                            <div key={pointIndex + "_" + point.variable} className="child">
                                <p>Variable: {point.variable}</p>
                                <textarea 
                                    defaultValue={point.analysis_yielded}
                                    onChange={(e) => {
                                        let newData = [...props.data];
                                        newData[idx].points[pointIndex].analysis_yielded = e.target.value;
                                        props.setData(newData);
                                        // point.analysis_yielded = e.target.value;
                                    }}>   
                                </textarea>
                                <div>
                                    <button onClick={ (e) => deletePoint(item.time, pointIndex)} disabled={props.disabled}>
                                        delete key_point
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            
            <br></br>
            
            <button onClick={(e) => {
                    printData(props.data);
                    props.setRenderArticle(true);
                }}
                disabled={props.disabled}>
                Generate Article
            </button>
                
            </div>                
    )
}

export default UserInput;
