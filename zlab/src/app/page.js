import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <main className={styles.main}>
      <Link href="/crt">
        <button>Go to CRT Experiment</button>
      </Link>
    </main>
  );
}
