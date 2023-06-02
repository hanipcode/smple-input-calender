import { PasswordCheckResultType, checkPassword } from "../../utils/password";
import { P, match } from "ts-pattern";
import { createApplyReducer } from "../../utils/applyReducer";
import { InputContainer } from "../InputContainer";
import { PasswordCheckResult } from "./PasswordCheckResult";
import { Input } from "../Input";

type PasswordState = {
  password: string;
};
type PasswordEventType = { type: "Update"; text: string } | { type: "Clear" };

type PasswordProps = {
  label: string;
};
const passwordReducer = (
  state: PasswordState,
  event: PasswordEventType
): PasswordState =>
  match([state, event])
    .with([P._, { type: "Update" }], ([_, e]) => {
      return {
        password: e.text,
      };
    })
    .otherwise(() => state);

export const applyPasswordReducer = createApplyReducer<
  PasswordState,
  PasswordEventType
>(passwordReducer, {
  password: "",
});

export const PasswordInput = applyPasswordReducer<PasswordProps>(
  ({ label, dispatch, password }) => (
    <InputContainer label={label}>
      <Input
        type="password"
        value={password}
        onChange={(e) => dispatch({ type: "Update", text: e.target.value })}
        className="bg-transparent text-white w-full h-full px-4 outline-none"
        placeholder="Password..."
      />
      {password.length > 0 && (
        <PasswordCheckResult
          result={checkPassword(password) as PasswordCheckResultType}
        />
      )}
    </InputContainer>
  )
);
