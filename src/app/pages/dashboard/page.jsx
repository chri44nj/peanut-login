import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import styles from "../../styles/page.module.css";
import Dashboard from "@/app/components/Dashboard";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/");
  return (
    <main id="main" className={styles.main}>
      <Dashboard />
    </main>
  );
}
