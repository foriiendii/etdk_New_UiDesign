import { queryWinners } from "@lib/queries";
import { getClient } from "@lib/sanity";

type WinnersType = {
  section: {
    name: string;
  };
  winnerPersons: {
    name: string;
    result: string;
  }[];
};

const Winners = ({ winners }: { winners: WinnersType[] }) => {
  return (
    <div className="flex min-h-[100vh] min-w-full flex-col space-y-10 bg-primaryLight p-4 pt-[100px] text-white">
      <div className="flex flex-wrap justify-evenly gap-4 md:gap-8">
        {(winners || []).map((winner) => (
          <div
            key={winner.section.name}
            className="h-auto w-full bg-lightGray p-2 md:w-[500px] md:p-4"
          >
            <table className="w-full border-separate border-spacing-x-3 border-spacing-y-2 md:border-spacing-x-5 md:border-spacing-y-4">
              <thead>
                <tr>
                  <th className="w-2/3">
                    <span className="flex text-left text-2xl text-primaryDark md:text-3xl">
                      {winner.section.name}
                    </span>
                  </th>
                  <th>
                    <span className=" flex text-left text-lg text-primaryDark md:text-xl">
                      ELÉRT EREDMÉNY:
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {winner.winnerPersons.map((winnerPerson) => (
                  <tr key={winnerPerson.name}>
                    <td>
                      <span
                        key={winnerPerson.name}
                        className="whitespace-pre-wrap text-lg text-slate-600 md:text-xl"
                      >
                        {winnerPerson.name.split(",").join(",\n")}
                      </span>
                    </td>
                    <td>
                      <span
                        key={winnerPerson.name}
                        className="text-lg text-slate-600 md:text-xl"
                      >
                        {winnerPerson.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export const getServerSideProps = async ({ preview = false }) => {
  const winners: WinnersType[] = await getClient(preview).fetch(queryWinners);
  return {
    props: {
      winners: winners.sort((a, b) =>
        a.section.name.toLowerCase().localeCompare(b.section.name.toLowerCase())
      ),
      preview,
    },
  };
};

export default Winners;
