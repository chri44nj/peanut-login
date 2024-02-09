import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";

import styles from "./styles/page.module.css";

import Login from "./components/Login";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) redirect("/pages/dashboard");

  return (
    <main id="main" className={styles.main}>
      <Login />
    </main>
  );
}
