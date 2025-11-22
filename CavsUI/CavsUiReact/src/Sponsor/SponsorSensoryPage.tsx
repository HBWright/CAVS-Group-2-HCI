import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import styles from "../components/ProfilePageButtons.module.css";
import shapes from "./SponsorShapes.module.css";

function SponsorSens() {
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
        onClick={() => navigate("/SponsorMap")}
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
        className={`${styles.ProfileButtonSens} 
      ${styles.ButtonActive}`}
      ></button>
      <div className={shapes.SponsorBanner}>Sensory Data</div>
      <div className={shapes.SponsorSpd}>mph</div>
      <div className={shapes.SponsorSensBox1}></div>
      <div className={shapes.SponsorSensBox2}></div>
      <div className={shapes.SponsorSensBox3}></div>
      <div className={shapes.SponsorSensBox4}></div>
      <div className={shapes.SponsorSenBox1Title}></div>
      <div className={shapes.SponsorSenBox2Title}></div>
      <div className={shapes.SponsorSenBox3Title}></div>
      <div className={shapes.SponsorSenBox4Title}></div>
      /* display current date, string improves appearance */
      <div className={shapes.SponsorDateText}>
        <p>{currentDate.toLocaleString()}</p>
      </div>
    </div>
  );
}
export default SponsorSens;
