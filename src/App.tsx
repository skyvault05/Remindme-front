import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";

import "react-big-calendar/lib/css/react-big-calendar.css";
import CalendarApp from "./Calendar";

const localizer = momentLocalizer(moment);
const drawerWidth = 345;

function App() {
  return (
    <div className="App">
      <CalendarApp />
    </div>
  );
}

export default App;
