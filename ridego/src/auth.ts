import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import connectDB from "./lib/db";
import User from "./models/user.model";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****",
        },
      },
      async authorize(credentials) {
        if (!credentials.email || !credentials.password) {
          throw Error("missing email or password");
        }
        const email = credentials.email;
        const password = credentials.password as string;
        await connectDB();
        const user = await User.findOne({ email });

        if (!user) {
          throw Error("User does not extist");
        }
        if (!user.password) {
          throw new Error("Password field missing");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw Error("Invalid Password");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role.trim(),
        };
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider == "google") {
        await connectDB();
        let dbUser = await User.findOne({ email: user.email });

        if (!dbUser) {
          dbUser = await User.create({
            name: user.name,
            email: user.email,
            isEmailVerified: true,
          });
        }
        user.id = dbUser._id.toString();
        user.role = dbUser.role.trim();
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name;
        token.id = user.id;
        token.email = user.email;
        token.role = user.role.trim();
      }
      return token;
    },
    async session({ token, session }) {
      if (session.user) {
        session.user.name = token.name;
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = (token.role as string).trim();
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 10 * 24 * 60 * 60,
  },
  secret: process.env.BETTER_AUTH_SECRET,
});
