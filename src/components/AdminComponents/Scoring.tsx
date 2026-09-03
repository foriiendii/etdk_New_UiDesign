import { fetcher } from "@lib/queries";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  TextField,
} from "@mui/material";
import { isAfter, parseISO } from "date-fns";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Criteria } from "src/pages/admin/pontozas";
import { KeyedMutator } from "swr";
import { SanityParticipantScoring, UserRoles } from "types";

type ScoreType = {
  [key: string]: {
    name: string;
    score: number;
  };
};

type ErrorType = {
  [key: string]: string | undefined;
};

export const ParticipantScoring = ({
  criteria,
  participant,
  closed,
  mutate,
}: {
  criteria?: Criteria[];
  participant: SanityParticipantScoring;
  closed: boolean;
  mutate: KeyedMutator<SanityParticipantScoring[]>;
}) => {
  const session = useSession();
  const notScorer = session.data?.user.role !== UserRoles.Scorer;
  const [scores, setScores] = useState<ScoreType>(
    participant.score?.[0]
      ? participant.score[0].score.reduce((acc, cur) => {
          if ((criteria || []).find((c) => c._id === cur.criteria._id)) {
            return {
              ...acc,
              [cur.criteria._id]: { score: cur.score, name: cur.criteria.name },
            };
          }
          return acc;
        }, {})
      : {}
  );
  const [otdk, setOtdk] = useState<boolean>(
    participant.score?.[0]?.otdk_nominated || false
  );
  // const [publish, setPublish] = useState<boolean>(
  //   participant.score?.[0]?.publish_nominated || false
  // );

  const [errors, setErrors] = useState<ErrorType>({});

  const scoreParticipant = async () =>
    await fetcher(
      `/participants/score`,
      JSON.stringify({
        id: participant._id,
        scores: scores,
        // publish_nominated: publish,
        otdk_nominated: otdk,
        scorerId: participant.score?.[0]?.scorer._id,
      })
    ).then(() => mutate());

  const scoreParticipantPromise = async () =>
    toast.promise(scoreParticipant(), {
      loading: "Pontozás...",
      success: <b>Pontozás sikeres</b>,
      error: <b>Pontozás sikertelen</b>,
    });
  const totalScore = Object.keys(scores).reduce(
    (acc, current) => acc + (scores[current]?.score || 0),
    0
  );

  return (
    <div className="rounded-xl border border-[#2c1728]/10 bg-[#fbf8f5] p-4 sm:p-5">
      <table className="w-full border-separate border-spacing-y-2">
        <tbody>
          {(criteria || []).map((c) => (
            <React.Fragment key={c._id}>
              {/* TODO WRITTEN AND ORAL */}
              {(isAfter(new Date(), parseISO("2024-05-15T23:59:59")) ||
                c.written) && (
                <tr key={c._id}>
                  <td className="w-full pr-4">
                    <p className="font-open text-sm text-[#2c1728]">{c.name}</p>
                  </td>
                  <td>
                    <TextField
                      size="small"
                      value={scores[c._id]?.score || ""}
                      disabled={closed || notScorer}
                      onChange={(e) => {
                        if (parseInt(e.target.value) > c.maxScore) {
                          setErrors({
                            ...errors,
                            [c._id]: `A maximum pontszám ${c.maxScore}`,
                          });
                        } else {
                          const errorsHolder = errors;
                          delete errorsHolder[c._id];
                          setErrors(errorsHolder);
                        }
                        setScores({
                          ...scores,
                          [c._id]: {
                            name: c.name,
                            score: parseInt(e.target.value) || 0,
                          },
                        });
                      }}
                      InputProps={
                        !notScorer
                          ? {
                              endAdornment: (
                                <InputAdornment position="end">
                                  /{c.maxScore}
                                </InputAdornment>
                              ),
                            }
                          : {}
                      }
                      error={!!errors[c._id]}
                      helperText={errors[c._id]}
                      className="w-32"
                      sx={{
                        "& .MuiInputBase-input": {
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "0.85rem",
                        },
                        "& .MuiInputAdornment-root": {
                          fontFamily: "Poppins, sans-serif",
                          color: "#a58d90",
                        },
                      }}
                    />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}

          <tr>
            <td>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={otdk}
                      disabled={closed || notScorer}
                      onChange={(e) => setOtdk(e.target.checked)}
                    />
                  }
                  label="OTDK-ra jelölés"
                />
              </FormGroup>
            </td>
          </tr>
          {/* <tr>
            <td>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={publish}
                      disabled={closed || notScorer}
                      onChange={(e) => setPublish(e.target.checked)}
                    />
                  }
                  label="Publikálásra jelölés"
                />
              </FormGroup>
            </td>
          </tr> */}
          <tr>
            <td>
              {!closed && !notScorer && (
                <Button
                  variant="contained"
                  disabled={Object.keys(errors).length > 0}
                  onClick={scoreParticipantPromise}
                  sx={{
                    backgroundColor: "#2c1728",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "0.75rem",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#4a2940" },
                  }}
                >
                  Mentés
                </Button>
              )}
            </td>
            <td className="whitespace-nowrap pl-4 text-right">
              <span className="font-open text-xs uppercase tracking-[0.12em] text-[#a58d90]">Összesen </span>
              <strong className="font-open text-lg text-[#2c1728]">
                {notScorer ? totalScore.toFixed(2) : totalScore}
              </strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
