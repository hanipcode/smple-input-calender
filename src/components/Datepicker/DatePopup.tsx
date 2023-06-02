import { forwardRef } from "react";

export const DatePopup = forwardRef(
  ({ children }: React.PropsWithChildren, ref) => (
    <div
      ref={ref as React.Ref<any>}
      className="bg-darkPopup shadow-passBox box-border py-[17px] px-6 w-[320px] h-[469px] text-white font-inter rounded-lg mt-5"
    >
      {children}
    </div>
  )
);
