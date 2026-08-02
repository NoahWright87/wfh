export type Activity = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  duration: string;
  groupSize: string;
};

// Placeholder activities for the shell. Each one will eventually get its own
// page/mini-app under src/pages/activities/[slug]. None of these require a
// backend — everything runs client-side once the static page loads.
export const activities: Activity[] = [
  {
    slug: "two-truths-and-a-lie",
    title: "Two Truths and a Lie",
    description:
      "Everyone shares three 'facts' about themselves — only two are true. The team votes on the lie.",
    tags: ["icebreaker", "no-prep"],
    duration: "10-15 min",
    groupSize: "4-20",
  },
  {
    slug: "would-you-rather",
    title: "Would You Rather",
    description:
      "Rapid-fire either/or questions to spark quick debates and a few laughs before a meeting.",
    tags: ["icebreaker", "quick"],
    duration: "5-10 min",
    groupSize: "2+",
  },
  {
    slug: "virtual-scavenger-hunt",
    title: "Virtual Scavenger Hunt",
    description:
      "Race to find household items matching a themed list, first to show all items on camera wins.",
    tags: ["game", "camera-on"],
    duration: "15-20 min",
    groupSize: "4-30",
  },
  {
    slug: "desk-trivia",
    title: "Desk Trivia",
    description:
      "A quick multiple-choice trivia round covering pop culture, company history, or team-picked topics.",
    tags: ["game", "team-building"],
    duration: "15-25 min",
    groupSize: "3+",
  },
  {
    slug: "gratitude-round",
    title: "Gratitude Round",
    description:
      "Each person shares one thing, work-related or not, they're grateful for this week.",
    tags: ["team-building", "no-prep"],
    duration: "5-10 min",
    groupSize: "any",
  },
];
