import Link from "next/link";
import Navbar from "@/components/Navbar/Navbar";
import styles from "./page.module.css";

const modules = [
  {
    icon: "🧠",
    iconColor: "teal",
    title: "ScorAI",
    description:
      "Scoring de crédit IA utilisant les données Mobile Money, comportementales et sociales. Graphes neuronaux, Bayesian ML, et explicabilité SHAP.",
    tag: "Phase 1",
    tagClass: "live",
  },
  {
    icon: "💳",
    iconColor: "gold",
    title: "PayGate",
    description:
      "API de paiement unifiée. MTN MoMo, Orange Money, Visa, Mastercard en un seul endpoint. Le Stripe de l'Afrique Centrale.",
    tag: "Phase 2",
    tagClass: "upcoming",
  },
  {
    icon: "🛡️",
    iconColor: "red",
    title: "FraudShield AI",
    description:
      "Détection de fraude en temps réel par IA. Analyse comportementale, scoring de risque, et eKYC automatisé.",
    tag: "Phase 2",
    tagClass: "upcoming",
  },
  {
    icon: "🎯",
    iconColor: "purple",
    title: "SmartBet",
    description:
      "Innovation mondiale : redirige automatiquement l'argent des paris sportifs vers du micro-investissement gamifié.",
    tag: "Phase 3",
    tagClass: "upcoming",
  },
  {
    icon: "🏦",
    iconColor: "blue",
    title: "CapitalVault",
    description:
      "Micro-épargne, micro-assurance, et crowdfarming. Les produits financiers de demain, accessibles à tous via USSD.",
    tag: "Phase 3",
    tagClass: "upcoming",
  },
];

const stats = [
  { value: "400M+", label: "Adultes non-bancarisés en Afrique", color: "teal" },
  { value: "24.8M", label: "Comptes Mobile Money au Cameroun", color: "gold" },
  { value: "$40B", label: "Marché des paiements digitaux (Afrique)", color: "blue" },
  { value: "0", label: "Concurrents IA en zone CEMAC", color: "white" },
];

const steps = [
  {
    title: "Connectez vos données",
    desc: "Intégrez vos systèmes existants via notre API. Mobile Money, relevés bancaires, données opérateur — tout est supporté.",
  },
  {
    title: "L'IA analyse en temps réel",
    desc: "Notre moteur GNN + Bayesian ML analyse 200+ features en moins de 2 secondes. Score de crédit + explication SHAP.",
  },
  {
    title: "Décidez avec confiance",
    desc: "Recevez un score de 0-1000 avec une explication transparente. Réduisez vos défauts de 35% à moins de 5%.",
  },
  {
    title: "Activez le flywheel",
    desc: "Chaque transaction alimente le modèle. Plus de data → meilleur scoring → plus de crédit → plus de transactions.",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    desc: "Pour les IMFs de petite taille",
    price: "150K",
    currency: "FCFA",
    period: "/ mois",
    features: [
      "Jusqu'à 500 scorings/mois",
      "API REST + Dashboard",
      "Support email",
      "1 utilisateur",
      "Rapports mensuels",
    ],
    featured: false,
  },
  {
    name: "Business",
    desc: "Pour les IMFs en croissance",
    price: "450K",
    currency: "FCFA",
    period: "/ mois",
    features: [
      "Jusqu'à 5,000 scorings/mois",
      "API REST + Dashboard + Webhooks",
      "Support prioritaire",
      "10 utilisateurs",
      "Analytics avancés",
      "FraudShield inclus",
      "Rapports personnalisés",
    ],
    featured: true,
  },
  {
    name: "Enterprise",
    desc: "Pour les banques et grands réseaux",
    price: "Sur mesure",
    currency: "",
    period: "",
    features: [
      "Scorings illimités",
      "API + SDK + On-premise",
      "Account manager dédié",
      "Utilisateurs illimités",
      "SLA 99.9%",
      "Intégration sur mesure",
      "Formation équipe",
      "Compliance COBAC",
    ],
    featured: false,
  },
];

export default function LandingPage() {
  return (
    <>
      <Navbar />

      {/* ════════════ HERO ════════════ */}
      <section className={styles.hero} id="hero">
        <div className={styles.heroBg}>
          <div className={styles.heroGrid} />
        </div>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <span className="badge">🚀 Le Ant Financial de l&apos;Afrique</span>
            </div>
            <h1 className={styles.heroTitle}>
              L&apos;infrastructure{" "}
              <span className="gradient-text">financière intelligente</span>{" "}
              de l&apos;Afrique
            </h1>
            <p className={styles.heroSubtitle}>
              CapitalizeAI transforme les données Mobile Money en scores de
              crédit IA, unifie les paiements en une API, et redirige
              l&apos;argent des paris sportifs vers l&apos;investissement.{" "}
              <strong>400 millions de non-bancarisés. Une solution.</strong>
            </p>
            <div className={styles.heroCtas}>
              <Link href="/register" className="btn btn-primary btn-lg">
                Commencer gratuitement →
              </Link>
              <Link href="#products" className="btn btn-secondary btn-lg">
                Découvrir nos produits
              </Link>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.heroStat}>
                <span className={styles.heroStatValue}>&lt; 2s</span>
                <span className={styles.heroStatLabel}>Temps de scoring</span>
              </div>
              <div className={styles.heroStat}>
                <span className={styles.heroStatValue}>200+</span>
                <span className={styles.heroStatLabel}>Features analysées</span>
              </div>
              <div className={styles.heroStat}>
                <span className={styles.heroStatValue}>AUC 0.89</span>
                <span className={styles.heroStatLabel}>Précision du modèle</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ TRUST BAR ════════════ */}
      <section className={styles.trustBar}>
        <div className="container">
          <p className={styles.trustTitle}>
            Conçu pour les leaders financiers africains
          </p>
          <div className={styles.trustLogos}>
            <span className={styles.trustLogo}>MTN MoMo</span>
            <span className={styles.trustLogo}>Orange Money</span>
            <span className={styles.trustLogo}>COBAC</span>
            <span className={styles.trustLogo}>BEAC</span>
            <span className={styles.trustLogo}>CamCCUL</span>
          </div>
        </div>
      </section>

      {/* ════════════ PROBLEM ════════════ */}
      <section className={`${styles.problemSection} section`} id="problem">
        <div className="container">
          <div className={styles.problemGrid}>
            <div className={styles.problemVisual}>
              <div className={styles.problemChart}>
                <div className={styles.problemStatRow}>
                  <span className={styles.problemLabel}>Taux de défaut IMFs</span>
                  <span className={styles.problemValue}>15-35%</span>
                </div>
                <div className={styles.problemStatRow}>
                  <span className={styles.problemLabel}>Adultes exclus du crédit</span>
                  <span className={styles.problemValue}>60%</span>
                </div>
                <div className={styles.problemStatRow}>
                  <span className={styles.problemLabel}>Pertes annuelles fraude</span>
                  <span className={styles.problemValue}>$5Mds</span>
                </div>
                <div className={styles.problemStatRow}>
                  <span className={styles.problemLabel}>Argent perdu en paris</span>
                  <span className={styles.problemValue}>$560M</span>
                </div>
                <div className={styles.problemStatRow}>
                  <span className={styles.problemLabel}>Notre objectif défaut</span>
                  <span className={`${styles.problemValue} ${styles.accent}`}>&lt; 5%</span>
                </div>
              </div>
            </div>
            <div className={styles.problemText}>
              <h2>
                Le système financier africain est{" "}
                <span className="gradient-text">cassé</span>
              </h2>
              <p>
                400 millions d&apos;adultes n&apos;ont aucun accès au crédit formel. Les
                institutions financières perdent des milliards en défauts de
                paiement. Les systèmes de paiement sont fragmentés. Et des
                centaines de millions disparaissent dans les paris sportifs.
              </p>
              <p>
                <strong>CapitalizeAI résout ces 4 problèmes avec une plateforme unique.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ PRODUCTS ════════════ */}
      <section className={`${styles.productsSection} section`} id="products">
        <div className="container">
          <div className="section-header">
            <h2>
              5 modules.{" "}
              <span className="gradient-text">Un écosystème.</span>
            </h2>
            <p>
              Du scoring IA aux micro-investissements, chaque module alimente
              les autres. C&apos;est le flywheel qui a fait d&apos;Ant Financial une
              entreprise à $150 milliards.
            </p>
          </div>
          <div className={styles.moduleCards}>
            {modules.map((mod) => (
              <div key={mod.title} className={styles.moduleCard}>
                <div className={`${styles.moduleIcon} ${styles[mod.iconColor]}`}>
                  {mod.icon}
                </div>
                <h3>{mod.title}</h3>
                <p>{mod.description}</p>
                <span className={`${styles.moduleTag} ${styles[mod.tagClass]}`}>
                  {mod.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ STATS ════════════ */}
      <section className={`${styles.statsSection} section`} id="why-us">
        <div className="container">
          <div className="section-header">
            <h2>
              Un marché{" "}
              <span className="gradient-text">massif et sous-servi</span>
            </h2>
            <p>
              L&apos;Afrique Centrale est le dernier grand marché fintech sans
              solution IA de scoring. Nous sommes les premiers.
            </p>
          </div>
          <div className={styles.statsGrid}>
            {stats.map((stat) => (
              <div key={stat.label} className={styles.statCard}>
                <div className={`${styles.statValue} ${styles[stat.color]}`}>
                  {stat.value}
                </div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ HOW IT WORKS ════════════ */}
      <section className={`${styles.howSection} section`}>
        <div className="container">
          <div className="section-header">
            <h2>
              Comment ça <span className="gradient-text">fonctionne</span>
            </h2>
            <p>
              De la connexion au score en moins de 2 secondes. Simple pour vous,
              puissant sous le capot.
            </p>
          </div>
          <div className={styles.stepsContainer}>
            {steps.map((step, i) => (
              <div key={i} className={styles.step}>
                <div className={styles.stepNumber}>{i + 1}</div>
                <div className={styles.stepContent}>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ PRICING ════════════ */}
      <section className={`${styles.pricingSection} section`} id="pricing">
        <div className="container">
          <div className="section-header">
            <h2>
              Tarification{" "}
              <span className="gradient-text">transparente</span>
            </h2>
            <p>
              30 jours d&apos;essai gratuit. Pas de carte bancaire requise. Annulez
              quand vous voulez.
            </p>
          </div>
          <div className={styles.pricingGrid}>
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`${styles.pricingCard} ${plan.featured ? styles.featured : ""
                  }`}
              >
                <div className={styles.pricingName}>{plan.name}</div>
                <div className={styles.pricingDesc}>{plan.desc}</div>
                <div className={styles.pricingPrice}>
                  <span className={styles.pricingAmount}>
                    {plan.price}
                  </span>
                  {plan.currency && (
                    <span className={styles.pricingPeriod}>
                      {plan.currency} {plan.period}
                    </span>
                  )}
                </div>
                <ul className={styles.pricingFeatures}>
                  {plan.features.map((f, i) => (
                    <li key={i} className={styles.pricingFeature}>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`btn ${plan.featured ? "btn-primary" : "btn-secondary"
                    }`}
                  style={{ width: "100%", textAlign: "center" }}
                >
                  {plan.price === "Sur mesure" ? "Nous contacter" : "Essai gratuit"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ FINAL CTA ════════════ */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaBg} />
        <div className="container">
          <div className={styles.ctaInner}>
            <h2>
              Prêt à <span className="gradient-text">scorer l&apos;invisible</span> ?
            </h2>
            <p>
              Rejoignez les institutions financières qui transforment leur
              gestion du risque avec l&apos;IA. 30 jours gratuits, sans engagement.
            </p>
            <div className={styles.ctaCtas}>
              <Link href="/register" className="btn btn-primary btn-lg">
                Démarrer maintenant →
              </Link>
              <Link href="#contact" className="btn btn-secondary btn-lg">
                Parler à un expert
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ FOOTER ════════════ */}
      <footer className={styles.footer} id="contact">
        <div className="container">
          <div className={styles.footerGrid}>
            <div className={styles.footerBrand}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    background: "linear-gradient(135deg, #00D4AA, #00A88A)",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    fontSize: "1.1rem",
                    color: "#0F172A",
                  }}
                >
                  C
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    color: "#E2E8F0",
                  }}
                >
                  Capitalize<span style={{ color: "#2DD4BF" }}>AI</span>
                </span>
              </div>
              <p>
                L&apos;infrastructure financière intelligente de l&apos;Afrique.
                Scoring IA, paiements unifiés, et inclusion financière pour 400
                millions de personnes.
              </p>
            </div>
            <div className={styles.footerCol}>
              <h4>Produits</h4>
              <ul className={styles.footerLinks}>
                <li><a href="#products">ScorAI</a></li>
                <li><a href="#products">PayGate</a></li>
                <li><a href="#products">FraudShield</a></li>
                <li><a href="#products">SmartBet</a></li>
                <li><a href="#products">CapitalVault</a></li>
              </ul>
            </div>
            <div className={styles.footerCol}>
              <h4>Entreprise</h4>
              <ul className={styles.footerLinks}>
                <li><a href="#">À propos</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Carrières</a></li>
                <li><a href="#">Presse</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
            <div className={styles.footerCol}>
              <h4>Légal</h4>
              <ul className={styles.footerLinks}>
                <li><a href="#">Conditions d&apos;utilisation</a></li>
                <li><a href="#">Politique de confidentialité</a></li>
                <li><a href="#">Conformité COBAC</a></li>
                <li><a href="#">Sécurité</a></li>
              </ul>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p className={styles.footerCopy}>
              © 2026 CapitalizeAI. Tous droits réservés. Douala, Cameroun.
            </p>
            <div className={styles.footerSocials}>
              <a href="#" aria-label="LinkedIn">in</a>
              <a href="#" aria-label="Twitter">𝕏</a>
              <a href="#" aria-label="GitHub">⌘</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
