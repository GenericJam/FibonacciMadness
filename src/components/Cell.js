import React, { Component } from "react";
// All of the potential colors for the cell borders
const borderColors = [
  "#80FF00",
  "#88EE11",
  "#90DD22",
  "#98CC33",
  "#A0BB44",
  "#A8AA55",
  "#B09966",
  "#B88877",
  "#C07788",
  "#C86699",
  "#D055AA",
  "#D844BB",
  "#E033CC",
  "#E822DD",
  "#F011EE",
  "#F800FF"
];
// This is a cell which displays the state of the cell in the grid
export default class Cell extends Component {
  clicked = () => {
    const { cellCallback, x, y } = this.props;
    cellCallback(x, y);
  };
  render() {
    const {
      width,
      height,
      value,
      color,
      borderIndex = value > 15 ? 15 : value
    } = this.props;
    return (
      <span
        onClick={this.clicked}
        style={{
          width: width - 5,
          height: height - 5,
          background: color || "white",
          float: "left",
          borderWidth: 2,
          borderColor: borderColors[borderIndex] || "#000",
          borderStyle: "dashed",
          zIndex: 0
        }}
      >
        <p style={{ zIndex: 99, margin: "auto", marginTop: 5 }}>{value || 0}</p>
      </span>
    );
  }
}
