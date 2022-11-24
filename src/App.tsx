import React, { useState } from "react";
import "./App.css";
import LineChart from "./components/LineChart/LineChart";
import KeyPointsList from "./components/KeyPointsList/KeyPointsList";
import { data_processing } from './data';
import ArticleContainer from "./components/Article/ArticleContainer"
import {DSVRowArray} from 'd3-dsv';
import AttrSelection from "./components/AttrSelection/AttrSelection";

const emptyData = [
  {
    time: "2022-11-11",
    points: [
      {
        variable: "a",
        analysis_yielded: "1",
        point_value: 0,
      },
      {
        variable: "b",
        analysis_yielded: "2",
        point_value: 0,
      },
    ],
  },
  {
    time: "2022-05-11",
    points: [
      {
        variable: "a2",
        analysis_yielded: "1",
        point_value: 0,
      },
    ],
  },
];



const process_data = async (file: any, selectedColumns:any) => {
  return await data_processing(file, selectedColumns);
};


const App = () => {
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [showAttrSelection, setShowAttrSelection] = useState(false);
  const [uploadedCsvBool, setUploadedCsvBool] = useState(true);
  const [isLoadedInt, setIsLoadedInt] = useState(0);
  const [keyPointsData, setKeyPointsData] = useState(emptyData);
  const [dataCSV, setDataCSV] = useState();

  const [generalChartInfo, setChartInfo] = useState({
    title: "COVID CASES IN THE US 2020- 2021",
    "x-axis": "Time Frame",
    "y-axis": "Cases (in thousands)",
    date_format: "%Y-%m-%d",
  });
  const [renderArticle, setRenderArticle] = useState<boolean>(false);
  const [pointsData, setPointsData] = useState<DSVRowArray | null>(null);

  const changeHandler = (event: any) => {
    if (dataCSV != event.target.files[0]) {
      setSelectedColumns([]);
      setDataCSV(event.target.files[0]);
      setShowAttrSelection(true);
    }
    
  };

  const btnProcessData = () => {
    setShowAttrSelection(false);
    process_data(dataCSV, selectedColumns).then(function (result) {
      setKeyPointsData(result);

      setIsLoadedInt(1);
      setUploadedCsvBool(false);
    });
  }

  const addKeyPoint = (time:string, attribute:string, attrValue:number) => {
    let newData = [...keyPointsData];
  
    var jsonPoints = [{ "variable": attribute, "point_value": attrValue, "analysis_yielded": "<input>"}]
    var jsonObj = { "time": time, "points": jsonPoints};
  
    newData.push(jsonObj);  
    newData.sort((a,b) => {
        return new Date(a.time).getTime() - 
            new Date(b.time).getTime()
    });
  
    setKeyPointsData(newData);
  }

  return (
    <div className="container">
      {!renderArticle  || !pointsData ? (
        <div id="author-view">
          <input
            type="file"
            name="file"
            accept=".csv"
            onChange={changeHandler}
            style={{ display: "block", margin: "10px auto" }}
          />


          <div className="row">
            <div className="col-md-6 borderStyle">
            { showAttrSelection && dataCSV ? (
              <AttrSelection 
              show={showAttrSelection} 
              setSelectedColumns={setSelectedColumns}
              selectedColumns={selectedColumns}
              csv={dataCSV}
              btnProcessData={btnProcessData}
              />

            ) : (
              <KeyPointsList
              data={keyPointsData}
              setData={setKeyPointsData}
              addKeyPoints={addKeyPoint}
              disabled={uploadedCsvBool}
              setRenderArticle={setRenderArticle}
            />
            )}

            </div>
            {/* <div className="m-2"></div> */}
            <div className="col-md-6 borderStyle">
              <LineChart
                csv={dataCSV}
                showAttrSelection={showAttrSelection}
                keyPoints={keyPointsData}
                general={generalChartInfo}
                isLoadedInt={isLoadedInt}
                setIsLoadedInt={setIsLoadedInt}
                addKeyPoints={addKeyPoint}
                setData={setKeyPointsData}
                setPointsData={setPointsData}
              />
            </div>
          </div>
        </div>
      ) : (
        <ArticleContainer
          data={pointsData}
          keyPoints={keyPointsData}
          setRenderArticle={setRenderArticle}
        />
      )}
    </div>
  );
};

export default App;
