import React from "react";
import PropTypes from "prop-types";
import { range } from "../Utils/arrayUtils";
import EditedIkon from "./EditedIkon";

export function OptionGrid({
  id,
  columns,
  rows,
  options,
  isEdited,
  direction,
}) {
  if (direction === "vertical") {
    const numRows = rows || options.length;
    return (
      <div id={id}>
        {range(numRows).map((rowIndex) => (
          <div key={`row${rowIndex}`}>
            {options.filter(
              (option, optionIndex) => optionIndex % numRows === rowIndex
            )}
            {isEdited && <EditedIkon className="radioEdited" />}
          </div>
        ))}
      </div>
    );
  }
  const numColumns = columns || options.length;
  return (
    <div id={id}>
      {range(numColumns).map((columnIndex) => (
        <div key={`column${columnIndex}`}>
          {options.filter(
            (option, optionIndex) => optionIndex % numColumns === columnIndex
          )}
        </div>
      ))}
      {isEdited && <EditedIkon className="radioEdited" />}
    </div>
  );
}

OptionGrid.propTypes = {
  id: PropTypes.string,
  columns: PropTypes.number,
  options: PropTypes.arrayOf(PropTypes.element).isRequired,
  isEdited: PropTypes.bool,
  direction: PropTypes.string,
  rows: PropTypes.number,
};

OptionGrid.defaultProps = {
  id: undefined,
  columns: 0,
  rows: 0,
  isEdited: false,
  direction: "horizontal",
};

export default OptionGrid;
