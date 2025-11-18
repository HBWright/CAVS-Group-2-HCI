import { useNavigate } from "react-router-dom";
import styles from "./OperatorPageButtons.module.css";

function Operator() {
  const navigate = useNavigate();
  return (
    <div>
      <button
        className={styles.OperatorButtonHome}
        onClick={() => navigate("/")}
      >
        Home
      </button>
    </div>
  );
}
export default Operator;
