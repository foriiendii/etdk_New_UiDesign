import { ParticipantScoring } from "types";

export function summarizeScores(
  participantScorings: ParticipantScoring[]
): Record<string, number> {
  return participantScorings.reduce((criteriaSummary, participantScoring) => {
    (participantScoring.score || []).forEach((participantScore) => {
      const { _id } = participantScore.criteria;
      const { score } = participantScore;
      criteriaSummary[_id] = (criteriaSummary[_id] || 0) + score;
    });
    return criteriaSummary;
  }, {} as { [key: string]: number });
}

export function calculateNomination(participantScorings: ParticipantScoring[]) {
  const otdk = { true: 0, false: 0 };
  const publish = { true: 0, false: 0 };
  (participantScorings || []).forEach((ps) => {
    otdk[`${ps.otdk_nominated}`] += 1;
    publish[`${ps.publish_nominated}`] += 1;
  });
  return { otdk, publish };
}
