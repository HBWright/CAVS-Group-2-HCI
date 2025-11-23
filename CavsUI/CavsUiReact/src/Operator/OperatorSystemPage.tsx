import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import styles from "../components/ProfilePageButtons.module.css";
import shapes from "./OperatorShapes.module.css";

function OperatorSys() {
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
        onClick={() => navigate("/operatorMap")}
      ></button>
      <button
        className={`${styles.ProfileButtonSys}
        ${styles.ButtonActive}`}
      ></button>
      <button
        className={styles.ProfileButtonCam}
        onClick={() => navigate("/operatorCam")}
      ></button>
      <button
        className={styles.ProfileButtonSens}
        onClick={() => navigate("/operatorSens")}
      ></button>
      <div className={shapes.OperatorBanner}>System Status</div>
      <div className={shapes.OperatorSpd}>mph</div>
      <div className={shapes.OperatorSysBoxPlan}>Mapping & Planning</div>
      <div className={shapes.OperatorSysBoxCrtl}>Control</div>
      <div className={shapes.OperatorSysBoxPerc}>Perception</div>
      <div className={shapes.OperatorDateText}>
        <p>{currentDate.toLocaleString()}</p>
      </div>
    </div>
  );
}
export default OperatorSys;
