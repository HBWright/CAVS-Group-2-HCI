import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import styles from "./OperatorPageButtons.module.css";
import shapes from "./OperatorMapStyle.module.css";

function OperatorSens() {
  const navigate = useNavigate();
  return (
    /* Buttons */
    <div className={styles.OperatorPageContainer}>
      <button
        className={styles.OperatorButtonHome}
        onClick={() => navigate("/")}
      ></button>
      <button
        className={styles.OperatorButtonMap}
        onClick={() => navigate("/operatorMap")}
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
        className={`${styles.OperatorButtonSens} 
      ${styles.ButtonActive}`}
      ></button>
      <div className={shapes.OperatorBanner}>Sensory Data</div>
    </div>
  );
}
export default OperatorSens;
