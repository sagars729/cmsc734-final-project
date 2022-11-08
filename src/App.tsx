import React, { Component, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import LineChart from "./components/LineChart/LineChart";
import UserEditPage from "./components/UserEditPage/UserEditPage";
import KeyPointsList from "./components/KeyPointsList/KeyPointsList";

const originalKeyPointsJson =  [
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
        "variable": "",
        "analysis_yielded": ""
      }
    ]
  }
]

const App = () => {
  const [uploadedCsvBool, setUploadedCsvBool] = useState(true);
  const [keyPointsData, setKeyPointsData] = useState( emptyData );
  const [dataCSV, setDataCSV] = useState();

  const changeHandler = (event: any) => {
    // this.state.data = event.target.files[0];
    // console.log(this.state.data);
    setDataCSV( event.target.files[0] );
    setKeyPointsData(originalKeyPointsJson);
    setUploadedCsvBool(false);
  };

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
            <KeyPointsList data={keyPointsData} setData={setKeyPointsData} disabled={uploadedCsvBool}/>
          </div>
          {/* <div className="m-2"></div> */}
          <div className="col-md-6 borderStyle">
            <LineChart data={dataCSV} keyPoints={keyPointsData} setData={setKeyPointsData} />
          </div>
        </div>
      </div>
    );
  }


export default App;
