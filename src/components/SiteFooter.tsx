import { Footer, Text } from "@noahwright/design";

const YEAR = new Date().getFullYear();

export default function SiteFooter() {
  return (
    <Footer
      bottom={<Text tone="muted">© {YEAR} WFH Activities. Dumb little games for remote teams.</Text>}
    />
  );
}
