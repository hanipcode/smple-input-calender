import {
  addDays,
  getDaysInMonth as fnsGetDaysInMonth,
  getDay,
  getMonth,
  getYear,
  subDays,
} from "date-fns";
import { pipe, A } from "@mobily/ts-belt";

const createDateFormater = (options?: Intl.DateTimeFormatOptions) =>
  Intl.DateTimeFormat(navigator.language || "en-US", options);

export const getDaysInMonthArr = (month: number, year: number) =>
  Array.from(Array(fnsGetDaysInMonth(new Date(year, month, 1)))).map(
    (_, key) => new Date(year, month, key + 1)
  );

export const getCalendarDayRows = (
  month: number,
  year: number,
  colSize: number,
  rowSize: number
) =>
  pipe(
    getPrevMonthOffset(month, year, colSize),
    A.concat(getDaysInMonthArr(month, year)),
    A.concat(getNextMonthOffset(month, year, colSize)),
    A.splitEvery(colSize),
    (arr) =>
      arr.length < rowSize
        ? A.concat(arr, [
            Array.from(new Array(colSize)).map((_, i) =>
              addDays(arr[arr.length - 1][colSize - 1], i + 1)
            ),
          ])
        : arr
  );

type ValidMonthsType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
type MonthsMapType = Record<ValidMonthsType, string>;
export const getMonthsMap = (): MonthsMapType =>
  Array.from(Array(12)).reduce((prev, _, key) => {
    prev[key] = createDateFormater({ month: "long" }).format(
      new Date().setMonth(key)
    );
    return prev;
  }, {});

export const getPrevMonthOffset = (
  month: number,
  year: number,
  colSize: number
) =>
  pipe(
    new Date(year, month, 1),
    (date): [Date, number] => [date, getDay(date)],
    ([date, day]) => {
      return Array.from(Array(day === colSize ? 0 : day))
        .map((_, key) => subDays(date, key + 1))
        .reverse();
    }
  );

export const getNextMonthOffset = (
  month: number,
  year: number,
  colSize: number
) =>
  pipe(
    new Date(year, month, fnsGetDaysInMonth(new Date(year, month, 1))),
    (date): [Date, number] => [date, getDay(date)],
    ([date, day]) => {
      return Array.from(Array(colSize - (day + 1))).map((_, key) =>
        addDays(date, key + 1)
      );
    }
  );

export const getYearSelections = (
  start: number = new Date().getFullYear()
): number[] => Array.from(Array(20)).map((_, key) => start - 1 + key);

export const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const getMonthParts = (date: Date, type: "short" | "long" = "short") =>
  createDateFormater({ month: type, year: "numeric" }).formatToParts(date);
