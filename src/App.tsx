import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Dashboard from "./component/Dashboard";

function App() {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Dashboard />
      </LocalizationProvider>
    </>
  );
}

export default App;
