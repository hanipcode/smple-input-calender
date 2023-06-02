import { InputLabel } from "../InputLabel";

type InputContainerProps = React.PropsWithChildren<{
  label: string;
}>;
export const InputContainer = ({ children, label }: InputContainerProps) => (
  <div className="border-white-op border-[3px] h-[58px] w-[335px] rounded-lg relative hover:border-white hover:focus-within:border-blue-primary focus-within:border-blue-primary">
    <InputLabel label={label} />
    {children}
  </div>
);
