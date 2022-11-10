import React, { useState } from "react";
import "./App.css";
import LineChart from "./components/LineChart/LineChart";
import KeyPointsList from "./components/KeyPointsList/KeyPointsList";
import { data_processing } from './data';

let originalKeyPointsJson =  [
  {
  "time": "2020-01-22",
  "points": [
     {
        "variable":"cases",
        "analysis_yielded":"absolute maximum"
     }
  ]
  },
  {
  "time": "2021-04-14",
  "points":[
     {
        "variable":"cases",
        "analysis_yielded":"absolute minimum"
     }
  ]
  },
  {
    "time": "2022-04-15",
    "points":[
       {
          "variable":"cases",
          "analysis_yielded":"absolute saddle point"
       }
    ]
}]

const emptyData = [
  {
    time: "1111-11-11",
    points: [
      {
        variable: "",
        analysis_yielded: "",
      },
    ],
  },
];



const process_data = async (file: any) => {
  return await data_processing(file);
};

const App = () => {
  const [uploadedCsvBool, setUploadedCsvBool] = useState(true);
  const [keyPointsData, setKeyPointsData] = useState(emptyData);
  const [dataCSV, setDataCSV] = useState();
  const [generalChartInfo, setChartInfo] = useState({
    title: "COVID CASES IN THE US 2020- 2021",
    "x-axis": "Time Frame",
    "y-axis": "Cases (in thousands)",
    date_format: "%Y-%m-%d",
  });

  const changeHandler = (event: any) => {
    process_data(event.target.files[0]).then(function (result) {
      console.log(result);
      setDataCSV(event.target.files[0]);
      setKeyPointsData(result);
      setUploadedCsvBool(false);
    });
  };

  const addKeyPoint = (time:string, attribute:string) => {
    let newData = [...keyPointsData];
  
    var jsonPoints = [{ "variable": attribute, "point_value": "" + 1, "analysis_yielded": "<input>"}]
    var jsonObj = { "time": time, "points": jsonPoints};
  
    newData.push(jsonObj);
    // newData.sort( (a, b) => a.time.localeCompare(b.time));
            
  
    newData.sort((a,b) => {
        return new Date(a.time).getTime() - 
            new Date(b.time).getTime()
    });
  
    setKeyPointsData(newData);
  }

  return (
    <div className="container">
      <input
        type="file"
        name="file"
        accept=".csv"
        onChange={changeHandler}
        style={{ display: "block", margin: "10px auto" }}
      />
      <div className="row">
        <div className="col-md-6 borderStyle">
          <KeyPointsList
            data={keyPointsData}
            setData={setKeyPointsData}
            addKeyPoints={addKeyPoint}
            disabled={uploadedCsvBool}
          />
        </div>
        {/* <div className="m-2"></div> */}
        <div className="col-md-6 borderStyle">
          <LineChart
            csv={dataCSV}
            keyPoints={keyPointsData}
            general={generalChartInfo}
            addKeyPoints={addKeyPoint}
            setData={setKeyPointsData}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
