import Image from "next/image";
import type { SanityArchiv, SanityNews } from "types";
import Link from "next/link";
import GetImage from "@utils/getImage";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import RichText from "@utils/RichText";
import { isAfter, parseISO } from "date-fns";
import { XMarkIcon } from "@heroicons/react/20/solid";
import Hullam1 from "../../public/hullam1.png";

const NewsArchiv = ({
  news,
  archivs,
}: {
  news: SanityNews[];
  archivs: SanityArchiv[];
}) => {
  const [openNewsDialog, setOpenNewsDialog] = useState(false);
  const [activeNews, setActiveNews] = useState<SanityNews>();
  return (
    <div className="relative flex min-h-[100vh] flex-col justify-center gap-24 bg-grayCustom py-8 lg:pb-24">
      <div>
        <div id="hirek" className="absolute -top-[70px]" />
        <div className="flex flex-col items-center justify-center gap-8">
          <div>
            <span className="text-7xl text-primaryDark">Hírek</span>
          </div>
          <div className="flex flex-col flex-wrap items-center justify-evenly gap-10 sm:flex-row">
            {news
              .sort((a, b) =>
                isAfter(parseISO(b.date), parseISO(a.date)) ? 1 : -1
              )
              .map((newElem, idx) => {
                const imageSettings = newElem.featuredImage
                  ? GetImage(newElem.featuredImage)
                  : undefined;
                return (
                  !isAfter(parseISO(newElem.date), new Date()) && (
                    <div key={newElem.name + idx}>
                      {imageSettings && (
                        <div className="absolute my-auto mx-auto h-72 w-72">
                          <Image
                            loader={imageSettings.loader}
                            src={imageSettings.src}
                            fill
                            alt={`${newElem.name} kep`}
                            className="object-cover"
                            priority
                          />
                        </div>
                      )}
                      <div
                        className={`relative flex h-72 w-72 cursor-pointer flex-col items-center gap-8 bg-white ${
                          imageSettings ? "bg-opacity-60" : ""
                        } p-8`}
                        onClick={() => {
                          setActiveNews(newElem);
                          setOpenNewsDialog(true);
                        }}
                      >
                        <div className="w-36 rounded-2xl bg-lightBrown text-center text-3xl tracking-wide text-yellow-400">
                          <span>{newElem.date}</span>
                        </div>
                        <span className="text-2xl text-primaryLight">
                          {newElem.summary}
                        </span>
                      </div>
                    </div>
                  )
                );
              })}
          </div>
        </div>
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center gap-8">
        <div id="archivum" className="absolute -top-[70px]" />
        <div>
          <span className="text-7xl text-primaryDark">Archívum</span>
        </div>
        <div className="flex flex-col flex-wrap items-center justify-evenly gap-10 sm:flex-row">
          {archivs.map((archivEl) => (
            <Link key={archivEl.year} href={`archivum/${archivEl.year}`}>
              <div className="relative h-11 w-40 cursor-pointer rounded-3xl bg-lightBrown py-2 px-2 text-center text-3xl tracking-wide text-yellow-400">
                <span className="absolute -top-3 right-0 left-0 mx-auto text-7xl">
                  {archivEl.year}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="absolute top-0 right-0 hidden h-28 w-96 lg:block">
        <Image src={Hullam1} alt="hullam" fill />
      </div>
      <div className="absolute bottom-0 left-0 hidden h-28 w-96 lg:block">
        <Image src={Hullam1} alt="hullam" fill />
      </div>
      <Transition.Root show={openNewsDialog} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpenNewsDialog}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="relative flex min-h-full items-center justify-center p-4 text-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative max-h-[500px] transform overflow-x-hidden overflow-y-scroll break-words rounded-lg bg-white p-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  {activeNews && (
                    <>
                      <Dialog.Title className="mb-4 flex justify-end">
                        <button className="cursor-pointer text-slate-700">
                          <XMarkIcon
                            className="h-7 w-7"
                            onClick={() => setOpenNewsDialog(false)}
                          />
                        </button>
                      </Dialog.Title>
                      <div className="prose max-w-none">
                        <RichText blocks={activeNews.description} />
                      </div>
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default NewsArchiv;
