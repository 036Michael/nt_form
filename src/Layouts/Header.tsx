import styles from "./layout.module.scss";

export default function Header() {
    return (
        <div className={styles.header}>
            <div className={styles.logo}>Logo</div>
            <div className={styles.nav}>
                <a href="/flowcontrlNtforms">ntForms 創簽單</a>
                <a href="/englishVer">English Version</a>
            </div>
        </div>
    );
}
