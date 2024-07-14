import Footer from "./Footer";
import Header from "./Header";
import styles from "./layout.module.scss";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className={styles.wrapper}>
            <Header />
            <main>{children}</main>
            <Footer />
        </div>
    );
}
