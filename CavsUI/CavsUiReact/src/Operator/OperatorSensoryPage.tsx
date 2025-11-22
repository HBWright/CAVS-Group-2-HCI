import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import styles from "../components/ProfilePageButtons.module.css";
import shapes from "./OperatorShapes.module.css";

function OperatorSens() {
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
        className={styles.ProfileButtonSys}
        onClick={() => navigate("/operatorSys")}
      ></button>
      <button
        className={styles.ProfileButtonCam}
        onClick={() => navigate("/operatorCam")}
      ></button>
      <button
        className={`${styles.ProfileButtonSens} 
      ${styles.ButtonActive}`}
      ></button>
      <div className={shapes.OperatorBanner}>Sensory Data</div>
      <div className={shapes.OperatorSpd}>mph</div>
      <div className={shapes.OperatorSensBox1}></div>
      <div className={shapes.OperatorSensBox2}></div>
      <div className={shapes.OperatorSensBox3}></div>
      <div className={shapes.OperatorSensBox4}></div>
      <div className={shapes.OperatorSenBox1Title}></div>
      <div className={shapes.OperatorSenBox2Title}></div>
      <div className={shapes.OperatorSenBox3Title}></div>
      <div className={shapes.OperatorSenBox4Title}></div>
    </div>
  );
}
export default OperatorSens;
