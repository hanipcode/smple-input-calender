import {
  addMonths,
  addYears,
  getMonth,
  getYear,
  isSameDay,
  isSameMonth,
  isValid,
  subMonths,
  subYears,
} from "date-fns";
import { getMonthParts } from "../../utils/date";
import { match, P } from "ts-pattern";
import { A, pipe, B } from "@mobily/ts-belt";
import { createApplyContextReducer } from "../../utils/applyReducer";
import { cleanDateParts, mapDatePartsToValue } from "../../utils/helpers";
import { createRef } from "react";

type DateState = {
  selectedDate: Date;
  selectedMonth: Date;
  selectedYear: Date;
  value: Date | null;
  isPopupOpen: boolean;
  isYearSelectionOpen: boolean;
  popupRef: React.RefObject<HTMLDivElement>;
};

type DateEvent =
  | { type: "ConfirmDate" }
  | { type: "UpdateDate"; date: Date }
  | { type: "UpdateYear"; year: number }
  | { type: "NextMonth" }
  | { type: "PrevMonth" }
  | { type: "NextYear" }
  | { type: "PrevYear" }
  | { type: "OpenPopup" }
  | { type: "ClosePopup" }
  | { type: "OpenYearSelection" }
  | { type: "CloseYearSelection" };

const dateReducer = (state: DateState, event: DateEvent): DateState =>
  match([state, event])
    .with(
      [
        P._,
        { type: "UpdateDate", date: P.select(P.when((date) => isValid(date))) },
      ],
      (date) => ({
        ...state,
        selectedDate: date,
        selectedMonth: date,
      })
    )
    .with(
      [P._, { type: "UpdateYear", year: P.select(P.number) }],
      (selectedYear, [state]) => ({
        ...state,
        selectedYear: new Date(selectedYear, state.selectedMonth.getMonth(), 1),
        selectedMonth: new Date(
          selectedYear,
          state.selectedMonth.getMonth(),
          1
        ),
        isYearSelectionOpen: false,
      })
    )
    .with([P._, { type: "NextMonth" }], () => ({
      ...state,
      selectedMonth: addMonths(state.selectedMonth, 1),
    }))
    .with([P._, { type: "PrevMonth" }], () => ({
      ...state,
      selectedMonth: subMonths(state.selectedMonth, 1),
    }))
    .with([P._, { type: "NextYear" }], () => ({
      ...state,
      selectedYear: addYears(state.selectedYear, 1),
    }))
    .with([P._, { type: "PrevYear" }], () => ({
      ...state,
      selectedYear: subYears(state.selectedYear, 1),
    }))
    .with([P.select(), { type: "OpenPopup" }], (state) => ({
      ...state,
      isPopupOpen: true,
    }))
    .with([P.select(), { type: "ClosePopup" }], (state) => ({
      ...state,
      isPopupOpen: false,
    }))
    .with([P.select(), { type: "OpenYearSelection" }], (state) => ({
      ...state,
      isYearSelectionOpen: true,
    }))
    .with([P.select(), { type: "CloseYearSelection" }], (state) => ({
      ...state,
      isYearSelectionOpen: false,
    }))
    .with([P.select(), { type: "ConfirmDate" }], (state) => ({
      ...state,
      value: state.selectedDate,
      isPopupOpen: false,
    }))
    .otherwise(() => state);

type DateSelectorReturn = ReturnType<typeof dateSelectors>;
const dateSelectors = ({
  selectedMonth,
  selectedDate,
  selectedYear,
}: DateState) => ({
  selectedMonthShort: pipe(
    getMonthParts(selectedMonth, "short"),
    cleanDateParts,
    mapDatePartsToValue,
    A.join(", ")
  ),
  selectedMonthLong: pipe(
    getMonthParts(selectedMonth, "long"),
    cleanDateParts,
    mapDatePartsToValue,
    A.join(" ")
  ),
  selectedMonthNum: getMonth(selectedMonth),
  selectedYearNum: getYear(selectedYear),
  isSelected: (date: Date) =>
    pipe(
      isSameDay(selectedDate, date),
      B.and(isSameMonth(date, selectedMonth))
    ),
});

export const [applyDateReducer, consumeDateReducer] = createApplyContextReducer<
  DateState,
  DateEvent,
  DateSelectorReturn
>(
  dateReducer,
  {
    selectedDate: new Date(),
    selectedMonth: new Date(),
    selectedYear: new Date(),
    isPopupOpen: false,
    value: null,
    popupRef: createRef(),
    isYearSelectionOpen: false,
  },
  dateSelectors
);
