import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import styles from "../components/ProfilePageButtons.module.css";
import shapes from "./OperatorShapes.module.css";

function OperatorCam() {
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
        onClick={() => navigate("/OperatorMap")}
      ></button>
      <button
        className={styles.ProfileButtonSys}
        onClick={() => navigate("/OperatorSys")}
      ></button>
      <button
        className={`${styles.ProfileButtonCam} 
      ${styles.ButtonActive}`}
      ></button>
      <button
        className={styles.ProfileButtonSens}
        onClick={() => navigate("/OperatorSens")}
      ></button>
      <div className={shapes.OperatorBanner}>Camera</div>
      <div className={shapes.OperatorSpd}>mph</div>
      <div className={shapes.OperatorCamBoxDiag}>System Diagnostics</div>
      <div className={shapes.OperatorCamDiagText}>LIDAR Camera GPS</div>
      <div className={shapes.OperatorBoxCamFront}></div>
      <div className={shapes.OperatorBoxCam2}></div>
      <div className={shapes.OperatorDateText}>
        <p>{currentDate.toLocaleString()}</p>
      </div>
    </div>
  );
}
export default OperatorCam;
