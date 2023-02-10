import "react-big-calendar/lib/css/react-big-calendar.css";
import Dashboard from "./component/Dashboard";
import { Route, Routes } from 'react-router-dom';
import Oauth from "./component/Oauth";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/oauth2/redirect" element={<Oauth />} />
      </Routes>
    </>
  );
}

export default App;
