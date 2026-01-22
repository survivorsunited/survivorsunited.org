import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Heading from "@theme/Heading";

import styles from "./index.module.css";

const gameCards = [
  {
    title: "Minecraft",
    description:
      "Jump into our modded survival community with curated mods, shared farms, and friendly support.",
    href: "/docs/minecraft/getting-started",
    imageSrc: "/img/games/minecraft/logo.jpg",
    imageAlt: "Minecraft",
  },
  {
    title: "Hytale",
    description:
      "Get ready for Early Access and connect to our Hytale server as we roll out mods and guides.",
    href: "/docs/hytale/getting-started",
    imageSrc: "/img/games/hytale/logo.jpg",
    imageAlt: "Hytale",
  },
];

/**
 * Homepage component for Survivors United multi-game community
 * Features a hero section and game selection cards
 */
function HomepageHeader(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <p className={styles.heroIntro}>
          Choose your game to get started with the right guides and server info.
        </p>
      </div>
    </header>
  );
}

/**
 * Main homepage component that renders the hero section and features
 */
export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  
  return (
    <Layout
      title={`Welcome to ${siteConfig.title}`}
      description="Choose your game and join our survival community for Minecraft and Hytale."
    >
      <HomepageHeader />
      <main>
        <section className={styles.gamesSection}>
          <div className="container">
            <Heading as="h2" className={styles.sectionTitle}>
              Select Your Game
            </Heading>
            <div className={styles.gamesGrid}>
              {gameCards.map((game) => (
                <div key={game.title} className={clsx("card", styles.gameCard)}>
                  <div className="card__image">
                    <img
                      src={game.imageSrc}
                      alt={game.imageAlt}
                      className={styles.gameImage}
                      loading="lazy"
                    />
                  </div>
                  <div className="card__body">
                    <Heading as="h3" className={styles.gameTitle}>
                      {game.title}
                    </Heading>
                    <p>{game.description}</p>
                  </div>
                  <div className="card__footer">
                    <Link className="button button--primary button--block" to={game.href}>
                      <span className={styles.buttonContent}>
                        <img
                          src={game.imageSrc}
                          alt=""
                          aria-hidden="true"
                          className={styles.buttonIcon}
                        />
                        Enter {game.title}
                      </span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <HomepageFeatures />
      </main>
    </Layout>
  );
} 