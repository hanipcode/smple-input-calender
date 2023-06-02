import { PasswordCheckResultType, validatorLabels } from "../../utils/password";
import { D, pipe } from "@mobily/ts-belt";
import { PasswordCheckResultRow } from "./PasswordCheckResultRow";

type PasswordCheckResultProps = {
  result: PasswordCheckResultType;
};
export const PasswordCheckResult = ({ result }: PasswordCheckResultProps) => (
  <div className="bg-gray px-3 pb-4 pt-[15px] flex flex-col gap-[17px] rounded-lg relative top-[23px] shadow-passBox box-border text-sm">
    {pipe(
      result,
      D.mapWithKey((key, isChecked) => (
        <PasswordCheckResultRow
          text={validatorLabels[key]}
          isChecked={isChecked}
        />
      )),
      D.values
    )}
  </div>
);
