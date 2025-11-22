import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home/HomePage";
import OperatorMap from "./Operator/OperatorMapPage";
import OperatorSys from "./Operator/OperatorSystemPage";
import OperatorCam from "./Operator/OperatorCameraPage";
import OperatorSens from "./Operator/OperatorSensoryPage";
import PassengerMap from "./Passenger/PassengerMapPage";
import PassengerSys from "./Passenger/PassengerSystemPage";
import PassengerCam from "./Passenger/PassengerCameraPage";
import PassengerSens from "./Passenger/PassengerSensoryPage";
import SponsorMap from "./Sponsor/SponsorMapPage";
import SponsorSys from "./Sponsor/SponsorSystemPage";
import SponsorCam from "./Sponsor/SponsorCameraPage";
import SponsorSens from "./Sponsor/SponsorSensoryPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/operatorMap" element={<OperatorMap />} />
        <Route path="/operatorSys" element={<OperatorSys />} />
        <Route path="/operatorSens" element={<OperatorSens />} />
        <Route path="/operatorCam" element={<OperatorCam />} />
        <Route path="/passengerMap" element={<PassengerMap />} />
        <Route path="/passengerSys" element={<PassengerSys />} />
        <Route path="/passengerSens" element={<PassengerSens />} />
        <Route path="/passengerCam" element={<PassengerCam />} />
        <Route path="/sponsorMap" element={<SponsorMap />} />
        <Route path="/sponsorSys" element={<SponsorSys />} />
        <Route path="/sponsorSens" element={<SponsorSens />} />
        <Route path="/sponsorCam" element={<SponsorCam />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
