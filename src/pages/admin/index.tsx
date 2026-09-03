import { LockClosedIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getProviders, getSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ETDKFeher from "../../../public/ETDKfeher.png";

const AdminLogin = ({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (router.query.error) {
      setTimeout(() => toast.error("Ez a felhasználó nem létezik"), 1000);
    }
  }, [router]);

  return (
    <div className="grid min-h-screen-safe bg-[#f5f1ed] lg:grid-cols-[0.9fr_1.1fr]">
      <div className="relative hidden overflow-hidden bg-[#2c1728] p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-20">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-[#d4af6a]/30" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full border border-[#e7a9b4]/20" />
        <div className="relative max-w-md">
          <span className="block font-open text-xs font-bold uppercase tracking-[0.28em] text-[#d4af6a]">ETDK / 2026</span>
          <h1 className="mt-5 font-bebas text-8xl uppercase leading-[0.86] tracking-[0.02em] text-[#f4ece9]">Szervezői<br />felület</h1>
        </div>
        <Link href="/" className="relative flex items-end gap-3">
          <Image src={ETDKFeher} alt="ETDK logo" width={44} height={44} />
          <span className="font-bebas text-3xl tracking-[0.08em]">ETDK</span>
        </Link>
      </div>
      <div className="flex items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-[440px]">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <Image src={ETDKFeher} alt="ETDK logo" width={38} height={38} className="rounded-full bg-[#2c1728] p-1" />
            <span className="font-bebas text-2xl tracking-[0.08em] text-[#2c1728]">ETDK ADMIN</span>
          </div>
          <div className="mb-9">
            <p className="font-open text-xs font-bold uppercase tracking-[0.18em] text-[#a58d90]">Üdv újra</p>
            <h2 className="mt-2 font-bebas text-5xl uppercase leading-none tracking-[0.02em] text-[#2c1728]">Bejelentkezés</h2>
            <p className="mt-3 font-open text-sm leading-6 text-[#766561]">Lépj be a feladatodhoz tartozó admin felületre.</p>
          </div>
          {Object.values(
            providers || {
              credentials: { id: "credentials", name: "E-mail és jelszó" },
            }
          ).map((provider) => (
              <React.Fragment key={provider.id}>
                {provider.id === "credentials" ? (
                  <div className="w-full space-y-5">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="email-address" className="sr-only">
                          E-mail
                        </label>
                        <input
                          id="email-address"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          className="font-open relative block w-full rounded-lg border border-[#2c1728]/15 bg-white px-4 py-3 text-sm text-[#2c1728] outline-none placeholder:text-[#a58d90] focus:border-[#d4af6a] focus:ring-2 focus:ring-[#d4af6a]/20"
                          placeholder="E-mail"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div>
                        <label htmlFor="password" className="sr-only">
                          Jelszó
                        </label>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          autoComplete="current-password"
                          required
                          className="font-open relative block w-full rounded-lg border border-[#2c1728]/15 bg-white px-4 py-3 text-sm text-[#2c1728] outline-none placeholder:text-[#a58d90] focus:border-[#d4af6a] focus:ring-2 focus:ring-[#d4af6a]/20"
                          placeholder="Jelszó"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <button
                        onClick={() => {
                          if (email !== "" && password !== "") {
                            signIn("credentials", {
                              email,
                              password,
                            });
                          } else {
                            toast.error("Minden mező kötelező");
                          }
                        }}
                        className="group relative flex w-full justify-center rounded-lg bg-[#2c1728] py-3 px-3 font-open text-sm font-semibold text-white transition-colors hover:bg-[#4a2940] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                      >
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <LockClosedIcon
                            className="h-5 w-5 text-[#d4af6a]"
                            aria-hidden="true"
                          />
                        </span>
                        Bejelentkezés
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 w-full">
                    <button
                      key={provider.id}
                      onClick={() => signIn(provider.id)}
                      className="w-full rounded-lg border border-[#2c1728]/15 bg-white px-4 py-3 font-open text-sm font-semibold text-[#2c1728] transition-colors hover:border-[#2c1728] hover:bg-[#2c1728] hover:text-white"
                    >
                      Folytatás Google-lel
                    </button>
                  </div>
                )}
              </React.Fragment>
            ))}
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(
  ctx: GetServerSidePropsContext | undefined
) {
  const providers = await getProviders();
  const session = await getSession(ctx);
  if (session?.user) {
    if (
      session.user.role === "superadmin" ||
      session.user.role === "data_checker"
    ) {
      return {
        redirect: {
          destination: "/admin/ellenorzes",
          permanent: false,
        },
      };
    }
    if (session.user.role !== "participant") {
      return {
        redirect: {
          destination: "/admin/pontozas",
          permanent: false,
        },
      };
    }
    return {
      redirect: {
        destination: "/admin/jelentkezes",
        permanent: false,
      },
    };
  }
  return {
    props: { providers },
  };
}

export default AdminLogin;
