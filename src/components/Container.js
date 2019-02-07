import React, { Component } from "react";
import { Container as Con, Row as Ro, Col } from "react-grid-system";
import Image from "react-image-resizer";
import Row from "./Row";

// This is the title image
// Fibonacci
// Wayne Brady
// Tina Fey
const images = [
  "https://images.spot.im/v1/production/q9nlvxjl3zpyftj1xofo",
  "https://media1.tenor.com/images/05a7505c225710ad1b77bc4caf7cd0bf/tenor.gif?itemid=5502996",
  "https://i.imgur.com/Bjj4yWC.gif"
];

const colors = { yellow: "#ff0", white: "#fff", green: "#080" };

export default class Container extends Component {
  componentWillMount() {
    this.setState({
      // This is the array holding all of the cell values
      cellData: this.initCells(),
      // This is the array holding all of the cell colors
      cellColors: this.initColors(),
      // Global flag whether there is currently a Fibonacci match
      isFib: false,
      automated: false,
      fibSeq: this.genFib(0, 1, 100),
      dirty: false
    });
  }

  render() {
    const { rows, cells } = this.props;
    const cellDimension = window.innerWidth / cells;
    const { cellData, cellColors, isFib } = this.state;
    const allCells = [...Array(rows).keys()].map((i, ikey) => {
      const start = i * cells;
      const end = start + cells;
      return (
        <Row
          {...this.props}
          width={cellDimension}
          height={cellDimension}
          // This gets called when a cell value changes
          cellCallback={this.cellCallback}
          // What row this is on
          y={i}
          // key for performance
          key={ikey}
          // All the data for this row
          rowCellData={cellData.slice(start, end)}
          // All the colors for this row
          rowCellColors={cellColors.slice(start, end)}
        />
      );
    });
    return (
      <div>
        {/* The header */}
        <Con>
          <Ro>
            <Col md={4}>
              <Image
                src={images[isFib ? Math.round(Math.random()) + 1 : 0]}
                alt="Fibonacci"
                height={(35 / 59) * (window.innerWidth / 3)}
                width={window.innerWidth / 3}
              />
            </Col>
            <Col md={8}>
              <h1
                style={{
                  alignSelf: "stretch",
                  textAlign: "center",
                  marginTop: 100
                }}
              >
                Welcome to the Fibonacci Generator!
              </h1>
              <h3 style={{ alignSelf: "stretch", textAlign: "center" }}>
                Click around and try to generate some Fibonacci sequences.
              </h3>

              <form>
                <label>
                  Automate:
                  <input
                    name="automated"
                    type="checkbox"
                    checked={this.state.automated}
                    onChange={this.handleCheckbox}
                  />
                </label>
              </form>
            </Col>
          </Ro>
        </Con>
        {/* All the rows are inserted here */}
        {allCells}
      </div>
    );
  }

  // Checkbox is altered
  handleCheckbox = e => {
    const automated = e.target.value;
    this.setState({
      automated
    });
    this.autoClick(1000, true);
  };

  // This gets called when the value changes in a cell
  cellCallback = (x, y) => {
    this.bumpCell(x, y);
  };

  // Just for automated testing
  autoClick = (delay, start) => {
    const { rows, cells } = this.props;
    const { automated } = this.state;
    if (automated || start) {
      this.bumpCell(
        Math.floor(Math.random() * cells),
        Math.floor(Math.random() * rows)
      );
      setTimeout(() => {
        this.autoClick(delay, false);
      }, delay);
    }
  };

  // Disconnected from the click event for automated testing
  bumpCell(x, y) {
    this.setState({});
    let { cellData } = this.state;
    const { cells, rows } = this.props;

    this.setColors(x, y, colors.yellow);

    for (let i = 0; i < cells; i++) {
      const index = i + y * cells;
      cellData[index]++;
      this.fibCheck(i, y);
    }

    for (let i = 0; i < rows; i++) {
      const index = x + i * cells;
      // Don't increment twice
      if (i !== y) {
        cellData[index]++;
        this.fibCheck(x, i);
      }
    }
    // Put this back in if it causes problems
    // this.setState({ cellData });

    // Set the colors back
    setTimeout(() => {
      this.setColors(x, y, colors.white);
    }, 500);
  }

  // This sets colors for any color change
  setColors = (x, y, color) => {
    let { cellColors } = this.state;
    const { rows, cells } = this.props;

    for (let i = 0; i < cells; i++) {
      const index = i + y * cells;
      cellColors[index] = color;
    }
    for (let i = 0; i < rows; i++) {
      const index = x + i * cells;
      cellColors[index] = color;
    }
  };

  initCells = () => {
    const { rows, cells } = this.props;
    const cellData = new Array(rows * cells);
    return cellData.fill(0);
  };

  initColors = () => {
    const { rows, cells } = this.props;
    const cellColors = new Array(rows * cells);
    return cellColors.fill(colors.white);
  };

  // Check for Fibonacci Sequence
  // lastChecked is if it is being used recursively, don't check these coordinates
  fibCheck = (x, y) => {
    const { cells } = this.props;
    const center = this.cellInfo(x + y * cells, x, y);

    // Not part of fib sequence early out
    if (
      (center &&
        center.value !== this.genFib(0, 1, center.value).slice(-1)[0]) ||
      (center && center.value < 3)
    ) {
      return;
    }

    this.ascendFib(center);
  };

  // center is part of Fibanacci sequence go up the chain of sequence to find the highest value
  ascendFib = center => {
    if (!center) {
      return;
    }
    // Get adjacent cells
    const [up, down, left, right] = this.getAdjacent(center);
    [up, down, left, right].forEach(i => {
      if (!i) {
        return;
      }
      const centerPos = this.findMatch(center.value, 0);
      if (this.findMatch(i.value, 0) > centerPos) {
        return this.ascendFib(i);
      } else {
        if (centerPos >= 5) {
          this.descendFib([center]);
        }
      }
    });
  };

  // A Fibanacci sequence has been found and is delivered here
  fibFound = fibCells => {
    const { cells } = this.props;
    let { cellColors } = this.state;
    fibCells.forEach(cell => {
      const index = cell.x + cell.y * cells;

      cellColors[index] = colors.green;
    });

    this.setState({ isFib: true });

    setTimeout(() => {
      let { cellData, cellColors } = this.state;
      fibCells.forEach(cell => {
        const index = cell.x + cell.y * cells;

        cellColors[index] = colors.white;
        cellData[index] = 0;
      });
      this.setState({ isFib: false });
    }, 1000);
  };

  // After the highest value is found with ascendFib, descend to find the whole sequence
  descendFib = cells => {
    const center = cells.slice(-1)[0];
    // Get adjacent cells
    const [up, down, left, right] = this.getAdjacent(center);

    [up, down, left, right].forEach(i => {
      if (!i) {
        return false;
      }
      const centerPos = this.findMatch(center.value, 0);
      const candidatePos = this.findMatch(i.value, 0);
      // First case is generic case where these are consecutive member of the sequence
      if (centerPos - 1 === candidatePos) {
        const newCells = [...cells, i];
        this.descendFib(newCells);
      } else if (candidatePos === 1 && centerPos === 3) {
        // Special case of 0, 1, 1 as findMatch will return the first position
        const newCells = [...cells, i];
        this.descendFib(newCells);
      } else if (
        centerPos === 1 &&
        candidatePos === 1 &&
        cells.slice(-2)[0].value === 2
      ) {
        // Special case of 0, 1, 1, 2 as findMatch will return the first position
        const newCells = [...cells, i];
        this.descendFib(newCells);
      } else {
        if (cells.length >= 5) {
          this.fibFound(cells);
        }
      }
    });
  };

  getMax = ([up, down, left, right, center]) => {
    return Math.max(
      center.value,
      up ? up.value : 0,
      down ? down.value : 0,
      left ? left.value : 0,
      right ? right.value : 0
    );
  };
  // This gets all of the adjacent cells in relation to the center
  getAdjacent = center => {
    const { x, y } = center;
    const { cells } = this.props;
    const adjecents = [
      this.cellInfo(x + (y - 1) * cells, x, y - 1),
      this.cellInfo(x + (y + 1) * cells, x, y + 1),
      this.cellInfo(x - 1 + y * cells, x - 1, y),
      this.cellInfo(x + 1 + y * cells, x + 1, y)
    ];
    return adjecents;
  };
  // Recurse fibSeq and find a value
  findMatch = (value, position) => {
    const { fibSeq } = this.state;
    // Not a match if either met
    if (position > fibSeq.length) {
      return -2;
    }
    return value === fibSeq[position]
      ? position
      : this.findMatch(value, position + 1);
  };

  // This generates a Fibanacci sequence of any length
  genFib = (a, b, max) => {
    if (b < max) {
      return [a].concat(this.genFib(b, a + b, max));
    }
    return [a, b];
  };
  // This packages info for a cell during processing
  cellInfo = (index, x, y) => {
    const { rows, cells } = this.props;
    const { cellData } = this.state;
    if (index > 0 && index < rows * cells) {
      return { value: cellData[index], x: x, y: y };
    }
    return null;
  };
}
