import { useNavigate } from "react-router-dom";
import styles from "./SponsorPageButtons.module.css";

function Sponsor() {
  const navigate = useNavigate();
  return (
    <div>
      <button className={styles.SponsorButtonHome} onClick={() => navigate("/")}>
        Home
      </button>
    </div>
  );
}
export default Sponsor;
