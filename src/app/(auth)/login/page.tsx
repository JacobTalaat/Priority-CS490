import type { Metadata } from "next";
import styles from "../auth.module.css";
import { LogInForm } from "./log-in-form";

export const metadata: Metadata = { title: "Log in" };

export default function LogInPage() {
  return (
    <>
      <div className={styles.heading}>
        <p className="eyebrow">Welcome back</p>
        <h1 className={styles.title}>Log in</h1>
        <p className={styles.subtitle}>Pick up where you left off.</p>
      </div>
      <LogInForm />
    </>
  );
}
