import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import styles from "../components/ProfilePageButtons.module.css";
import shapes from "./SponsorShapes.module.css";

function SponsorMap() {
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
        className={`${styles.ProfileButtonMap} 
      ${styles.ButtonActive}`}
      ></button>
      <button
        className={styles.ProfileButtonSys}
        onClick={() => navigate("/SponsorSys")}
      ></button>
      <button
        className={styles.ProfileButtonCam}
        onClick={() => navigate("/SponsorCam")}
      ></button>
      <button
        className={styles.ProfileButtonSens}
        onClick={() => navigate("/SponsorSens")}
      ></button>
      <div className={shapes.SponsorBanner}>Sponsor</div>
      <div className={shapes.SponsorBoxDiag}>System Diagnostics</div>
      <div className={shapes.SponsorDiagText}>LIDAR Camera GPS</div>
      <div className={shapes.SponsorBoxGPS}></div>
      <div className={shapes.SponsorBoxCam}></div>
      <div className={shapes.SponsorBoxPath}></div>
      <div className={shapes.SponsorSpd}>mph</div>
      /* display current date, string improves appearance */
      <div className={shapes.SponsorDateText}>
        <p>{currentDate.toLocaleString()}</p>
      </div>
    </div>
  );
}
export default SponsorMap;
