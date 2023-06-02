import { Datepicker } from "./components/Datepicker";
import { PasswordInput } from "./components/PasswordInput";

function App() {
  return (
    <div className="bg-dark h-screen w-full p-5 ">
      {/* <PasswordInput label="Password" /> */}
      <Datepicker placeholder="Birthday" />
    </div>
  );
}

export default App;
