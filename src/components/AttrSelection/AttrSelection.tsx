import React, { useState, useEffect } from "react";
import Papa from "papaparse";

// import "./AttrSelection.css";

const AttrSelection = (props:any) => {
    const [columnHeaders, setColumnHeaders] = useState<string[]>();
    const [firstRow, setFirstRow] = useState<any>();
    

    // let columnHeaders: any = ["a"];
    
    useEffect(() => {

        if (props.selectedColumns.length > 0 && columnHeaders?.length && columnHeaders.length > 0) {
            return;
        }
        if (props.csv && props.show) {
            //read csv and display checkboxs
            console.log("about to display columns");
            Papa.parse(props.csv, {
                header: true,
                skipEmptyLines: true,
                dynamicTyping: true,
            complete: function (results) {
                // columnHeaders = results.meta['fields'];
                
                //add time to selected columns

                let col = results.meta['fields'];
                const data = results.data;
                // console.log(data.at(1));
                setFirstRow(data[1]);
                setColumnHeaders( results.meta['fields']);
                
                let newSelections = [...props.selectedColumns];
                if (col && (col?.indexOf("Date") > -1 || col?.indexOf("date") > -1)) {
                    let idx = -1;

                    if (col?.indexOf("Date") > -1) {
                        idx = col?.indexOf("Date")
                    } 

                    if (col?.indexOf("date") > -1) {
                        idx = col?.indexOf("date");
                    }

                    newSelections.push(col[idx]);
                    props.setSelectedColumns(newSelections);
                }

            }
            })
        } else {
            if (columnHeaders && columnHeaders?.length > 0) {
                setColumnHeaders([]);
            }
            
        }
    }, [props, columnHeaders]);

    const handleOnChange = (item:any, position:any) => {
        let newSelections = [...props.selectedColumns];


        if (newSelections.indexOf(item) > -1) {
            //remove row
            var index = newSelections.indexOf(item);
            newSelections.splice(index);
        } else {

            if (newSelections.length > 2) {
                return;
            }

            newSelections.push(item);
        }

        props.setSelectedColumns(newSelections);
    };

    const smoothOnChange = () => {
        props.setSmoothData(!props.smoothData);
    }

    function returnColType(item:any) {
        // let idx = columnHeaders?.indexOf(item);
        return typeof(firstRow[item]);
    }

    function isNumerical(item:any) {
        //disable non numerical data selection
        if (typeof(firstRow[item]) == "number") {
            return true;
        } else {
            return false;
        }
    } 


    return (
        <div className="centered">
            <h1> Attribute Selection </h1>
            <p>Please note that only upto 2 numerical data attributes can be selected, and the "Date"/"Time" column is always needed</p>
            <p> --- </p>
            <ul className="attrSelectionList">

           
                {columnHeaders?.map((item:any, index:any) => {
                    return (
                        
                        <div key={index}>
                           <input
                                type="checkbox"
                                id={`custom-checkbox-${index}`}
                                checked={props.selectedColumns.indexOf(item) > -1}
                                disabled={!isNumerical(item)}
                                onChange={() => {handleOnChange(item, index);}}
                            />
                            <label htmlFor={`custom-checkbox-${index}`}>{item} ({returnColType(item)})</label>
                        </div>
                    )
                })}
                
                <p>-----</p>
                
                <input type="checkbox"
                id={`custom-checkbox-smooth`} 
                checked={props.smoothData}
                onChange={() => {smoothOnChange()}}>
                </input>
                <label htmlFor={`custom-checkbox-smooth`}>Smooth Data?</label>
            </ul>


            <button onClick={(e) => {
                    props.btnProcessData();
                }}
                disabled={(props.selectedColumns.length < 2)}>
                Submit Attributes
            </button>
        </div>
    )
}

export default AttrSelection;
//({returnColType(item)})
