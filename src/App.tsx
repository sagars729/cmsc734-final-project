import React, { useState } from "react";
import "./App.css";
import LineChart from "./components/LineChart/LineChart";
import KeyPointsList from "./components/KeyPointsList/KeyPointsList";
import { DSVRowArray } from "d3-dsv";
import { data_processing } from "./data";
import ArticleContainer from "./components/Article/ArticleContainer";
import AttrSelection from "./components/AttrSelection/AttrSelection";

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

const process_data = async (file: any, selectedColumns: any) => {
  return await data_processing(file, selectedColumns);
};

const App = () => {
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [showAttrSelection, setShowAttrSelection] = useState(false);
  const [uploadedCsvBool, setUploadedCsvBool] = useState(true);
  const [isLoadedInt, setIsLoadedInt] = useState(0);
  const [keyPointsData, setKeyPointsData] = useState(emptyData);
  const [dataCSV, setDataCSV] = useState();
  const [focus, setFocusChange] = useState(selectedColumns[1]);
  const [generalChartInfo, setChartInfo] = useState({
    date_format: "%Y-%m-%d",
  });
  const [chartTitle, setTitle] = useState("");

  const [renderArticle, setRenderArticle] = useState<boolean>(false);
  const [pointsData, setPointsData] = useState<DSVRowArray | null>(null);

  const changeHandler = (event: any) => {
    if (dataCSV != event.target.files[0]) {
      setSelectedColumns([]);
      setTitle(event.target.files[0].name.split(".")[0]);
      setDataCSV(event.target.files[0]);
      setShowAttrSelection(true);
    }
  };

  const btnProcessData = () => {
    setShowAttrSelection(false);
    // console.log("btn proccess - selectedColumns = " + selectedColumns)
    process_data(dataCSV, selectedColumns).then(function (result) {
      // console.log(result);
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
    if (focus == selectedColumns[1])
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
  const getYAxis = () => {
    return (
      (selectedColumns[1] ? selectedColumns[1] : "") +
      (selectedColumns[2] ? " / " : "") +
      (selectedColumns[2] ? selectedColumns[2] : "")
    );
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
                  {selectedColumns.slice(1).map((col) => (
                    <option value={col} key={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p style={{ fontFamily: "cursive", fontWeight: "bold" }}>
                  {chartTitle}
                </p>
              </div>
              <div style={{ display: "flex" }}>
                <p>
                  <b>X-axis:</b> {selectedColumns[0]}
                </p>
                <span style={{ margin: "5px" }}></span>
                <p>
                  <b>Y-axis:</b>
                  {getYAxis()}
                </p>
              </div>
            </div>
          </span>

          <div className="row">
            <div className="col-md-6 borderStyle">
              {showAttrSelection && dataCSV ? (
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
                variable={selectedColumns}
                focusVar={focus}
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
