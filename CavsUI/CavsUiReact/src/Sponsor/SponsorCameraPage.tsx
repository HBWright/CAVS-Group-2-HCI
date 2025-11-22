import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import styles from "../components/ProfilePageButtons.module.css";
import shapes from "./SponsorShapes.module.css";

function SponsorCam() {
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
        onClick={() => navigate("/SponsorMap")}
      ></button>
      <button
        className={styles.ProfileButtonSys}
        onClick={() => navigate("/SponsorSys")}
      ></button>
      <button
        className={`${styles.ProfileButtonCam} 
      ${styles.ButtonActive}`}
      ></button>
      <button
        className={styles.ProfileButtonSens}
        onClick={() => navigate("/SponsorSens")}
      ></button>
      <div className={shapes.SponsorBanner}>Camera</div>
      <div className={shapes.SponsorSpd}>mph</div>
      <div className={shapes.SponsorCamBoxDiag}>System Diagnostics</div>
      <div className={shapes.SponsorCamDiagText}>LIDAR Camera GPS</div>
      <div className={shapes.SponsorBoxCamFront}></div>
      <div className={shapes.SponsorBoxCam2}></div>
    </div>
  );
}
export default SponsorCam;