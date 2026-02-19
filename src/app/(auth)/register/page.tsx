"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import styles from "../auth.module.css";

export default function RegisterPage() {
    const router = useRouter();
    const supabase = createClient();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
    };

    if (success) {
        return (
            <div className={styles.authPage}>
                <div className={styles.authCard}>
                    <Link href="/" className={styles.authLogo}>
                        <div className={styles.authLogoMark}>C</div>
                        <span className={styles.authLogoText}>
                            Capitalize<span className={styles.authLogoAccent}>AI</span>
                        </span>
                    </Link>
                    <div className={styles.authHeader}>
                        <h1>Vérifiez votre email ✉️</h1>
                        <p>
                            Nous avons envoyé un lien de confirmation à <strong>{email}</strong>.
                            Cliquez sur ce lien pour activer votre compte.
                        </p>
                    </div>
                    <Link href="/login" className={styles.submitBtn} style={{ textAlign: "center", textDecoration: "none", display: "block" }}>
                        Retour à la connexion
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.authPage}>
            <div className={styles.authCard}>
                <Link href="/" className={styles.authLogo}>
                    <div className={styles.authLogoMark}>C</div>
                    <span className={styles.authLogoText}>
                        Capitalize<span className={styles.authLogoAccent}>AI</span>
                    </span>
                </Link>

                <div className={styles.authHeader}>
                    <h1>Créer un compte</h1>
                    <p>30 jours d&apos;essai gratuit, sans engagement</p>
                </div>

                {error && <div className={styles.errorMsg}>{error}</div>}

                <form className={styles.authForm} onSubmit={handleRegister}>
                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel} htmlFor="fullName">
                            Nom complet
                        </label>
                        <input
                            id="fullName"
                            type="text"
                            className={styles.fieldInput}
                            placeholder="Jean Dupont"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel} htmlFor="email">
                            Email professionnel
                        </label>
                        <input
                            id="email"
                            type="email"
                            className={styles.fieldInput}
                            placeholder="vous@entreprise.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel} htmlFor="password">
                            Mot de passe
                        </label>
                        <input
                            id="password"
                            type="password"
                            className={styles.fieldInput}
                            placeholder="8 caractères minimum"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={loading}
                    >
                        {loading ? "Création..." : "Créer mon compte gratuit"}
                    </button>
                </form>

                <div className={styles.divider}>ou</div>

                <button
                    className={styles.socialBtn}
                    onClick={handleGoogleSignup}
                    type="button"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09A6.97 6.97 0 015.47 12c0-.72.13-1.43.37-2.09V7.07H2.18A11.96 11.96 0 001 12c0 1.94.46 3.77 1.18 5.42l3.66-2.84z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Continuer avec Google
                </button>

                <p className={styles.authFooter}>
                    Déjà inscrit ?{" "}
                    <Link href="/login">Se connecter</Link>
                </p>
            </div>
        </div>
    );
}
