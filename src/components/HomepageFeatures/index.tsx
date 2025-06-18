import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

/**
 * Feature data for the homepage
 */
const FeatureList: Array<{
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  description: string;
}> = [
  {
    title: "Modded Survival",
    Svg: require("@site/static/img/undraw_community.svg").default,
    description:
      "Experience enhanced Minecraft gameplay with carefully curated mods for better performance, exploration, and community features.",
  },
  {
    title: "Community Farms",
    Svg: require("@site/static/img/undraw_education.svg").default,
    description:
      "Collaborate on community farms and projects. Share resources, build together, and learn from other players.",
  },
  {
    title: "Safe Environment",
    Svg: require("@site/static/img/undraw_safe.svg").default,
    description:
      "Join a family-friendly, moderated server with anti-cheat protection and a supportive community of players.",
  },
];

/**
 * Individual feature component
 */
function Feature({ title, Svg, description }: {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  description: string;
}): JSX.Element {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
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
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
} 