import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import styles from "./OperatorPageButtons.module.css";
import shapes from "./OperatorMapStyle.module.css";

function OperatorMap() {
  const navigate = useNavigate();
  return (
    /* Buttons */
    <div className={styles.OperatorPageContainer}>
      <button
        className={styles.OperatorButtonHome}
        onClick={() => navigate("/")}
      ></button>
      <button
        className={`${styles.OperatorButtonMap} 
      ${styles.ButtonActive}`}
      ></button>
      <button
        className={styles.OperatorButtonSys}
        onClick={() => navigate("/operatorSys")}
      ></button>
      <button
        className={styles.OperatorButtonCam}
        onClick={() => navigate("/operatorCam")}
      ></button>
      <button
        className={styles.OperatorButtonSens}
        onClick={() => navigate("/operatorSens")}
      ></button>
      <div className={shapes.OperatorBanner}>Operator</div>
      <div className={shapes.OperatorBoxDiag}>System Diagnostics</div>
      <div className={shapes.OperatorDiagText}>LIDAR Camera GPS</div>
      <div className={shapes.OperatorBoxGPS}></div>
      <div className={shapes.OperatorBoxCam}></div>
      <div className={shapes.OperatorBoxPath}></div>
      <div className={shapes.OperatorSpd}>mph</div>
    </div>
  );
}
export default OperatorMap;
