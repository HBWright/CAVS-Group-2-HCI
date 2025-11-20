import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home/HomePage";
import OperatorMap from "./Operator/OperatorMapPage";
import OperatorSys from "./Operator/OperatorSystemPage";
import OperatorCam from "./Operator/OperatorCameraPage";
import OperatorSens from "./Operator/OperatorSensoryPage";
import Passenger from "./Passenger/PassengerPage";
import Sponsor from "./Sponsor/SponsorPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/operatorMap" element={<OperatorMap />} />
        <Route path="/operatorSys" element={<OperatorSys />} />
        <Route path="/operatorSens" element={<OperatorSens />} />
        <Route path="/operatorCam" element={<OperatorCam />} />
        <Route path="/passenger" element={<Passenger />} />
        <Route path="/sponsor" element={<Sponsor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
