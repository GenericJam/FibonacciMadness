import React, { Component } from "react";
import Cell from "./Cell";

export default class Row extends Component {
  render() {
    let { cells, rowCellData, rowCellColors } = this.props;
    const allCells = [...Array(cells).keys()].map((i, ikey) => {
      return (
        <Cell
          {...this.props}
          x={i}
          value={rowCellData[i]}
          color={rowCellColors[i]}
          key={ikey}
        />
      );
    });
    return <div style={{ float: "left" }}>{allCells}</div>;
  }
}
