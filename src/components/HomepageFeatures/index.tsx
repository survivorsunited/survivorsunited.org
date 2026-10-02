import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

/**
 * Feature data for the homepage
 */
const FeatureList: Array<{
  title: string;
  imageSrc: string;
  imageAlt: string;
  description: string;
}> = [
  {
    title: "Modded Survival",
    imageSrc: "/img/features/modded-survival.png",
    imageAlt: "Three Minecraft players with a Survivors United coin",
    description:
      "Experience enhanced survival gameplay with carefully curated mods for better performance, exploration, and community features.",
  },
  {
    title: "Community Farms",
    imageSrc: "/img/features/community-farms.png",
    imageAlt: "A shared Minecraft vegetable and wheat farm",
    description:
      "Collaborate on community farms and projects. Share resources, build together, and learn from other players.",
  },
  {
    title: "Safe Environment",
    imageSrc: "/img/features/safe-environment.png",
    imageAlt: "A Minecraft house under a protective green shield",
    description:
      "Join a family-friendly, moderated server with anti-cheat protection and a supportive community of players.",
  },
];

/**
 * Individual feature component
 */
function Feature({ title, imageSrc, imageAlt, description }: {
  title: string;
  imageSrc: string;
  imageAlt: string;
  description: string;
}): JSX.Element {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <img src={imageSrc} alt={imageAlt} width={512} height={512} loading="lazy" decoding="async" className={styles.featureImage} />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

/**
 * Homepage features component that displays feature cards
 */
export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <Heading as="h2" className={styles.featuresTitle}>
          Why Join Survivors United
        </Heading>
        <div className={styles.featuresGroup}>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
