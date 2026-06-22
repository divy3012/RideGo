"use client";
import { getSocket } from "@/lib/socket";
import { AppDispatch, RootState } from "@/redux/store";
import { setUserData } from "@/redux/userSlice";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Bike, Car, ChevronRight, LogOut, Menu, Truck, X } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthModel from "./AuthModel";

function Navbar() {
  const pathName = usePathname();
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { userData } = useSelector((state: RootState) => state.user);
  const [pendingCount, setPendingCount] = useState(0);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const handleLogout = async () => {
    await signOut({ redirect: false });
    dispatch(setUserData(null));
    setProfileOpen(false);
  };

  const fetchCount = async () => {
    try {
      const { data } = await axios.get(
        "/api/partner/booking/pending-request-count",
      );
      console.log(data);
      setPendingCount(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userData?.role == "partner") {
      fetchCount();
    }
  }, [userData?.role]);

  useEffect(() => {
    const socket = getSocket();
    socket.on("new-booking", (data) => {
      setPendingCount((prev) => prev + 1);
    });
    return () => {
      socket.off("new-booking");
    };
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: 0 }}
        className=" fixed  left-1/2 -translate-x-1/2 w-full z-50  bg-[#080808] text-white shadow-[0_15px_50px_rgba(0,0,0,0.7)] h-20 rounded-bl-2xl"
      >
        <div className="max-w-7xl  mx-auto px-4 md:px-8 flex items-center justify-between ">
          <Image src="/logo.png" alt="Logo" height={50} width={180} />
          <div className=" hidden md:flex items-center gap-10 ">
            {userData?.role == "partner" ? (
              <>
                <Link
                  className=" text-gray-300 text-sm font-medium relative hover:text-white transition"
                  href={"/"}
                >
                  Home
                </Link>
                <Link
                  className=" text-gray-300 text-sm font-medium relative hover:text-white transition"
                  href={"/partner/pending-requests"}
                >
                  Pending Requests
                  <span className=" absolute -top-2 -right-5 w-6 h-6 rounded-full font-bold text-xs flex items-center justify-cent bg-white text-black">
                    {pendingCount ?? 0}
                  </span>
                </Link>
                <Link
                  className=" text-gray-300 text-sm font-medium relative hover:text-white transition"
                  href={"/partner/bookings"}
                >
                  Booking
                </Link>
                <Link
                  className=" text-gray-300 text-sm font-medium relative hover:text-white transition"
                  href={"/partner/active-ride"}
                >
                  Active Ride
                </Link>
              </>
            ) : null}
          </div>
          <div className="flex items-center gap-3 relative">
            <div className=" hidden md:block relative ">
              {!userData ? (
                <button
                  className="px-4 py-1.5 rounded-full bg-white text-black text-sm "
                  onClick={() => setAuthOpen(true)}
                >
                  Login
                </button>
              ) : (
                <>
                  <button
                    className="w-11 h-11 rounded-full bg-white text-black font-bold"
                    onClick={() => setProfileOpen((p) => !p)}
                  >
                    {userData?.name?.charAt(0)?.toUpperCase() || "U"}
                  </button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-14 right-0 w-75  bg-white text-black rounded-2xl shadow-xl border"
                      >
                        <div className="p-5">
                          <p className="text-lg whitespace-nowrap overflow-hidden text-ellipsis font-semibold">
                            {userData?.name}{" "}
                          </p>
                          <p className="text-xs uppercase mb-4 text-gray-400">
                            {userData.role}{" "}
                          </p>
                          {userData.role != "partner" && (
                            <div
                              className="w-full flex items-center gap-3 pb-3 pt-3 pl-3 hover:bg-gray-100 rounded-xl whitespace-nowrap "
                              onClick={() => router.push("/user/bookings")}
                            >
                              Bookings
                              <ChevronRight size={16} className="ml-auto" />
                            </div>
                          )}
                          {userData.role != "partner" && (
                            <div
                              className="w-full flex items-center gap-3 py-3 hover:bg-gray-100 rounded-xl whitespace-nowrap"
                              onClick={() =>
                                router.push("/partner/onboarding/vehicle")
                              }
                            >
                              <div className="flex space-x-2">
                                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                                  <Bike size={16} />
                                </div>
                                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                                  <Car size={16} />
                                </div>
                                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                                  <Truck size={16} />
                                </div>
                              </div>
                              Become a Partner
                              <ChevronRight size={16} className="ml-auto" />
                            </div>
                          )}
                          <button
                            className="w-full flex items-center gap-3 py-3 rounded-xl hover:bg-gray-100 mt-2"
                            onClick={handleLogout}
                          >
                            <LogOut size={16} /> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>
            <div className=" md:hidden ">
              {!userData ? (
                <button
                  className="px-4 py-1.5 rounded-full bg-white text-black text-sm "
                  onClick={() => setAuthOpen(true)}
                >
                  Login
                </button>
              ) : (
                <>
                  <button
                    className="w-11 h-11 rounded-full bg-white text-black font-bold"
                    onClick={() => setProfileOpen((p) => !p)}
                  >
                    {userData?.name?.charAt(0)?.toUpperCase() || "U"}
                  </button>
                </>
              )}
            </div>
            {userData?.role === "partner" && (
              <button
                className=" md:hidden text-white "
                onClick={() => setMenuOpen((p) => !p)}
              >
                {menuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            )}
          </div>
        </div>
      </motion.div>
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className=" fixed inset-0 bg-black z-30 md:hidden "
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className=" fixed top-21.25 left-1/2 -translate-x-1/2 w-[92%] bg-[#0B0B0B] rounded-2xl shadow-2xl z-40 overflow-hidden md:hidden "
            >
              <div className="flex flex-col divide-y divide-white/10">
                <Link
                  href="/"
                  className="px-5 py-4 text-gray-300"
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </Link>

                <Link
                  href="/partner/pending-requests"
                  className="px-5 py-4 text-gray-300 flex justify-between"
                  onClick={() => setMenuOpen(false)}
                >
                  <span>Pending Requests</span>
                  <span className="min-w-6 h-6 bg-white text-black text-xs font-bold rounded-full flex items-center justify-center">
                    {pendingCount}
                  </span>
                </Link>

                <Link
                  href="/partner/bookings"
                  className="px-5 py-4 text-gray-300"
                  onClick={() => setMenuOpen(false)}
                >
                  Bookings
                </Link>

                <Link
                  href="/partner/active-ride"
                  className="px-5 py-4 text-gray-300"
                  onClick={() => setMenuOpen(false)}
                >
                  Active Ride
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {profileOpen && userData && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className=" fixed inset-0 bg-black z-30 md:hidden "
              onClick={() => setProfileOpen(false)}
            />
            <motion.div
              initial={{ y: 400 }}
              animate={{ y: 0 }}
              exit={{ y: 400 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl z-50 md:hidden"
            >
              <div className="p-5">
                <p className="text-lg whitespace-nowrap overflow-hidden text-ellipsis font-semibold">
                  {userData?.name}{" "}
                </p>
                <p className="text-xs uppercase mb-4 text-gray-400">
                  {userData.role}{" "}
                </p>
                {userData.role != "partner" && (
                  <div
                    className="w-full flex items-center gap-3 py-0 pl-3 pb-3 pt-3 hover:bg-gray-100 rounded-xl whitespace-nowrap"
                    onClick={() => router.push("/user/bookings")}
                  >
                    Bookings
                    <ChevronRight size={16} className="ml-auto" />
                  </div>
                )}
                {userData.role != "partner" && (
                  <div
                    className="w-full flex items-center gap-3 py-3 hover:bg-gray-100 rounded-xl whitespace-nowrap"
                    onClick={() => router.push("/partner/onboarding/vehicle")}
                  >
                    <div className="flex space-x-2">
                      <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                        <Bike size={16} />
                      </div>
                      <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                        <Car size={16} />
                      </div>
                      <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                        <Truck size={16} />
                      </div>
                    </div>
                    Become a Partner
                    <ChevronRight size={16} className="ml-auto" />
                  </div>
                )}
                <button
                  className="w-full flex items-center gap-3 py-3 rounded-xl hover:bg-gray-100 mt-2"
                  onClick={handleLogout}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AuthModel open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}

export default Navbar;
