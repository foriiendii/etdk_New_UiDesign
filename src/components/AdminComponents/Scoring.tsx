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
  console.log(criteria);
  return (
    <div>
      <table className="border-separate border-spacing-x-3 border-spacing-y-2 ">
        <tbody>
          {(criteria || []).map((c) => (
            <React.Fragment key={c._id}>
              {/* TODO WRITTEN AND ORAL */}
              {(isAfter(new Date(), parseISO("2024-05-15T23:59:59")) ||
                c.written) && (
                <tr key={c._id}>
                  <td className="w-full">
                    <p>{c.name}</p>
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
                  label="OTDKra jelölés"
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
                  className="bg-primaryDark"
                >
                  Mentés
                </Button>
              )}
            </td>
            <td className="pl-4">
              {Object.keys(scores).reduce((acc, current) => {
                return acc + (scores[current]?.score || 0);
              }, 0)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
