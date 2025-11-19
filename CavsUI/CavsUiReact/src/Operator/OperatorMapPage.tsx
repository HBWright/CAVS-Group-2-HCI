import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import styles from "./OperatorPageButtons.module.css";
import shapes from "./OperatorMapStyle.module.css";

function Operator() {
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
        onClick={() => navigate("/")}
      ></button>
      <button
        className={styles.OperatorButtonSys}
        onClick={() => navigate("/")}
      ></button>
      <button
        className={styles.OperatorButtonCam}
        onClick={() => navigate("/")}
      ></button>
      <button
        className={styles.OperatorButtonSens}
        onClick={() => navigate("/")}
      ></button>
      <div className={shapes.OperatorBanner}></div>
      <div className={shapes.OperatorSubBanner}></div>
      <div className={shapes.OperatorBox1}></div>
      <div className={shapes.OperatorSubBox2}></div>
      <div className={shapes.OperatorBox3}></div>
      <div className={shapes.OperatorSpeed}></div>
    </div>
  );
}
export default Operator;
