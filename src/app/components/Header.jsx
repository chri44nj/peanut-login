import Link from "next/link";

import styles from "../styles/Header.module.css";

function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.headerNav}>
        <Link className={styles.navLink} href="https://planetpeanut.io/da/">
          Planet Peanut
        </Link>
        <div>
          <Link className={styles.navLink} href="#">
            Account
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;
