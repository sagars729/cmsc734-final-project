import React from 'react';
import { BsArrowsAngleContract } from 'react-icons/bs';
import { BsArrowsAngleExpand } from 'react-icons/bs';


import './KeyPointsList.css';

const KeyPointsList = (props : any) => {

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];

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

    function dateOrdinal(date:any) {
        if (date > 3 && date < 21) return 'th';
        switch (date % 10) {
          case 1:  return "st";
          case 2:  return "nd";
          case 3:  return "rd";
          default: return "th";
        }
    }

    function convertTime(time:any) {
        var date = new Date(time)
        var userTimezoneOffset = date.getTimezoneOffset() * 60000;
        var d = new Date(date.getTime() + userTimezoneOffset);

        let str = "" + monthNames[d.getMonth()] + " " + d.getDate() + dateOrdinal(d.getDate()) + ", " + d.getFullYear();        
        return str;
    }

    const expandKP = () => {
        props.setExpandKeyPoints(true);
    }

    const collapseKP = () => {
        props.setExpandKeyPoints(false);
    }
    
    // the keypoints function is not adding to the overall data
    return (
        <div className="centered">
            { !props.isKeyPointsExpanded ? (
                <BsArrowsAngleExpand className="top-right" onClick={() => expandKP()}/>
            ) : (
                <BsArrowsAngleContract className="top-right" onClick={() => collapseKP()} />
            )}
            <h1> Key Points </h1>

<div className="container">
    {props.data.map( (item:any, idx:number) =>
        <div className="row">
            <div className="col-lg">
                <div className="card card-margin">
                    <div className="card-header no-border">
                        <h5 className="card-title">{convertTime(item.time)}</h5>
                    </div>

                    {item.points.map( (point:any, pointIdx:number) => (
                        <div className="card-body pt-0">
                            <div className="widget-49">
                                <div className="widget-49-title-wrapper">
                                    
                                    <div className="widget-49-meeting-info">
                                        <span className="widget-49-pro-title">Variable: {point.variable}</span>
                                    </div>
                                </div>
                                <ol className="widget-49-meeting-points">
                                    <div className="form-outline">
                                        <textarea className="form-control" value={point.analysis_yielded}
                                        onChange={(e) => {
                                            let newData = [...props.data];
                                            newData[idx].points[pointIdx].analysis_yielded = e.target.value;
                                            props.setData(newData);
                                            // point.analysis_yielded = e.target.value;
                                        }}>

                                        </textarea>
                                    </div>
                                </ol>
                                <div className="widget-49-meeting-action">
                                    <button
                                    onClick={ (e) => deletePoint(item.time, pointIdx)} disabled={props.disabled}
                                    >
                                        Delete Key Point
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    )}
</div>

            
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

export default KeyPointsList;