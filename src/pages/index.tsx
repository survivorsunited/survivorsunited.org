import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Heading from "@theme/Heading";

import styles from "./index.module.css";

/**
 * Homepage component for Survivors United Minecraft Community
 * Features a hero section with call-to-action buttons and feature highlights
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
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/minecraft/getting-started"
          >
            Setup Guide ⏱️
          </Link>
          <Link
            className="button button--primary button--lg"
            to="/docs/minecraft/server/connection"
          >
            Join Our Server
          </Link>
        </div>
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
      description="Join our Minecraft survival community with modded gameplay, community farms, and a supportive player base."
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
} 