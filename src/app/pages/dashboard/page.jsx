import styles from "../../styles/page.module.css";
import Dashboard from "@/app/components/Dashboard";

export default function Home() {
  return (
    <main id="main" className={styles.main}>
      <Dashboard />
    </main>
  );
}
