import React, { Component } from "react";
import "./App.css";
import * as d3 from "d3";
import SampleDataset from "./SampleDataset.csv";
import Child1 from "./Child1";
import Child2 from "./Child2";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    var self = this;
    d3.csv(SampleDataset, function (d) {
      return {
        x: d.x,
        y: d.y,
        category: d.category
      }
    }).then(function (csv_data) {
      self.setState({ data: csv_data });
      // console.log(csv_data);
    })
      .catch(function (err) {
        console.log(err);
      });
  }

  render() {
    return <div className="parent">
      <div className="container">
        <div className="child1">
          <Child1 data={this.state.data} />
        </div>
        <div className="child2">
          <Child2 data={this.state.data} />
        </div>
      </div>
    </div>;
  }
}

export default App;