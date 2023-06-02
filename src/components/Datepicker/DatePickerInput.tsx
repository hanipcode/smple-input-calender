import { format } from "date-fns";
import { Input } from "../Input";
import { InputContainer } from "../InputContainer";
import { consumeDateReducer } from "./dateReducer";

export const DatePickerInput = consumeDateReducer(({ dispatch, value }) => (
  <InputContainer label="Birthday">
    <Input
      type="text"
      placeholder="mm/dd/yyyy"
      value={value ? format(value, "MM/dd/yyyy") : undefined}
      onFocus={() => dispatch({ type: "OpenPopup" })}
    />
  </InputContainer>
));
