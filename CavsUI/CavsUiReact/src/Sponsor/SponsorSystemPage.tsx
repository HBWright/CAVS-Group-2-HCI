import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import styles from "../components/ProfilePageButtons.module.css";
import shapes from "./SponsorShapes.module.css";

function SponsorSys() {
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
        className={`${styles.ProfileButtonSys} 
      ${styles.ButtonActive}`}
      ></button>
      <button
        className={styles.ProfileButtonCam}
        onClick={() => navigate("/SponsorCam")}
      ></button>
      <button
        className={styles.ProfileButtonSens}
        onClick={() => navigate("/SponsorSens")}
      ></button>
      <div className={shapes.SponsorBanner}>System Status</div>
      <div className={shapes.SponsorSpd}>mph</div>
      <div className={shapes.SponsorSysBoxPlan}>Mapping & Planning</div>
      <div className={shapes.SponsorSysBoxCrtl}>Control</div>
      <div className={shapes.SponsorSysBoxPerc}>Perception</div>
      /* display current date, string improves appearance */
      <div className={shapes.SponsorDateText}>
        <p>{currentDate.toLocaleString()}</p>
      </div>
    </div>
  );
}
export default SponsorSys;
