import React, { useEffect, useState } from "react";
import "./App.css";
import LineChart from "./components/LineChart/LineChart";
import KeyPointsList from "./components/KeyPointsList/KeyPointsList";
import { DSVRowArray } from "d3-dsv";
import { data_processing } from "./data";
import ArticleContainer from "./components/Article/ArticleContainer";
import AttrSelection from "./components/AttrSelection/AttrSelection";
import { BsArrowsAngleContract, BsArrowsAngleExpand, BsFolderSymlinkFill } from "react-icons/bs";
import logo from "./logo2.png";

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

const process_data = async (file: any, selectedColumns: any, smoothData: boolean) => {
  return await data_processing(file, selectedColumns, smoothData);
};

const App = () => {
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [showAttrSelection, setShowAttrSelection] = useState(false);
  const [uploadedCsvBool, setUploadedCsvBool] = useState(true);
  const [isLoadedInt, setIsLoadedInt] = useState(0);
  const [keyPointsData, setKeyPointsData] = useState(emptyData);
  const [dataCSV, setDataCSV] = useState();
  const [focus, setFocusChange] = useState("");
  const [hoverData, setHoverData] = useState({ date: "", value: [] });
  const [resize, setResize] = useState("");
  const [chartTitle, setTitle] = useState("");
  const [renderArticle, setRenderArticle] = useState<boolean>(false);
  const [pointsData, setPointsData] = useState<DSVRowArray | null>(null);
  const [isKeyPointsExpanded, setExpandKeyPoints] = useState(false);
  const [isChartExpanded, setExpandChart] = useState(false);
  const [smoothData, setSmoothData] = useState(false);

  const halfPageClassName = "col-md-6 borderStyle nopadding";
  const fullPageClassName = "col-md-12 borderStyle nopadding";

  useEffect(() => {
    setFocusChange(selectedColumns[1]);
  }, [selectedColumns]); //and in the array tag the state you want to watch for

  useEffect(() => {
    setFocusChange(selectedColumns[1]);
  }, [selectedColumns]); //and in the array tag the state you want to watch for

  const changeHandler = (event: any) => {
    if (dataCSV !== event.target.files[0]) {
      setSelectedColumns([]);
      setTitle(event.target.files[0].name.split(".")[0]);
      setDataCSV(event.target.files[0]);
      setShowAttrSelection(true);
    }
  };

  const btnProcessData = () => {
    setShowAttrSelection(false);
    process_data(dataCSV, selectedColumns, smoothData).then(function (result) {
      // console.log(result);
      if (typeof result !== "undefined") {
        setKeyPointsData(result);
      } else {
        setKeyPointsData([]);
      }

      setIsLoadedInt(1);
      setUploadedCsvBool(false);
    });
  };

  const handleFocusChange = (e: any) => {
    setFocusChange(e.target.value);
  };
  const changeColor = (e: any) => {
    if (focus === selectedColumns[2])
      return { backgroundColor: "pink", color: "black" };
    else {
      return { backgroundColor: "steelblue", color: "white" };
    }
  };


  const addKeyPoint = (time: string, attribute: string, attrValue: number) => {
    let newData = [...keyPointsData];

    var jsonPoints = [
      {
        variable: attribute,
        point_value: attrValue,
        analysis_yielded: "<input>",
      },
    ];

    var jsonObj = { time: time, points: jsonPoints };
    newData.push(jsonObj);

    newData.sort((a, b) => {
      return new Date(a.time).getTime() - new Date(b.time).getTime();
    });

    setKeyPointsData(newData);
  };

  const getYAxis = () => {
    return (
      (selectedColumns[1] ? selectedColumns[1] : "") +
      (selectedColumns[2] ? " / " : "") +
      (selectedColumns[2] ? selectedColumns[2] : "")
    );
  };
  const expandChart = () => {
    setExpandChart(true);
  };

  const collapseChart = () => {
    setExpandChart(false);
  };

  return (
    <div className="container">
      {!renderArticle || !pointsData ? (
        <div id="author-view">
          <span className="row">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                border: "solid",
                marginBottom: "5px",
                marginTop: "5px",
                padding: "10px",
                alignItems: "center",
              }}
            >
              {/* <div
                style={{
                  display: "flex",
                }}
              >
                <div>
                  <img src={logo} width="50" height="50" />
                </div>
                <div
                  style={{
                    fontWeight: "bold",
                    fontFamily: "cursive",
                    fontSize: "35px",
                  }}
                >
                  <u>Time Series Authoring Tool</u>
                </div>
              </div> */}
              <div>
                <img src={logo} width="350" height="80" alt="Src not found" />
              </div>
              <div className="row">
                <div className="col-md-2 gDriveLink">


                  <a href="https://drive.google.com/drive/folders/1azW5IeEg1evdTRhOwkFievTKg6wO0sgn?usp=share_link" target="_blank" rel="noreferrer">
                    <BsFolderSymlinkFill
                    style={{marginTop: "50%",
                            marginLeft: "50%"}}
                    />
                  </a>

                </div>
                <div className="col-md-10">
                  <input
                    type="file"
                    name="file"
                    accept=".csv"
                    onChange={changeHandler}
                    style={{
                      display: "block",
                      margin: "10px auto",
                      border: "1.5px dotted black",
                      backgroundColor: "#eaf4f4",
                    }}
                    className="form-control"
                    id="formFile"
                  />
                </div>
                
              </div>
            </div>
          </span>
          {selectedColumns.length > 0 ? (
            <span className="row">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  paddingLeft: 0,
                  paddingRight: 0,
                }}
              >
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
                    <select
                      onChange={handleFocusChange}
                      style={changeColor(this)}
                    >
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
                  {hoverData.date ? (
                    <div>
                      <span>
                        <b>Date: </b> {hoverData.date}
                      </span>
                      <br />
                      <span>
                        <b>{selectedColumns[1]}: </b>
                        {hoverData.value[0]}
                      </span>
                      <br />
                      {selectedColumns[2] ? (
                        <span>
                          <b>{selectedColumns[2]}: </b>
                          {hoverData.value[1]}
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            </span>
          ) : null}
          <div className="row">
            <div
              className={
                isKeyPointsExpanded && !isChartExpanded
                  ? fullPageClassName
                  : halfPageClassName
              }
              hidden={isChartExpanded ? true : false}
            >
              {showAttrSelection && dataCSV ? (
                <AttrSelection
                  show={showAttrSelection}
                  setSelectedColumns={setSelectedColumns}
                  selectedColumns={selectedColumns}
                  csv={dataCSV}
                  btnProcessData={btnProcessData}
                  setSmoothData={setSmoothData}
                  smoothData={smoothData}
                />
              ) : (
                <KeyPointsList
                  data={keyPointsData}
                  setData={setKeyPointsData}
                  addKeyPoints={addKeyPoint}
                  disabled={uploadedCsvBool}
                  setRenderArticle={setRenderArticle}
                  isKeyPointsExpanded={isKeyPointsExpanded}
                  setExpandKeyPoints={setExpandKeyPoints}
                  isChartExpanded={isChartExpanded}
                />
              )}
            </div>
            {/* <div className="m-2"></div> */}
            <div
              className={
                !isKeyPointsExpanded && isChartExpanded
                  ? fullPageClassName
                  : halfPageClassName
              }
              hidden={isKeyPointsExpanded ? true : false}
            >
              {!isChartExpanded ? (
                <BsArrowsAngleExpand
                  className="top-right"
                  onClick={() => expandChart()}
                />
              ) : (
                <BsArrowsAngleContract
                  className="top-right"
                  onClick={() => collapseChart()}
                />
              )}
              <LineChart
                csv={dataCSV}
                showAttrSelection={showAttrSelection}
                keyPoints={keyPointsData}
                variable={selectedColumns}
                focusVar={focus}
                resize={resize}
                setResize={setResize}
                isLoadedInt={isLoadedInt}
                setIsLoadedInt={setIsLoadedInt}
                addKeyPoints={addKeyPoint}
                setData={setKeyPointsData}
                setHoverData={setHoverData}
                setPointsData={setPointsData}
                // isShowingAttrSelection={showAttrSelection}
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
