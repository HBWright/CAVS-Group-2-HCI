import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import styles from "../components/ProfilePageButtons.module.css";
import shapes from "./PassengerShapes.module.css";

function PassengerMap() {
  // Time Grabber
  const [currentDate, setCurrentDate] = useState(new Date());
  // Time Updater
  useEffect(() => {
    setInterval(() => setCurrentDate(new Date()), 1000);
  }, []);
  // Navigation Helper
  const navigate = useNavigate();
  return (
    /* Buttons */
    <div className={styles.ProfilePageContainer}>
      <button
        className={styles.ProfileButtonHome}
        onClick={() => navigate("/")}
      ></button>
      <button
        className={`${styles.ProfileButtonMap} 
      ${styles.ButtonActive}`}
      ></button>
      <button
        className={styles.ProfileButtonSys}
        onClick={() => navigate("/PassengerSys")}
      ></button>
      <button
        className={styles.ProfileButtonCam}
        onClick={() => navigate("/PassengerCam")}
      ></button>
      <button
        className={styles.ProfileButtonSens}
        onClick={() => navigate("/PassengerSens")}
      ></button>
      <div className={shapes.PassengerBanner}>Passenger</div>
      <div className={shapes.PassengerBoxDiag}>System Diagnostics</div>
      <div className={shapes.PassengerDiagText}>LIDAR Camera GPS</div>
      <div className={shapes.PassengerBoxGPS}></div>
      <div className={shapes.PassengerBoxCam}></div>
      <div className={shapes.PassengerBoxPath}></div>
      <div className={shapes.PassengerSpd}>mph</div>
      <div className={shapes.PassengerDateText}>
        <p>{currentDate.toLocaleString()}</p>
      </div>
    </div>
  );
}
export default PassengerMap;
