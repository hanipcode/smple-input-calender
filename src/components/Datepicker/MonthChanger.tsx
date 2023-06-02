import { ReactComponent as ArrowLeft } from "../../assets/arrow_left.svg";
import { ReactComponent as ArrowRight } from "../../assets/arrow_right.svg";
import { consumeDateReducer } from "./dateReducer";

export const MonthChanger = consumeDateReducer(
  ({ selectedMonthLong, dispatch }) => (
    <div className="flex justify-between mt-7">
      <button onClick={() => dispatch({ type: "PrevMonth" })}>
        <ArrowLeft />
      </button>
      <button onClick={() => dispatch({ type: "OpenYearSelection" })}>
        {selectedMonthLong}
      </button>
      <button onClick={() => dispatch({ type: "NextMonth" })}>
        <ArrowRight />
      </button>
    </div>
  )
);
