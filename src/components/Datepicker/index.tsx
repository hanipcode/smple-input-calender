import { createEffect } from "../../utils/applyReducer";
import { DatePopup } from "./DatePopup";
import { applyDateReducer } from "./dateReducer";
import { CalendarView } from "./CalendarView";
import { MonthChanger } from "./MonthChanger";
import { DatePickerInput } from "./DatePickerInput";
import { ExpandedYearChanger } from "./ExpandedYearChanger";

type DatePickerProps = {
  placeholder: string;
};

export const Datepicker = applyDateReducer<DatePickerProps>(
  ({
    selectedMonthShort,
    isYearSelectionOpen,
    isPopupOpen,
    popupRef,
    dispatch,
  }) => (
    <div>
      <DatePickerInput />
      {isPopupOpen && (
        <DatePopup ref={popupRef}>
          <p>Select Date</p>
          <h1 className=" text-[32px] font-bold">{selectedMonthShort}</h1>

          {isYearSelectionOpen ? (
            <ExpandedYearChanger />
          ) : (
            <>
              <MonthChanger />
              <CalendarView />
            </>
          )}
          <div className="w-100 flex justify-end mt-6">
            <div className=" w-32 mr-4 flex justify-between">
              <button onClick={() => dispatch({ type: "ClosePopup" })}>
                Cancel
              </button>
              <button onClick={() => dispatch({ type: "ConfirmDate" })}>
                Ok
              </button>
            </div>
          </div>
        </DatePopup>
      )}
    </div>
  ),
  [
    createEffect(
      ({ state, dispatch }) => {
        const { popupRef } = state;
        const handleClick = (e: MouseEvent) => {
          if (
            popupRef.current &&
            !popupRef.current.contains(e.target as Node)
          ) {
            dispatch({ type: "ClosePopup" });
          }
        };
        document.addEventListener("mousedown", handleClick);
        return () => {
          document.removeEventListener("mousedown", handleClick);
        };
      },
      () => []
    ),
  ]
);
