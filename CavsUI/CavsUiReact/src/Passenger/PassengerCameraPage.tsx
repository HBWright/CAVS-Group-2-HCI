import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import styles from "../components/ProfilePageButtons.module.css";
import shapes from "./PassengerShapes.module.css";

function PassengerCam() {
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
        className={styles.ProfileButtonMap}
        onClick={() => navigate("/PassengerMap")}
      ></button>
      <button
        className={styles.ProfileButtonSys}
        onClick={() => navigate("/PassengerSys")}
      ></button>
      <button
        className={`${styles.ProfileButtonCam} 
      ${styles.ButtonActive}`}
      ></button>
      <button
        className={styles.ProfileButtonSens}
        onClick={() => navigate("/PassengerSens")}
      ></button>
      <div className={shapes.PassengerBanner}>Camera</div>
      <div className={shapes.PassengerSpd}>mph</div>
      <div className={shapes.PassengerCamBoxDiag}>System Diagnostics</div>
      <div className={shapes.PassengerCamDiagText}>LIDAR Camera GPS</div>
      <div className={shapes.PassengerBoxCamFront}></div>
      <div className={shapes.PassengerBoxCam2}></div>
      <div className={shapes.PassengerDateText}>
        <p>{currentDate.toLocaleString()}</p>
      </div>
    </div>
  );
}
export default PassengerCam;
