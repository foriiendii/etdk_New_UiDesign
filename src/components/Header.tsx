import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { isAfter, parseISO } from "date-fns";
import Image from "next/image";
import { Fragment, useState } from "react";
import LinkWrapper from "./UtilityComponents/LinkWrapper";
import { SanityDeadlines } from "types";
import { queryAllDeadline } from "@lib/queries";
import { getClient } from "@lib/sanity";
import useSWR from "swr";
import Link from "next/link";
import ETDKFeher from "../../public/ETDKfeher.png";

const WINE = "var(--color-primary-dark, #2c1728)";
const GOLD = "var(--color-primary-light, #d4af6a)";
const BLUSH = "var(--color-secondary, #e7a9b4)";

const getDeadlines = async () => {
  const deadlines = await getClient().fetch(queryAllDeadline);
  return deadlines[0];
};

const Header = () => {
  const [openMobileDialog, setOpenMobileDialog] = useState(false);
  const { data: deadlines, isLoading } = useSWR<SanityDeadlines>(
    ["deadlines"],
    async () => await getDeadlines()
  );

  const links = [
    { title: "Tudnivalók", id: "#altalanos_tudnivalok" },
    { title: new Date().getFullYear().toString(), id: "#aktualis_ev" },
    { title: "Igazolás kérése", id: "https://kmdsz.ro/#contact" },
    { title: "Hírek", id: "#hirek" },
    { title: "Archívum", id: "#archivum" },
    { title: "Támogatók", id: "#tamogatok" },
    { title: "Kapcsolat", id: "#kapcsolat" },
  ];

  const afterApplicationStart = deadlines?.applicationStart
    ? isAfter(new Date(), parseISO(`${deadlines.applicationStart}T23:59:59`))
    : false;
  const afterApplicationEnd = deadlines?.applicationEnd
    ? isAfter(new Date(), parseISO(`${deadlines.applicationEnd}T23:59:59`))
    : false;
  const afterUploadStart = deadlines?.documentUploadStart
    ? isAfter(new Date(), parseISO(`${deadlines.documentUploadStart}T23:59:59`))
    : false;
  const afterUploadEnd = deadlines?.documentUploadEnd
    ? isAfter(new Date(), parseISO(`${deadlines.documentUploadEnd}T23:59:59`))
    : false;

  const application =
    afterApplicationStart && !afterApplicationEnd
      ? { label: "Jelentkezés", href: "/jelentkezes" }
      : afterUploadStart && !afterUploadEnd
      ? { label: "Bejelentkezés", href: "/admin" }
      : null;

  return (
    <div
      className="fixed top-0 z-30 w-full border-b border-[rgba(255,255,255,0.1)]"
      style={{ backgroundColor: WINE }}
    >
      <div className="mx-auto flex h-[80px] w-full max-w-[1600px] items-center justify-between px-5 lg:px-11">
        <LinkWrapper href="#general">
          <div className="flex items-center gap-2.5 hover:cursor-pointer">
            <Image src={ETDKFeher} alt="ETDK logo" width={32} height={32} />
            <span className="font-bebas text-2xl tracking-[0.05em] text-[#f4ece9]">ETDK</span>
          </div>
        </LinkWrapper>

        <div className="flex flex-1 items-center justify-end lg:hidden">
          <button
            className="inline-flex items-center justify-center p-2 text-white"
            onClick={() => setOpenMobileDialog(true)}
          >
            <Bars3Icon className="h-8 w-8" aria-hidden="true" />
          </button>
        </div>

        <nav className="hidden flex-1 items-center justify-end gap-9 lg:flex xl:gap-10">
          {links.map((link, index) => (
            <LinkWrapper key={index} href={link.id || ""}>
              <span
                className="font-bebas group relative cursor-pointer whitespace-nowrap text-[19px] uppercase tracking-[0.04em] text-[rgba(255,255,255,0.8)] transition-colors duration-200 hover:text-[var(--color-secondary,#e7a9b4)]"
              >
                {link.title}
                <span
                  className="absolute -bottom-1 left-0 h-px w-0 transition-all duration-300 group-hover:w-full"
                  style={{ backgroundColor: GOLD }}
                />
              </span>
            </LinkWrapper>
          ))}
          {application && !isLoading && (
            <Link href={application.href}>
              <button
                type="button"
                className="font-bebas rounded-full border px-7 py-2.5 text-base uppercase tracking-[0.04em] transition-colors duration-200"
                style={{ borderColor: GOLD, color: GOLD }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = GOLD;
                  e.currentTarget.style.color = WINE;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = GOLD;
                }}
              >
                {application.label}
              </button>
            </Link>
          )}
        </nav>
      </div>

      <Transition.Root show={openMobileDialog} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setOpenMobileDialog}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-[rgba(0,0,0,0.7)]" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-300"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-300"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel
                className="fixed inset-y-0 right-0 flex h-full w-full flex-col justify-between overflow-y-auto border-l border-[rgba(255,255,255,0.1)] px-6 py-6"
                style={{
                  backgroundColor: WINE,
                  // Keeps the bottom button clear of the iOS home indicator.
                  paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-open text-xs uppercase tracking-[0.25em] text-[rgba(255,255,255,0.45)]">
                    Menü
                  </span>
                  <button
                    type="button"
                    className="text-white"
                    onClick={() => setOpenMobileDialog(false)}
                  >
                    <XMarkIcon className="h-8 w-8" aria-hidden="true" />
                  </button>
                </div>

                {/* No `min-h-0` here on purpose: it would let this block shrink
                    below its content, and `justify-center` would then push the
                    first links above the scroll origin where they're unreachable. */}
                <div className="my-6 flex flex-1 flex-col justify-center gap-1">
                  {links.map((link, index) => (
                    <LinkWrapper key={index} href={link.id || ""}>
                      <div
                        className="border-b border-[rgba(255,255,255,0.1)] py-4"
                        onClick={() => setOpenMobileDialog(false)}
                      >
                        <span className="font-bebas text-[26px] uppercase tracking-[0.03em] text-white sm:text-3xl">
                          {link.title}
                        </span>
                      </div>
                    </LinkWrapper>
                  ))}
                </div>

                <div>
                  {application && !isLoading && (
                    <Link href={application.href}>
                      <button
                        type="button"
                        className="font-bebas w-full rounded-full border py-4 text-center text-base tracking-wide"
                        style={{ borderColor: GOLD, color: GOLD }}
                        onClick={() => setOpenMobileDialog(false)}
                      >
                        {application.label}
                      </button>
                    </Link>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default Header;