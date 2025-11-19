import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import styles from "./HomePageButtons.module.css";
import logo from "../assets/LogoCavsHome.png";

function Home() {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState("");
  const handleClick = (buttonName: string, path: string) => {
    setActiveButton(buttonName);
    navigate(path);
  };
  console.log("Styles object:", styles);

  return (
    <div className={styles.HomePageContainer}>
      <img src={logo} alt="CAVS Logo" className={styles.HomePageLogo}></img>
      <button
        className={`${styles.ButtonOperator}
        ${activeButton === "operator" ? styles.ButtonActive : ""}`}
        onClick={() => handleClick("operator", "/operator")}
      >
        Operator
      </button>
      <button
        className={`${styles.ButtonPassenger}
        ${activeButton === "passenger" ? styles.ButtonActive : ""}`}
        onClick={() => handleClick("passenger", "/passenger")}
      >
        Passenger
      </button>
      <button
        className={`${styles.ButtonSponsor}
        ${activeButton === "sponsor" ? styles.ButtonActive : ""}`}
        onClick={() => handleClick("sponsor", "/sponsor")}
      >
        Sponsor
      </button>
      <h1 className={styles.HeadingHome}>Welcome on Board!</h1>
    </div>
  );
}

export default Home;
