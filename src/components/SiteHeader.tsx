import { Header, Heading, Link } from "@noahwright/design";
import ThemeToggle from "./ThemeToggle";

export default function SiteHeader() {
  return (
    <Header
      left={
        <Link href="/">
          <Heading level={3}>🏠 WFH Activities</Heading>
        </Link>
      }
      right={<ThemeToggle />}
    />
  );
}
