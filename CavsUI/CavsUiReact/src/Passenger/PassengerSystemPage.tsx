import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import styles from "../components/ProfilePageButtons.module.css";
import shapes from "./PassengerShapes.module.css";

function PassengerSys() {
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
        className={`${styles.ProfileButtonSys} 
      ${styles.ButtonActive}`}
      ></button>
      <button
        className={styles.ProfileButtonCam}
        onClick={() => navigate("/PassengerCam")}
      ></button>
      <button
        className={styles.ProfileButtonSens}
        onClick={() => navigate("/PassengerSens")}
      ></button>
      <div className={shapes.PassengerBanner}>System Status</div>
      <div className={shapes.PassengerSpd}>mph</div>
      <div className={shapes.PassengerSysBoxPlan}>Mapping & Planning</div>
      <div className={shapes.PassengerSysBoxCrtl}>Control</div>
      <div className={shapes.PassengerSysBoxPerc}>Perception</div>
      /* display current date, string improves appearance */
      <div className={shapes.PassengerDateText}>
        <p>{currentDate.toLocaleString()}</p>
      </div>
    </div>
  );
}
export default PassengerSys;
