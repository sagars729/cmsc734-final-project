import React, { useState } from "react";
import "./App.css";
import LineChart from "./components/LineChart/LineChart";
import KeyPointsList from "./components/KeyPointsList/KeyPointsList";
import { data_processing } from "./data";
// import Article from "./components/Article/Article";
import { DSVRowArray } from "d3-dsv";

let originalKeyPointsJson = [
  {
    time: "2020-01-22",
    points: [
      {
        variable: "cases",
        analysis_yielded: "absolute maximum",
      },
    ],
  },
  {
    time: "2021-04-14",
    points: [
      {
        variable: "cases",
        analysis_yielded: "absolute minimum",
      },
    ],
  },
  {
    time: "2022-04-15",
    points: [
      {
        variable: "cases",
        analysis_yielded: "absolute saddle point",
      },
    ],
  },
];

const emptyData = [
  {
    time: "1111-11-11",
    points: [
      {
        variable: "",
        analysis_yielded: "",
        point_value: 0,
      },
    ],
  },
];

const process_data = async (file: any) => {
  return await data_processing(file);
};

const App = () => {
  const [uploadedCsvBool, setUploadedCsvBool] = useState(true);
  const [isLoadedInt, setIsLoadedInt] = useState(0);
  const [keyPointsData, setKeyPointsData] = useState(emptyData);
  const [dataCSV, setDataCSV] = useState();
  const [variable, setVariable] = useState(["Date", "Cases", "Deaths"]);
  const [focus, setFocusChange] = useState(variable[1]);
  const [generalChartInfo, setChartInfo] = useState({
    title: "COVID CASES IN THE US 2020- 2021",
    "x-axis": "Time Frame",
    "y-axis": "Cases",
    date_format: "%Y-%m-%d",
  });
  const [renderArticle, setRenderArticle] = useState<boolean>(false);
  const [pointsData, setPointsData] = useState<DSVRowArray | null>(null);

  const changeHandler = (event: any) => {
    process_data(event.target.files[0]).then(function (result) {
      // console.log(result);
      setDataCSV(event.target.files[0]);
      setKeyPointsData(result);

      setIsLoadedInt(1);
      // TODO: call setPointsData() so the article has the most recent keypoints

      setUploadedCsvBool(false);
    });
  };
  const handleFocusChange = (e: any) => {
    setFocusChange(e.target.value);
  };
  const changeColor = (e: any) => {
    if (focus == variable[1])
      return { backgroundColor: "steelblue", color: "white" };
    else {
      return { backgroundColor: "pink", color: "black" };
    }
  };
  const addKeyPoint = (time: string, attribute: string, attrValue: number) => {
    let newData = [...keyPointsData];

    //todo: if everyone likes it, we can edit the timestamp to look like Oct. 20, 2022 (it looks better)

    var jsonPoints = [
      {
        variable: attribute,
        point_value: attrValue,
        analysis_yielded: "<input>",
      },
    ];
    var jsonObj = { time: time, points: jsonPoints };

    newData.push(jsonObj);
    // newData.sort( (a, b) => a.time.localeCompare(b.time));

    newData.sort((a, b) => {
      return new Date(a.time).getTime() - new Date(b.time).getTime();
    });

    setKeyPointsData(newData);

    // TODO: call setPointsData() so the article has the most recent keypoints
    // setPointsData(newData )
  };

  return (
    <div className="container">
      {!renderArticle || !pointsData ? (
        <div id="author-view">
          <input
            type="file"
            name="file"
            accept=".csv"
            onChange={changeHandler}
            style={{ display: "block", margin: "10px auto" }}
          />
          <span className="row">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                border: "solid",
                marginBottom: "5px",
                padding: "10px",
              }}
            >
              <div>
                <span style={{ fontWeight: "bold" }}>
                  <u>Focus and Legend</u>{" "}
                </span>
                <select onChange={handleFocusChange} style={changeColor(this)}>
                  {variable.slice(1).map((fruit) => (
                    <option value={fruit} key={fruit}>
                      {fruit}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p style={{ fontFamily: "cursive", fontWeight: "bold" }}>
                  {generalChartInfo.title}
                </p>
              </div>
              <div style={{ display: "flex" }}>
                <p>
                  <b>X-axis:</b> {generalChartInfo["x-axis"]}
                </p>
                <span style={{ margin: "5px" }}></span>
                <p>
                  <b>Y-axis:</b> {generalChartInfo["y-axis"]}
                </p>
              </div>
            </div>
          </span>
          <div className="row">
            <div className="col-md-6 borderStyle">
              <KeyPointsList
                data={keyPointsData}
                setData={setKeyPointsData}
                addKeyPoints={addKeyPoint}
                disabled={uploadedCsvBool}
                setRenderArticle={setRenderArticle}
              />
            </div>
            {/* <div className="m-2"></div> */}
            <div className="col-md-6 borderStyle">
              <LineChart
                csv={dataCSV}
                keyPoints={keyPointsData}
                general={generalChartInfo}
                isLoadedInt={isLoadedInt}
                variable={variable}
                focusVar={focus}
                setIsLoadedInt={setIsLoadedInt}
                addKeyPoints={addKeyPoint}
                setData={setKeyPointsData}
                setPointsData={setPointsData}
              />
            </div>
          </div>
        </div>
      ) : (
        // <Article
        //   data={pointsData}
        //   keyPoints={keyPointsData}
        //   title={"The Rise and Fall of Covid Cases in the United States"}
        //   byline={"CMSC734 Group Project"}
        //   date={"11-14-2022"}
        // />
        <span></span>
      )}
    </div>
  );
};

export default App;
