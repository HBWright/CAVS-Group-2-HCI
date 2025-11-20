import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import styles from "./OperatorPageButtons.module.css";
import shapes from "./OperatorMapStyle.module.css";

function OperatorSys() {
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
        className={`${styles.OperatorButtonSys}
        ${styles.ButtonActive}`}
      ></button>
      <button
        className={styles.OperatorButtonCam}
        onClick={() => navigate("/operatorCam")}
      ></button>
      <button
        className={styles.OperatorButtonSens}
        onClick={() => navigate("/operatorSens")}
      ></button>
      <div className={shapes.OperatorBanner}>System Status</div>
      <div className={shapes.OperatorSpd}>mph</div>
      <div className={shapes.OperatorSysBoxPlan}>Mapping & Planning</div>
      <div className={shapes.OperatorSysBoxCrtl}>Control</div>
      <div className={shapes.OperatorSysBoxPerc}>Perception</div>
    </div>
  );
}
export default OperatorSys;
