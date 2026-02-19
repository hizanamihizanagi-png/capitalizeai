"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";

const navLinks = [
    { label: "Produits", href: "#products" },
    { label: "Pourquoi nous", href: "#why-us" },
    { label: "Pricing", href: "#pricing" },
    { label: "Blog", href: "#" },
    { label: "Contact", href: "#contact" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 16);
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <>
            <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
                <div className={styles.navInner}>
                    <Link href="/" className={styles.logo}>
                        <div className={styles.logoMark}>C</div>
                        <span className={styles.logoText}>
                            Capitalize<span className={styles.logoAccent}>AI</span>
                        </span>
                    </Link>

                    <ul className={styles.navLinks}>
                        {navLinks.map((link) => (
                            <li key={link.label}>
                                <a href={link.href} className={styles.navLink}>
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>

                    <div className={styles.navActions}>
                        <Link href="/login" className={styles.loginBtn}>
                            Se connecter
                        </Link>
                        <Link href="/register" className={styles.trialBtn}>
                            Essai gratuit
                        </Link>
                    </div>

                    <button
                        className={`${styles.menuButton} ${mobileOpen ? styles.open : ""}`}
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Menu"
                    >
                        <span className={styles.menuLine} />
                        <span className={styles.menuLine} />
                        <span className={styles.menuLine} />
                    </button>
                </div>
            </nav>

            {/* Mobile menu */}
            <div className={`${styles.mobileMenu} ${mobileOpen ? styles.open : ""}`}>
                {navLinks.map((link) => (
                    <a
                        key={link.label}
                        href={link.href}
                        className={styles.mobileLink}
                        onClick={() => setMobileOpen(false)}
                    >
                        {link.label}
                    </a>
                ))}
                <div className={styles.mobileActions}>
                    <Link href="/login" className="btn btn-secondary" style={{ width: "100%", justifyContent: "center" }}>
                        Se connecter
                    </Link>
                    <Link href="/register" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                        Essai gratuit
                    </Link>
                </div>
            </div>
        </>
    );
}
