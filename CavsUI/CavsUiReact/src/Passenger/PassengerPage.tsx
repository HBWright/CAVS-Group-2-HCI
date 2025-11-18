import { useNavigate } from "react-router-dom";
import styles from "./PassengerPageButtons.module.css";

function Passenger() {
  const navigate = useNavigate();
  return (
    <div>
      <button
        className={styles.PassengerButtonHome}
        onClick={() => navigate("/")}
      >
        Home
      </button>
    </div>
  );
}
export default Passenger;
