import { auth } from "@/auth";
import AdminDashboard from "@/components/AdminDashboard";
import Footer from "@/components/Footer";
import GeoUpdater from "@/components/GeoUpdater";
import Navbar from "@/components/Navbar";
import PartnerDashboard from "@/components/PartnerDashboard";
import PublicHome from "@/components/PublicHome";
import connectDB from "@/lib/db";
import User from "@/models/user.model";

export default async function Home() {
  const session = await auth();

  await connectDB();
  let user = await User.findOne({ email: session?.user?.email });

  const plainUser = JSON.parse(JSON.stringify(user));

  return (
    <div className="w-full min-h-screen bg-white ">
      {user?._id && <GeoUpdater userId={plainUser._id} />}
      {plainUser?.role === "partner" ? (
        <>
          <Navbar />
          <PartnerDashboard />
        </>
      ) : plainUser?.role === "admin" ? (
        <AdminDashboard />
      ) : (
        <>
          <Navbar />
          <PublicHome />
        </>
      )}
      <Footer />
    </div>
  );
}
