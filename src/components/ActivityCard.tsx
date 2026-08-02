import { Card, Heading, Text, Pill } from "@noahwright/design";
import type { Activity } from "../data/activities";

export default function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <Card
      title={<Heading level={3}>{activity.title}</Heading>}
      subtitle={`${activity.duration} · ${activity.groupSize} people`}
      footer={
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {activity.tags.map((tag) => (
            <Pill key={tag} size="small" variant="secondary">
              {tag}
            </Pill>
          ))}
        </div>
      }
    >
      <Text>{activity.description}</Text>
    </Card>
  );
}
