import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home/HomePage";
import Operator from "./Operator/OperatorMapPage";
import Passenger from "./Passenger/PassengerPage";
import Sponsor from "./Sponsor/SponsorPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/operator" element={<Operator />} />
        <Route path="/passenger" element={<Passenger />} />
        <Route path="/sponsor" element={<Sponsor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
