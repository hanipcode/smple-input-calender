import { getCalendarDayRows } from "../../utils/date";
import { consumeDateReducer } from "./dateReducer";
import { DayRow } from "./DayRow";
import { DateRow } from "./DateRow";

export const CalendarView = consumeDateReducer(
  ({ selectedMonthNum, selectedYearNum }) => (
    <div>
      <DayRow />
      {getCalendarDayRows(selectedMonthNum, selectedYearNum, 7, 6).map(
        (dates) => (
          <DateRow dates={dates} />
        )
      )}
    </div>
  )
);
