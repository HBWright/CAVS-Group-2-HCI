import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import styles from "../components/ProfilePageButtons.module.css";
import shapes from "./PassengerShapes.module.css";

function PassengerSens() {
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
        className={styles.ProfileButtonCam}
        onClick={() => navigate("/PassengerCam")}
      ></button>
      <button
        className={`${styles.ProfileButtonSens} 
      ${styles.ButtonActive}`}
      ></button>
      <div className={shapes.PassengerBanner}>Sensory Data</div>
      <div className={shapes.PassengerSpd}>mph</div>
      <div className={shapes.PassengerSensBox1}></div>
      <div className={shapes.PassengerSensBox2}></div>
      <div className={shapes.PassengerSensBox3}></div>
      <div className={shapes.PassengerSensBox4}></div>
      <div className={shapes.PassengerSenBox1Title}></div>
      <div className={shapes.PassengerSenBox2Title}></div>
      <div className={shapes.PassengerSenBox3Title}></div>
      <div className={shapes.PassengerSenBox4Title}></div>
    </div>
  );
}
export default PassengerSens;
