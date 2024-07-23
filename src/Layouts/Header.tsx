import { NavLink } from "react-router-dom";
import styles from "./layout.module.scss";

export default function Header() {
    return (
        <div className={styles.header}>
            <div className={styles.logo}>
                <a href="/">Logo</a>
            </div>
            <div className={styles.nav}>
                <ul>
                    <li>
                        <NavLink
                            to="/flowcontrlNtforms"
                            className={({ isActive }) =>
                                [isActive ? styles.active : ""].join(" ")
                            }
                        >
                            創簽單
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/englishVer"
                            className={({ isActive }) =>
                                [isActive ? styles.active : ""].join(" ")
                            }
                        >
                            English Version
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/table"
                            className={({ isActive }) =>
                                [isActive ? styles.active : ""].join(" ")
                            }
                        >
                            table
                        </NavLink>
                    </li>
                </ul>
            </div>
        </div>
    );
}
