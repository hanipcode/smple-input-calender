import { pipe, A } from "@mobily/ts-belt";

const convertToVariants = (p: string) => (s: string) => `${p}:${s}`;
const convertToHover = (s: string) => convertToVariants("hover")(s);

type BooleanFN = (s: string) => boolean;

const _add = (str: string, appended: string) => `${str} ${appended}`;
const _remove = (str: string, removedWords: string) =>
  str
    .split(" ")
    .filter((c) => !removedWords.split(" ").includes(c as string))
    .join(" ");
const when =
  (condition: boolean | BooleanFN) =>
  (fn: typeof _add | typeof _remove) =>
  (str: string, appended: string) => {
    if (typeof condition === "function" && condition(str)) {
      return fn(str, appended);
    }
    if (condition) {
      return fn(str, appended);
    }
    return str;
  };

const unless = (condition: boolean | BooleanFN) =>
  typeof condition === "function"
    ? when((...args) => !condition(...args))
    : when(condition);

const ifElse =
  (condition: boolean | BooleanFN) =>
  (fn: typeof _add | typeof _remove) =>
  (str: string, appended1: string, appended2: string) => {
    if (typeof condition === "function" && condition(str)) {
      return fn(str, appended1);
    }
    if (condition) {
      return fn(str, appended1);
    }
    return fn(str, appended2);
  };

const _wordMap =
  (map: ReturnType<typeof convertToVariants>) =>
  (str: string, delimiter: string = " ") =>
    str.split(delimiter).map(map).join(delimiter);

class TWSClass {
  constructor(className: string) {
    this._className = className;
    return this;
  }
  private _className: string = "";
  public get className(): string {
    return this._className;
  }
  private set className(className: string) {
    this._className = className;
  }

  add(className: string) {
    this.className = _add(this.className, className);
    return this;
  }
  addIfElse(
    condition: boolean | BooleanFN,
    classNameRight: string,
    classNameLeft: string
  ) {
    this.className = ifElse(condition)(_add)(
      this.className,
      classNameLeft,
      classNameRight
    );
    return this;
  }
  addUnless(condition: boolean | BooleanFN, className: string) {
    this.className = unless(condition)(_add)(this.className, className);
  }
  addWhen(condition: boolean | BooleanFN, className: string) {
    this.className = when(condition)(_add)(this.className, className);
    return this;
  }
  remove(className: string) {
    this.className = _remove(this.className, className);
    return this;
  }
  removeUnless(condition: boolean | BooleanFN, className: string) {
    this.className = unless(condition)(_remove)(this.className, className);
  }
  removeWhen(condition: boolean | BooleanFN, className: string) {
    this.className = when(condition)(_remove)(this.className, className);
    return this;
  }
  addHover(className: string) {
    return this.add(_wordMap(convertToHover)(className));
  }
  addHoverWhen(condition: boolean | BooleanFN, className: string) {
    return this.addWhen(condition, _wordMap(convertToHover)(className));
  }
  addHoverUnless(condition: boolean | BooleanFN, className: string) {
    return this.addUnless(condition, _wordMap(convertToHover)(className));
  }
  removeHover(className: string) {
    return this.remove(_wordMap(convertToHover)(className));
  }

  removeHoverWhen(condition: boolean | BooleanFN, className: string) {
    return this.removeWhen(condition, _wordMap(convertToHover)(className));
  }
  removeHoverUnless(condition: boolean | BooleanFN, className: string) {
    return this.removeUnless(condition, _wordMap(convertToHover)(className));
  }

  addVariants(variants: string, className: string) {
    return this.add(_wordMap(convertToVariants(variants))(className));
  }

  removeVariants(variants: string, className: string) {
    return this.remove(_wordMap(convertToVariants(variants))(className));
  }

  addVariantsWhen(
    condition: boolean | BooleanFN,
    variants: string,
    className: string
  ) {
    return this.addWhen(
      condition,
      _wordMap(convertToVariants(variants))(className)
    );
  }

  removeVariantsWhen(
    condition: boolean | BooleanFN,
    variants: string,
    className: string
  ) {
    return this.removeWhen(
      condition,
      _wordMap(convertToVariants(variants))(className)
    );
  }
}

export const TWS = (className: string) => new TWSClass(className);
