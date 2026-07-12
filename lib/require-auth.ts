import { GetServerSidePropsContext } from "next";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "./auth";

/**
 * À utiliser dans getServerSideProps de toute page protégée :
 *
 *   export const getServerSideProps = async (ctx) => {
 *     const session = await exigerConnexion(ctx);
 *     if ("redirect" in session) return session;
 *     // ... utiliser session.session.user.id
 *   };
 */
export async function exigerConnexion(
  ctx: GetServerSidePropsContext
): Promise<{ session: Session } | { redirect: { destination: string; permanent: false } }> {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (!session) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  return { session };
}
