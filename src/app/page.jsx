import styles from "./styles/page.module.css";

import Login from "./components/Login";

export default function Home() {
  return (
    <main id="main" className={styles.main}>
      <Login />
    </main>
  );
}
