"use client";

import { getSocket } from "@/lib/socket";
import { BookingStatus, PaymentStatus } from "@/models/booking.model";
import axios from "axios";
import { motion } from "framer-motion";
import { Clock, IndianRupee, Loader2, MapPin, Navigation } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface IBooking {
  _id: string;
  user: string;
  driver: string;
  vehicle: string;
  pickUpAddress: string;
  dropAddress: string;
  pickUpLocation: {
    type: "Point";
    coordinates: [number, number];
  };
  dropLocation: {
    type: "Point";
    coordinates: [number, number];
  };
  fare: number;
  userMobileNumber: string;
  driverMobileNumber: string;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  adminCommission: number;
  partnerAmount: number;
  pickUpOtp: string;
  pickUpOtpExpire: Date;
  dropOtp: string;
  paymentDeadline: Date;
  dropOtpExpire: Date;
  createdAt: Date;
  updatedAt: Date;
}

function page() {
  const router = useRouter();
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/partner/booking/pending");
      setBookings(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const socket = getSocket();
    socket.on("new-booking", (data) => {
      setBookings((prev) => [...prev, data]);
    });
    return () => {
      socket.off("new-booking");
    };
  }, []);

  const handleAccceptBooking = async (id: string) => {
    try {
      const { data } = await axios.get(`/api/partner/booking/${id}/accept`);
      router.push("/partner/bookings");
    } catch (error) {
      console.log(error);
    }
  };

  const handleRejectBooking = async (id: string) => {
    try {
      const { data } = await axios.get(`/api/partner/booking/${id}/reject`);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);
  return (
    <div className=" min-h-screen bg-[#f4f5f7]">
      <div className=" bg-white border-b border-gray-200">
        <div className=" max-w-6xl mx-auto px-6 py-16">
          <h1 className=" text-4xl font-semibold text-gray-900">
            Ride Requests
          </h1>
          <p className="mt-3 text-gray-500 text-lg">
            Manage incoming ride requests and respond in real time.
          </p>
        </div>
      </div>
      <div className=" max-w-6xl mx-auto px-6 py-12">
        {loading ? (
          <div className=" flex justify-center py-20">
            <Loader2 className=" animate-spin w-8 h-8 text-gray-700" />
          </div>
        ) : bookings.length == 0 ? (
          <div className=" bg-white rounded-2xl text-center shadow-sm border border-gray-200 p-16">
            <p className=" text-gray-500 text-lg">No pending ride requests.</p>
          </div>
        ) : (
          <div className=" space-y-6">
            {bookings.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.25 }}
                className=" bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                  <div className=" flex-1 space-y-6">
                    <div className="flex gap-4">
                      <div className=" bg-gray-100 rounded-lg p-3 flex items-center justify-center">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className=" text-xs uppercase mb-1 text-gray-400">
                          Pickup Location
                        </p>
                        <p className=" text-gray-900 font-medium">
                          {b.pickUpAddress}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className=" bg-gray-100 rounded-lg p-3 flex items-center justify-center">
                        <Navigation size={18} />
                      </div>
                      <div>
                        <p className=" text-xs uppercase mb-1 text-gray-400">
                          Drop Location
                        </p>
                        <p className=" text-gray-900 font-medium">
                          {b.dropAddress}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                      <Clock size={14} className=" opacity-70" />
                      <span className=" font-medium">
                        {new Date(b.createdAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between lg:items-center gap-6 flex-col w-full lg:w-auto">
                    <div className=" text-left lg:text-right">
                      <p className=" text-xs text-gray-400 uppercase tracking-wide mb-1">
                        Estimated Fare
                      </p>
                      <div className="flex items-center gap-2 lg:justify-end text-3xl font-bold text-gray-900">
                        <IndianRupee size={20} />
                        {b.fare}
                      </div>
                    </div>
                    <div className="flex gap-4 w-full lg:w-auto">
                      <button
                        className=" flex-1 lg:flex-none px-6 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-100 transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
                        onClick={() => handleRejectBooking(b._id)}
                      >
                        Reject
                      </button>
                      <button
                        className=" flex-1 lg:flex-none px-8 py-3 rounded-xl bg-black text-white text-sm font-semibold hover:bg-gray-900 shadow-sm hover:shadow-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center whitespace-nowrap"
                        onClick={() => handleAccceptBooking(b._id)}
                      >
                        Accept Ride
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default page;
