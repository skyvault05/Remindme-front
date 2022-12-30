import moment from "moment";
import { momentLocalizer } from "react-big-calendar";

import "react-big-calendar/lib/css/react-big-calendar.css";
import CalendarApp from "./Calendar";

const localizer = momentLocalizer(moment);
const drawerWidth = 345;

function App() {
  return <CalendarApp />;
}

export default App;
