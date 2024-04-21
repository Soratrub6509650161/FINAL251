import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'; // เพิ่ม import นี้
import styles from '../css/Home.module.css';
import Page1 from "../img/Home/1.jpg";
import Page2 from "../img/Home/4.jpg";
import Page3 from "../img/Home/3.jpg";

const Home = () => {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(styles.show);
                } else {
                    entry.target.classList.remove(styles.show);
                }
            });
        });

        const hiddenElements = document.querySelectorAll(`.${styles.hidden}`);
        hiddenElements.forEach((el) => observer.observe(el));

        return () => {
            hiddenElements.forEach((el) => observer.unobserve(el));
        };
    }, []);

    return (
        <div>
            <section className={styles.section}>
                <div className={styles.logo}>
                    <img src={Page1} alt="Page 1" className={styles.mainhome} />
                    <div className={styles.textContainer}>
                        <h1 className={styles.ht}>TRULY</h1>
                        {/* เปลี่ยน <a> เป็น <Link> */}
                        <Link to="/Store" className={styles.moreLink}>
                            <button type="button" className={`btn btn-outline-light ${styles.btn}`}>more</button>
                        </Link>
                    </div>
                </div>
            </section>
            <section className={styles.section}>
                <div className={styles.logo}>
                    <img src={Page2} alt="Page 2" className={styles.mainhome} />
                    <div className={styles.textContainer}>
                        {/* เปลี่ยน <a> เป็น <Link> */}
                        <Link to="/Store" className={styles.moreLink}>
                            <button type="button" className={`btn btn-outline-light ${styles.btn}`}>more</button>
                        </Link>
                    </div>
                </div>
            </section>
            <section className={styles.section}>
                <div className={styles.logo}>
                    <img src={Page3} alt="Page 3" className={styles.mainhome} />
                    <div className={styles.textContainer}>
                        {/* เปลี่ยน <a> เป็น <Link> */}
                        <Link to="/Store" className={styles.moreLink}>
                            <button type="button" className={`btn btn-outline-light ${styles.btn}`}>more</button>
                        </Link>
                    </div>
                </div>
            </section>
            <footer className={styles.footer}>
                <nav className="navbar navbar-expand-lg">
                    <a className={styles.ig} href="#!" role="button">
                        <i className="fab fa-instagram"></i>
                    </a>
                    <a className={styles.facebook} href="#!" role="button">
                        <i className="fab fa-facebook-f"></i>
                    </a>
                    <a className={styles.line} href="#!" role="button">
                        <i className="fab fa-line"></i>
                    </a>
                    <a className={styles.line} href="/chat" role="button" id="chat">
                        <i className="fa-solid fa-comment" id="chat"></i>
                    </a>
                </nav>
            </footer>

        </div>
    );
};

export default Home;
