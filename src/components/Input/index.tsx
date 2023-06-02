import { ChangeEvent, SyntheticEvent } from "react";

type InputProps = {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  value?: string | number;
  type?: React.HTMLInputTypeAttribute;
  className?: string;
  placeholder?: string;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
};
const baseStyle = "bg-transparent text-white w-full h-full px-4 outline-none";
export const Input = ({
  type,
  value,
  onChange,
  className,
  placeholder,
  onFocus,
  onBlur,
}: InputProps) => (
  <input
    type={type ?? "text"}
    value={value}
    onChange={onChange}
    className={className ? `${baseStyle} ${className}` : baseStyle}
    onFocus={onFocus}
    onBlur={onBlur}
    placeholder={placeholder ?? "Insert text..."}
  />
);
