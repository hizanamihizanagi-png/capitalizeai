"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { DashboardStats } from "@/lib/types";
import styles from "./dashboard.module.css";

export default function DashboardPage() {
    const router = useRouter();
    const supabase = createClient();
    const [user, setUser] = useState<User | null>(null);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = useCallback(async () => {
        try {
            const res = await fetch("/api/analytics");
            if (res.ok) {
                const json = await res.json();
                setStats(json.data);
            }
        } catch {
            // Silently fail — use defaults
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) {
                router.push("/login");
            } else {
                setUser(user);
                fetchStats();
            }
        });
    }, [router, supabase.auth, fetchStats]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    };

    if (!user) return null;

    const displayStats = stats || {
        total_scorings: 0,
        avg_score: 0,
        scorings_this_month: 0,
        scorings_trend: 0,
        default_rate: 0,
        total_amount_scored: 0,
        score_distribution: [],
        recent_activity: [],
        risk_breakdown: [],
    };

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
                        <div className={styles.statValue}>
                            {loading ? "—" : displayStats.total_scorings.toLocaleString()}
                        </div>
                        <div className={styles.statLabel}>Scores calculés</div>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statIcon}>📊</span>
                        <div className={styles.statValue}>
                            {loading ? "—" : displayStats.avg_score}
                        </div>
                        <div className={styles.statLabel}>Score moyen</div>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statIcon}>📅</span>
                        <div className={styles.statValue}>
                            {loading ? "—" : displayStats.scorings_this_month}
                        </div>
                        <div className={styles.statLabel}>Ce mois-ci</div>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statIcon}>⚠️</span>
                        <div className={styles.statValue}>
                            {loading ? "—" : `${displayStats.default_rate}%`}
                        </div>
                        <div className={styles.statLabel}>Taux de défaut</div>
                    </div>
                </div>

                <div className={styles.gridCards}>
                    <div className={styles.card}>
                        <h3>Activité récente</h3>
                        <div className={styles.activityList}>
                            {displayStats.recent_activity.length === 0 ? (
                                <div className={styles.activityItem}>
                                    <span className={styles.activityIcon}>📭</span>
                                    <span className={styles.activityLabel}>Aucune activité pour le moment</span>
                                    <span className={styles.activityTime}>—</span>
                                </div>
                            ) : (
                                displayStats.recent_activity.slice(0, 5).map((item, i) => (
                                    <div key={i} className={styles.activityItem}>
                                        <span className={styles.activityIcon}>🧠</span>
                                        <span className={styles.activityLabel}>{item.title}</span>
                                        <span className={styles.activityTime}>
                                            {new Date(item.timestamp).toLocaleDateString("fr-FR")}
                                        </span>
                                    </div>
                                ))
                            )}
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
