import { S } from "@mobily/ts-belt";
export const mapDatePartsToValue = (parts: Intl.DateTimeFormatPart[]) =>
  parts.map((v) => v.value);

export const cleanDateParts = (parts: Intl.DateTimeFormatPart[]) =>
  parts.filter((v) => !S.isEmpty(v.value.replaceAll(/\s/gim, "")));

export const toHoverClass = (className: string) =>
  className
    .split(" ")
    .map((s) => `hover:${s}`)
    .join(" ");
