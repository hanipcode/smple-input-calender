type LabelProps = { label: string };
export const InputLabel = ({ label }: LabelProps) => (
  <label className="text-white absolute -top-[6px] left-2 bg-dark px-[5px] text-xs">
    {label}
  </label>
);
