import { getDate, isSameMonth, isToday } from "date-fns";
import { consumeDateReducer } from "./dateReducer";
import { TWS } from "../../utils/tailwinds";

type DateRowProps = { dates: readonly Date[] };

const overlayClass = (
  isSelected: boolean,
  isToday: boolean,
  isSameMonth: boolean
) =>
  TWS("absolute h-[36px] w-[36px] top-[-5.5px] left-[-7.5px] rounded-full")
    .addWhen(isSelected, "bg-selectedBlue")
    .addWhen(isToday, "border-selectedBlue border")
    .addVariants("group-hover", "bg-white z-10");

export const DateRow = consumeDateReducer<DateRowProps>(
  ({ dates, selectedMonth, dispatch, isSelected }) => (
    <div className="flex gap-5 mb-3 ">
      {dates.map((date) => (
        <button
          onClick={() => dispatch({ type: "UpdateDate", date })}
          className={
            TWS("flex-1 grow text-center relative group").addWhen(
              !isSameMonth(selectedMonth, date),
              "opacity-50"
            ).className
          }
        >
          <div
            className={
              overlayClass(
                isSelected(date),
                isToday(date),
                isSameMonth(selectedMonth, date)
              ).className
            }
          ></div>
          <span className={TWS("relative group-hover:text-dark").className}>
            {getDate(date)}
          </span>
        </button>
      ))}
    </div>
  )
);
