import { connectMongoDB } from "../../../../../lib/mongodb";

import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import Teacher from "../../../../../models/teacher";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          await connectMongoDB();
          const teacher = await Teacher.findOne({ email });

          if (!teacher) {
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, teacher.password);

          if (!passwordsMatch) {
            return null;
          }

          console.log("Al min data fisk", teacher);
          return teacher;
        } catch (error) {
          console.log("Error: ", error);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
