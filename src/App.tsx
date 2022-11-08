import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import LineChart from "./LineChart";

class App extends Component {
  changeHandler = (event: any) => {
    this.setState({
      data: {
        csv: event.target.files[0],
        general: {
          title: "COVID CASES IN THE US 2020- 2021",
          "x-axis": "Time Frame",
          "y-axis": "Cases (in thousands)",
        },
      },
    });
  };

  state = {
    data: null,
  };
  render() {
    return (
      <div className="container">
        <input
          type="file"
          name="file"
          accept=".csv"
          onChange={this.changeHandler}
          style={{ display: "block", margin: "10px auto" }}
        />
        <div className="row">
          <div className="col-md-6 borderStyle">#left content in here</div>
          {/* <div className="m-2"></div> */}
          <div className="col-md-6 borderStyle">
            <LineChart data={this.state.data} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
