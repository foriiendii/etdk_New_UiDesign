/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  checkIfAdmin,
  checkIfCredentialsOk,
  checkIfUniqueEmail,
} from "@lib/queries";
import { getClient } from "@lib/sanity";
import NextAuth from "next-auth";
import { SessionStrategy } from "next-auth/core/types";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextApiRequest, NextApiResponse } from "next";

export const authOptions = (_req: NextApiRequest, res: NextApiResponse) => ({
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 24 * 60 * 60,
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "text", label: "E-mail" },
        password: { type: "password", label: "Jelszó" },
      },
      authorize: async (credentials) => {
        if (credentials) {
          const userData = await getClient().fetch(
            checkIfCredentialsOk(credentials.email, credentials.password)
          );
          if (!userData.length) {
            res.status(401);
            throw Error("AccessDenied");
          }

          return userData[0];
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/admin",
    error: "/admin",
  },
  callbacks: {
    signIn: async ({ user }: { user: any }) => {
      const participant = await getClient().fetch(
        checkIfUniqueEmail(user.email)
      );
      const admin = await getClient().fetch(checkIfAdmin(user.email));

      if (!participant.length && !admin.length) {
        return false;
      }
      if (participant.length) {
        user.role = "participant";
      } else {
        user.role = admin[0].role;
      }
      return true;
    },
    jwt: ({ token, user }: { token: any; user?: any }) => {
      if (user) {
        token.role = user.role;
        delete token.image;
      }
      return token;
    },
    session: ({ session, token }: { token: any; session: any }) => {
      if (token) {
        session.user.role = token.role;
        delete session.user.image;
      }
      return session;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return `${baseUrl}/admin`;
    },
  },
});
// eslint-disable-next-line import/no-anonymous-default-export
export default (req: NextApiRequest, res: NextApiResponse) => {
  return NextAuth(req, res, authOptions(req, res));
};
