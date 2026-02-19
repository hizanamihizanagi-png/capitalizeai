"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import styles from "./dashboard.module.css";

export default function DashboardPage() {
    const router = useRouter();
    const supabase = createClient();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) {
                router.push("/login");
            } else {
                setUser(user);
            }
        });
    }, [router, supabase.auth]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    };

    if (!user) return null;

    return (
        <div className={styles.dashPage}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarLogo}>
                    <div className={styles.logoMark}>C</div>
                    <span className={styles.logoText}>
                        Capitalize<span className={styles.logoAccent}>AI</span>
                    </span>
                </div>

                <nav className={styles.sidebarNav}>
                    <a className={`${styles.navItem} ${styles.active}`} href="#" aria-label="Dashboard">
                        <span className={styles.navIcon}>📊</span>
                        Dashboard
                    </a>
                    <a className={styles.navItem} href="#" aria-label="ScorAI">
                        <span className={styles.navIcon}>🧠</span>
                        ScorAI
                    </a>
                    <a className={styles.navItem} href="#" aria-label="PayGate">
                        <span className={styles.navIcon}>💳</span>
                        PayGate
                    </a>
                    <a className={styles.navItem} href="#" aria-label="FraudShield">
                        <span className={styles.navIcon}>🛡️</span>
                        FraudShield
                    </a>
                    <a className={styles.navItem} href="#" aria-label="Analytics">
                        <span className={styles.navIcon}>📈</span>
                        Analytics
                    </a>
                    <a className={styles.navItem} href="#" aria-label="Settings">
                        <span className={styles.navIcon}>⚙️</span>
                        Paramètres
                    </a>
                </nav>

                <button className={styles.logoutBtn} onClick={handleLogout}>
                    Déconnexion
                </button>
            </aside>

            <main className={styles.main}>
                <header className={styles.header}>
                    <div>
                        <h1>Bienvenue, {user.user_metadata?.full_name || user.email?.split("@")[0]} 👋</h1>
                        <p>Voici un aperçu de votre activité CapitalizeAI</p>
                    </div>
                </header>

                <div className={styles.gridStats}>
                    <div className={styles.statCard}>
                        <span className={styles.statIcon}>🧠</span>
                        <div className={styles.statValue}>1,247</div>
                        <div className={styles.statLabel}>Scores calculés</div>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statIcon}>💳</span>
                        <div className={styles.statValue}>342</div>
                        <div className={styles.statLabel}>Paiements traités</div>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statIcon}>🛡️</span>
                        <div className={styles.statValue}>12</div>
                        <div className={styles.statLabel}>Fraudes bloquées</div>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statIcon}>📈</span>
                        <div className={styles.statValue}>89%</div>
                        <div className={styles.statLabel}>Précision AUC</div>
                    </div>
                </div>

                <div className={styles.gridCards}>
                    <div className={styles.card}>
                        <h3>Activité récente</h3>
                        <div className={styles.activityList}>
                            {[
                                { label: "Score #1247 calculé", time: "il y a 2 min", icon: "🧠" },
                                { label: "Paiement MTN MoMo traité", time: "il y a 5 min", icon: "💳" },
                                { label: "Tentative de fraude bloquée", time: "il y a 12 min", icon: "🛡️" },
                                { label: "Score #1246 calculé", time: "il y a 18 min", icon: "🧠" },
                                { label: "Paiement Orange Money traité", time: "il y a 23 min", icon: "💳" },
                            ].map((item, i) => (
                                <div key={i} className={styles.activityItem}>
                                    <span className={styles.activityIcon}>{item.icon}</span>
                                    <span className={styles.activityLabel}>{item.label}</span>
                                    <span className={styles.activityTime}>{item.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h3>Modules actifs</h3>
                        <div className={styles.modulesList}>
                            {[
                                { name: "ScorAI", status: "Actif", color: "#14B8A6" },
                                { name: "PayGate", status: "Actif", color: "#3B82F6" },
                                { name: "FraudShield", status: "Actif", color: "#F59E0B" },
                                { name: "SmartBet", status: "Bientôt", color: "#9CA3AF" },
                                { name: "CapitalVault", status: "Bientôt", color: "#9CA3AF" },
                            ].map((mod, i) => (
                                <div key={i} className={styles.moduleItem}>
                                    <span className={styles.moduleDot} style={{ backgroundColor: mod.color }} />
                                    <span className={styles.moduleName}>{mod.name}</span>
                                    <span
                                        className={styles.moduleStatus}
                                        style={{ color: mod.color }}
                                    >
                                        {mod.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
