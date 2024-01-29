"use client";
import { useContext } from "react";

import styles from "../styles/Dashboard.module.css";
import { LoggedInContext, SetLoggedInContext } from "./Contexts";

function Dashboard() {
  /* Contexts */
  const loggedInState = useContext(LoggedInContext);
  const loggedInDispatch = useContext(SetLoggedInContext);

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardMenu}>
        <button>Hjem</button>
        <button>Statistik</button>
        <button>Klasser</button>
        <button>Milepæle</button>
        <button onClick={() => loggedInDispatch(false)}>Log ud</button>
      </div>
      <div className={styles.dashboard}>
        <h1>Menupunkt</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo, eveniet ab nam, illo, incidunt perspiciatis nobis minus illum voluptate odio magnam impedit consequuntur libero rerum accusamus perferendis unde. Modi ea sequi suscipit tempora, distinctio at, expedita vero quis facilis quod laborum error est reprehenderit iusto temporibus voluptatem praesentium delectus magnam maxime, ducimus in cumque beatae aperiam tempore! Voluptatibus voluptates impedit libero iure omnis velit esse quas pariatur nobis facilis? Fugit, neque assumenda exercitationem atque porro eos cumque facilis iusto nam ipsum, rem natus corporis provident! Non, voluptatum. Sint amet repellat officia maxime architecto minus nobis. Nisi autem eius, similique cum sunt quidem quasi, tenetur mollitia
          consequuntur quos iusto voluptas animi iure tempore amet officia ullam laboriosam ab illum nihil. Recusandae, quo! Quod suscipit cum, vero quas tenetur repudiandae molestiae dignissimos esse dolor labore doloremque necessitatibus ex voluptatem debitis inventore vitae qui? Sunt excepturi atque quasi neque, sapiente laborum quisquam consequuntur incidunt. Expedita id itaque commodi quibusdam quia delectus ea similique incidunt a iste? Minima ducimus assumenda pariatur recusandae incidunt rerum reprehenderit molestias nisi praesentium, aliquid aut quisquam sapiente eaque adipisci enim tempora ipsum non sit labore repellat minus aspernatur! Explicabo, optio omnis accusamus labore nemo similique veritatis facilis vitae neque?
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
