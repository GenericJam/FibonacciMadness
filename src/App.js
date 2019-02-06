import React, { Component } from "react";

import "./App.css";
import Container from "./components/Container";

// Specify number of cells (columns) and rows here
class App extends Component {
  render() {
    return (
      <div className="App">
        <Container rows={50} cells={50} style={{ margin: "auto" }} />
      </div>
    );
  }
}

export default App;
