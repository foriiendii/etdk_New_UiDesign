import {
  ArrowLeftIcon,
  ClipboardDocumentCheckIcon,
  DocumentTextIcon,
  PowerIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { signOut, useSession } from "next-auth/react";
import ETDKFeher from "../../public/ETDKfeher.png";

type AdminShellProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

const roleLabels: Record<string, string> = {
  superadmin: "Superadmin",
  data_checker: "Data checker",
  scorer: "Scorer",
  section_closer: "Section closer",
  participant: "Participant",
};

const AdminShell = ({ title, description, children }: AdminShellProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const role = session?.user.role?.trim().toLowerCase() || "participant";
  const canCheck = role === "superadmin" || role === "data_checker";
  const canScore =
    role === "superadmin" || role === "scorer" || role === "section_closer";
  const links = [
    ...(canCheck
      ? [
          {
            href: "/admin/ellenorzes",
            label: "Jelentkezések",
            detail: "Adatok ellenőrzése",
            icon: ClipboardDocumentCheckIcon,
          },
        ]
      : []),
    ...(canScore
      ? [
          {
            href: "/admin/pontozas",
            label: "Pontozás",
            detail: "Szekciók és értékelések",
            icon: StarIcon,
          },
        ]
      : []),
    ...(role === "participant"
      ? [
          {
            href: "/admin/jelentkezes",
            label: "Jelentkezésem",
            detail: "Adatok és dokumentumok",
            icon: DocumentTextIcon,
          },
        ]
      : []),
  ];

  return (
    <div className="admin-ui min-h-screen-safe bg-[#f5f1ed] text-[#2c1728]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[272px] flex-col bg-[#2c1728] px-6 py-7 text-white lg:flex">
        <Link href="/" className="flex items-center gap-3 border-b border-white/10 pb-8">
          <Image src={ETDKFeher} alt="ETDK logo" width={38} height={38} />
          <div>
            <span className="block font-bebas text-2xl tracking-[0.08em] text-[#f4ece9]">ETDK</span>
            <p className="font-open text-[10px] uppercase tracking-[0.2em] text-white/45">Admin felület</p>
          </div>
        </Link>

        <div className="pt-9">
          <p className="font-open text-[10px] font-bold uppercase tracking-[0.18em] text-[#d4af6a]">Munkaterület</p>
          <nav className="mt-4 space-y-2">
            {links.map(({ href, label, detail, icon: Icon }) => {
              const active = router.pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-3 transition-colors ${
                    active ? "bg-white/12 text-white" : "text-white/60 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  <Icon className={`h-5 w-5 shrink-0 ${active ? "text-[#d4af6a]" : "text-white/45"}`} />
                  <span className="block font-open text-sm font-semibold">{label}<small className="mt-0.5 block font-normal text-white/40">{detail}</small></span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-white/10 pt-5">
          <div className="mb-4 px-3">
            <p className="truncate font-open text-sm text-white/85">{session?.user.email}</p>
            <p className="mt-1 font-open text-xs text-[#d4af6a]">{roleLabels[role] || role}</p>
          </div>
          <button onClick={() => signOut()} className="flex w-full items-center gap-3 rounded-lg px-3 py-3 font-open text-sm text-white/60 transition-colors hover:bg-white/8 hover:text-white">
            <PowerIcon className="h-5 w-5" />
            Kijelentkezés
          </button>
        </div>
      </aside>

      <div className="lg:pl-[272px]">
        <header className="sticky top-0 z-30 border-b border-[#2c1728]/10 bg-[#f5f1ed]/95 px-5 py-3 backdrop-blur-md sm:px-8 lg:px-12">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/" className="lg:hidden"><ArrowLeftIcon className="h-5 w-5" /></Link>
              <div>
                <p className="font-open text-[10px] font-bold uppercase tracking-[0.18em] text-[#a58d90]">ETDK admin</p>
                <h1 className="font-bebas text-3xl uppercase tracking-[0.03em] leading-none text-[#2c1728]">{title}</h1>
              </div>
            </div>
            <div className="hidden text-right sm:block">
              <p className="font-open text-xs text-[#766561]">Bejelentkezve mint</p>
              <p className="font-open text-sm font-semibold text-[#2c1728]">{roleLabels[role] || role}</p>
            </div>
          </div>
          <nav className="mx-auto mt-4 flex max-w-[1440px] gap-2 overflow-x-auto lg:hidden">
            {links.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 font-open text-xs font-semibold ${router.pathname === href ? "border-[#2c1728] bg-[#2c1728] text-white" : "border-[#2c1728]/15 text-[#766561]"}`}>
                <Icon className="h-4 w-4" />{label}
              </Link>
            ))}
            <button onClick={() => signOut()} className="flex shrink-0 items-center gap-2 rounded-full border border-[#2c1728]/15 px-3 py-2 font-open text-xs font-semibold text-[#766561]"><PowerIcon className="h-4 w-4" />Kilépés</button>
          </nav>
        </header>
        <main className="mx-auto -mt-2 max-w-[1440px] px-5 py-2 sm:px-8 lg:px-12 lg:py-3">
          {description && (
            <p className="mb-8 max-w-2xl font-open text-sm leading-6 text-[#766561]">{description}</p>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminShell;