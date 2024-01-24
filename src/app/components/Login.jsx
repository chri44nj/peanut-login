import styles from "../styles/Login.module.css";

function Login() {
  return (
    <div className={styles.loginFormContainer}>
      <form className={styles.loginForm} action="">
        <h2>Log ind</h2>
        <div className={styles.inputField}>
          <label htmlFor="email">Email-adresse</label>
          <input type="email" id="email" name="email" required />
        </div>

        <div className={styles.inputField}>
          <label htmlFor="password">Adgangskode</label>
          <input type="password" id="password" name="password" required />
        </div>

        <button className={styles.loginButton} type="submit">
          Log ind
        </button>

        <p></p>
      </form>
    </div>
  );
}

export default Login;
