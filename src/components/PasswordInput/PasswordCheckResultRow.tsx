import { ReactComponent as CheckOutline } from "../../assets/check_outline.svg";
import { ReactComponent as CheckmarkCircle } from "../../assets/check.svg";

type PasswordCheckResultRowProps = {
  isChecked: boolean;
  text: string;
};
export const PasswordCheckResultRow = ({
  isChecked,
  text,
}: PasswordCheckResultRowProps) => (
  <div className="flex gap-3 items-center">
    <div className="relative top-[1px]">
      {isChecked ? (
        <CheckmarkCircle className=" ml-[2px] mr-[2px]" />
      ) : (
        <CheckOutline />
      )}
    </div>
    <div className="text-white">{text}</div>
  </div>
);
