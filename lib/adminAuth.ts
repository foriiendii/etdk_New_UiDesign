import { adminSections } from "@lib/queries";
import { getClient } from "@lib/sanity";
import { getSession } from "next-auth/react";
import type { NextApiRequest } from "next";

export type AdminRole =
  | "superadmin"
  | "data_checker"
  | "scorer"
  | "section_closer"
  | "participant";

export type ApiUser = {
  email: string;
  role: AdminRole;
};

export const getApiUser = async (
  req: NextApiRequest
): Promise<ApiUser | null> => {
  const session = await getSession({ req });
  const email = session?.user?.email;
  const role = session?.user?.role;

  if (!email || !role) return null;

  return { email, role: role as AdminRole };
};

export const hasRole = (user: ApiUser, roles: AdminRole[]) =>
  roles.includes(user.role);

export const hasSectionAccess = async (
  user: ApiUser,
  sectionId: string
) => {
  if (user.role === "superadmin") return true;
  if (user.role !== "scorer" && user.role !== "section_closer") return false;

  const admins = await getClient(true).fetch(adminSections(user.email));
  const sections = admins?.[0]?.sections || [];
  return sections.some((section: { _ref?: string }) => section._ref === sectionId);
};