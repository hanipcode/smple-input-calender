import { Datepicker } from "./components/Datepicker";
import { PasswordInput } from "./components/PasswordInput";

function App() {
  return (
    <div className="bg-dark h-screen w-full p-5 flex">
      <div className="flex-1">
        <PasswordInput label="Password" />
      </div>
      <div className="flex-1">
        <Datepicker placeholder="Birthday" />
      </div>
    </div>
  );
}

export default App;
