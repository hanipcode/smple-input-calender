import { R, D, pipe } from "@mobily/ts-belt";
const ERR_PASSWORD_NULL = "password cannot be null" as const;

type PasswordValidatorFunc = (password: string) => boolean;
const hasUpperCase: PasswordValidatorFunc = (password) =>
  /[A-Z]/.test(password) ? true : false;

const hasLowerCase: PasswordValidatorFunc = (password) =>
  /[a-z]/.test(password) ? true : false;

const hasNumber: PasswordValidatorFunc = (password) =>
  /[0-9]/.test(password) ? true : false;

const hasSpecialCharacter: PasswordValidatorFunc = (password) =>
  /[^\w\s\"\'\\\/]/.test(password) ? true : false;

type isLongerFunc = (length: number) => PasswordValidatorFunc;
const isLonger: isLongerFunc = (length) => (password) =>
  password.length >= length;

const isLongerThan8 = isLonger(8);

type checkers =
  | "hasUpperCase"
  | "hasLowerCase"
  | "hasNumber"
  | "hasSpecialCharacter"
  | "isLongerThan8";
type PasswordCheckersType = Record<checkers, PasswordValidatorFunc>;
const passwordCheckers: PasswordCheckersType = {
  hasUpperCase,
  hasLowerCase,
  hasNumber,
  hasSpecialCharacter,
  isLongerThan8,
};

export type PasswordCheckResultType = Record<checkers, boolean>;
type PasswordCheckFn = (password: string) => PasswordCheckResultType | null;
const checkPassword: PasswordCheckFn = (password: string) =>
  pipe(
    R.fromNullable(password, ERR_PASSWORD_NULL),
    R.flatMap((password) =>
      R.Ok(D.map(passwordCheckers, (validator) => validator(password)))
    ),
    R.toNullable
  );

const validatorLabels: Record<checkers, string> = {
  hasLowerCase: "Have at least one lowercase letter",
  hasUpperCase: "Have at least one uppercase letter",
  hasNumber: "Have at least one number",
  hasSpecialCharacter: "Have at least one special character (!@#$...etc)",
  isLongerThan8: "Longer than 8 characters",
};
export { checkPassword, validatorLabels };
