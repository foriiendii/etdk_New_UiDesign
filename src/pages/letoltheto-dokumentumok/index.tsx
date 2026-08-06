import { queryFiles } from "@lib/queries";
import { getClient } from "@lib/sanity";

type Props = {
  files: {
    url: string;
    name: string;
  }[];
};

const LetolthetoDokumentumok = ({ files }: Props) => {
  return (
    <div className="relative flex min-h-[100vh] min-w-full flex-col bg-lightGray px-6 pb-6 pt-[100px] text-black  md:px-10 md:pb-10 lg:bg-primaryLight ">
      {files && files.length > 0 ? (
        <div className="flex flex-col items-center justify-center space-y-4 p-6 lg:bg-lightGray">
          {files.map((file) => (
            <div
              key={file.name}
              className="w-fit rounded-lg bg-primaryLight px-4 py-2 text-white"
            >
              <a target="_blank" href={file.url} rel="noreferrer">
                {file.name}{" "}
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <p className="text-primaryLight lg:text-white">
            Nincsenek letölthető dokumentumok
          </p>
        </div>
      )}
    </div>
  );
};

export async function getServerSideProps({ preview = false }) {
  const files = await getClient(preview).fetch(queryFiles);
  return {
    props: {
      files: files[0].files,
      preview,
    },
  };
}

export default LetolthetoDokumentumok;
