import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import LineChart from "./LineChart";
import UserEditPage from "./components/UserEditPage/UserEditPage";

class App extends Component {
  changeHandler = (event: any) => {
    // this.state.data = event.target.files[0];
    // console.log(this.state.data);
    this.setState({ data: event.target.files[0] });
  };

  state = {
    data: null,
  };
  render() {
    return (
      <div className="container">
        <div>
          <UserEditPage />
        </div>
        
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
