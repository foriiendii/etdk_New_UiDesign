import { LockClosedIcon } from "@heroicons/react/24/outline";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getProviders, getSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

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
    <div className="flex min-h-[100vh] min-w-full flex-col items-center justify-center space-y-4 bg-white p-4">
      <div className="flex w-full items-center justify-center rounded-lg bg-gray-100 p-6 sm:w-[400px]">
        <div className="flex h-full w-full flex-col items-center justify-center space-y-6">
          <p className="text-2xl font-semibold text-primaryDark">
            Bejelentkezés
          </p>
          {providers &&
            Object.values(providers).map((provider) => (
              <React.Fragment key={provider.id}>
                {provider.id === "credentials" ? (
                  <div className="w-full space-y-6">
                    <div className="space-y-6 rounded-md shadow-sm">
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
                          className="relative block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primaryLight sm:text-sm sm:leading-6"
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
                          className="relative block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primaryLight sm:text-sm sm:leading-6"
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
                        className="group relative flex w-full justify-center rounded-md bg-primaryLight py-2 px-3 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                      >
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <LockClosedIcon
                            className="h-5 w-5 text-beige"
                            aria-hidden="true"
                          />
                        </span>
                        Bejelentkezés
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <button
                      key={provider.id}
                      onClick={() => signIn(provider.id)}
                      className="rounded-xl bg-primaryDark px-4 py-2 text-white"
                    >
                      Folytatás {provider.name}-al
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
