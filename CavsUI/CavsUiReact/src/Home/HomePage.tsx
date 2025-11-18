import { useNavigate } from "react-router-dom";
import styles from "./HomePageButtons.module.css";

function Home() {
  const navigate = useNavigate();
  console.log("Styles object:", styles);

  return (
    <div className={styles.HomePageContainer}>
      <button
        className={styles.ButtonOperator}
        onClick={() => navigate("/operator")}
      >
        Operator
      </button>
      <button
        className={styles.ButtonPassenger}
        onClick={() => navigate("/passenger")}
      >
        Passenger
      </button>
      <button
        className={styles.ButtonSponsor}
        onClick={() => navigate("/sponsor")}
      >
        Sponsor
      </button>
      <h1 className={styles.HeadingHome}>CAVS</h1>
    </div>
  );
}

export default Home;
