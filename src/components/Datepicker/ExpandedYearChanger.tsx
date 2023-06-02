import { getYearSelections } from "../../utils/date";
import { TWS } from "../../utils/tailwinds";
import { consumeDateReducer } from "./dateReducer";
import { ReactComponent as ArrowLeft } from "../../assets/arrow_left.svg";
import { ReactComponent as ArrowRight } from "../../assets/arrow_right.svg";
import { isSameYear, isThisYear } from "date-fns";

export const ExpandedYearChanger = consumeDateReducer(
  ({ selectedYearNum, selectedYear, dispatch }) => (
    <>
      <div className="flex justify-between mt-7">
        <button onClick={() => dispatch({ type: "PrevYear" })}>
          <ArrowLeft />
        </button>
        <button onClick={() => dispatch({ type: "OpenYearSelection" })}>
          {selectedYearNum}
        </button>
        <button onClick={() => dispatch({ type: "NextYear" })}>
          <ArrowRight />
        </button>
      </div>
      <div className="grid  grid-cols-4 grid-flow-row gap-x-3 gap-y-6 pt-6 ml-2">
        {getYearSelections(selectedYearNum).map((year) => (
          <button
            className={
              TWS("text-center group")
                .addHover("bg-white ")
                .addWhen(isThisYear(new Date(year, 1, 1)), "bg-selectedBlue")
                .addWhen(
                  isSameYear(selectedYear, new Date(year, 1, 1)) &&
                    !isThisYear(new Date(year, 2, 2)),
                  "bg-white text-dark"
                ).className
            }
            onClick={() => dispatch({ type: "UpdateYear", year })}
          >
            <span className="group-hover:text-dark">{year}</span>
          </button>
        ))}
      </div>
    </>
  )
);
