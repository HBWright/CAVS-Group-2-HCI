import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import styles from "../components/ProfilePageButtons.module.css";
import shapes from "./OperatorShapes.module.css";

function OperatorMap() {
  // Time Grabber
  const [currentDate, setCurrentDate] = useState(new Date());
  // Time Updater
  useEffect(() => {
    setInterval(() => setCurrentDate(new Date()), 1000);
  }, []);
  // Navigation Helper
  const navigate = useNavigate();
  return (
    /* Buttons For Page navigation */
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
        onClick={() => navigate("/operatorSys")}
      ></button>
      <button
        className={styles.ProfileButtonCam}
        onClick={() => navigate("/operatorCam")}
      ></button>
      <button
        className={styles.ProfileButtonSens}
        onClick={() => navigate("/operatorSens")}
      ></button>
      <div className={shapes.OperatorBanner}>Operator</div>
      <div className={shapes.OperatorBoxDiag}>System Diagnostics</div>
      <div className={shapes.OperatorDiagText}>LIDAR Camera GPS</div>
      <div className={shapes.OperatorBoxGPS}></div>
      <div className={shapes.OperatorBoxCam}></div>
      <div className={shapes.OperatorBoxPath}></div>
      <div className={shapes.OperatorSpd}>mph</div>
      <div className={shapes.OperatorDateText}>
        <p>{currentDate.toLocaleString()}</p>
      </div>
    </div>
  );
}
export default OperatorMap;
