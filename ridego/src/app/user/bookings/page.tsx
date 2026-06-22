"use client";

import { BookingStatus, PaymentStatus } from "@/models/booking.model";
import { IUser } from "@/models/user.model";
import { IVehicle } from "@/models/vehicle.model";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Bike,
  Calendar,
  Car,
  IndianRupee,
  Loader2,
  MapPin,
  Navigation,
  Phone,
  Truck,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CgArrowRight } from "react-icons/cg";

interface IBooking {
  _id: string;
  user: IUser;
  driver: IUser;
  vehicle: IVehicle;
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
  const [bookings, setBookings] = useState<IBooking[] | []>([]);
  const [selectStatus, setSelectStatus] = useState("All");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/api/user/bookings");
        setBookings(data);
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        console.log(error.response.data.message);
      }
    };
    fetch();
  }, []);

  const filterBooking =
    selectStatus === "All"
      ? bookings
      : bookings.filter((b) => b.bookingStatus === selectStatus.toLowerCase());

  const getStatusColor = (status: BookingStatus) => {
    const colors: Record<BookingStatus, string> = {
      idle: "bg-gray-50 text-gray-700 border-gray-200",
      requested: "bg-amber-50 text-amber-700 border-amber-200",
      awaiting_payment: "bg-blue-50 text-blue-700 border-blue-200",
      started: "bg-purple-50 text-purple-700 border-purple-200",
      confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
      completed: "bg-teal-50 text-teal-700 border-teal-200",
      cancelled: "bg-rose-50 text-rose-700 border-rose-200",
      rejected: "bg-red-50 text-red-700 border-red-200",
      expired: "bg-gray-50 text-gray-700 border-gray-200",
    };

    return colors[status];
  };
  const getVehicleIcon = (vehicleType?: string) => {
    switch (vehicleType?.toLowerCase()) {
      case "bike":
        return <Bike className="w-4 h-4 text-gray-400" />;
      case "auto":
        return <Car className="w-4 h-4 text-gray-400" />;
      case "truck":
        return <Truck className="w-4 h-4 text-gray-400" />;
      case "loading":
        return <Truck className="w-4 h-4 text-gray-400" />;
      case "car":
      default:
        return <Car className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(",", "");
  };

  return (
    <div className=" min-h-screen bg-gray-50">
      <div className=" bg-white border-b border-gray-200">
        <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className=" max-w-3xl mx-auto py-6">
            <div className="flex items-center gap-3">
              <div className=" bg-blue-100 p-2 rounded-lg">
                <Car className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className=" font-semibold text-gray-900 text-2xl">
                  My Bookings
                </h1>
                <p className=" text-gray-500 text-sm mt-1">
                  {bookings.length} {bookings.length === 1 ? "ride" : "rides"}{" "}
                  assigned to you{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className=" max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className=" text-sm text-gray-400">
              Showing {filterBooking.length} Bookings
            </div>
            <select
              value={selectStatus}
              onChange={(e) => setSelectStatus(e.target.value)}
              className=" bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All</option>| "idle"
              <option>requested</option>
              <option>awaiting_payment</option>
              <option>started</option>
              <option>confirmed</option>
              <option>completed</option>
              <option>cancelled</option>
              <option>rejected</option>
              <option>expired</option>
            </select>
          </div>
          {loading && (
            <div className="flex justify-center py-16">
              <Loader2 className=" animate-spin w-8 h-8 text-black" />
            </div>
          )}
          {!loading && filterBooking.length === 0 && (
            <div className=" bg-white shadow-sm rounded-xl p-12 text-center">
              <Car className="w-12 h-12 text-gray-300 mb-1 mx-auto" />
              <h1 className=" text-lg font-medium text-gray-900">
                No Booking Yet
              </h1>
              <p className=" text-gray-400 text-sm mt-1">
                when customers book ride,they'll appear here
              </p>
            </div>
          )}
          {!loading && filterBooking.length > 0 && (
            <div className=" space-y-4">
              {filterBooking.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className=" bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
                    <div className="flex items-center gap-3 p-4 bg-linear-to-r from-blue-50 to-indigo-50 border-b border-gray-50">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-200 shrink-0 border-2 border-white shadow-sm flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className=" font-semibold text-gray-900 uppercase">
                            {b.driver.name || "Driver"}
                          </h3>
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(b.bookingStatus)}`}
                          >
                            {b.bookingStatus || "-"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs mt-1 text-gray-400">
                          <Phone className="w-3 h-3" />
                          <span>{b.driverMobileNumber}</span>
                        </div>
                      </div>
                    </div>
                    <div className=" px-4 pt-3">
                      <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                        {getVehicleIcon(b.vehicle.type)}
                        <div className=" text-xs text-gray-900">
                          {b.vehicle.vehicleModel} •{" "}
                          {b.vehicle.number || "Not assigned"}
                        </div>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                          <MapPin className="w-3 h-3 text-green-600" />
                        </div>
                        <div className=" flex-1">
                          <span className=" text-green-600 uppercase tracking-wider font-medium text-xs">
                            Pick up
                          </span>
                          <p className=" text-gray-700 text-sm mt-0.5 leading-relaxed">
                            {b.pickUpAddress}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                          <Navigation className="w-3 h-3 text-red-600" />
                        </div>
                        <div className=" flex-1">
                          <span className=" text-red-600 uppercase tracking-wider font-medium text-xs">
                            Drop
                          </span>
                          <p className=" text-gray-700 text-sm mt-0.5 leading-relaxed">
                            {b.dropAddress}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{formatDate(b.createdAt.toString())}</span>
                      </div>
                      <div className="flex items-center gap-1 font-semibold text-gray-900">
                        <IndianRupee className="w-4 h-4" />
                        <span>{b.fare}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className=" text-xs text-gray-500">Payment</span>
                        <span
                          className={`text-xs rounded-full px-2 py-1 ${b.paymentStatus === "paid" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-700"}`}
                        >
                          {b.paymentStatus}
                        </span>
                      </div>
                      {(b.bookingStatus == "confirmed" ||
                        b.bookingStatus == "started" ||
                        b.bookingStatus == "completed") && (
                        <div className="flex items-center gap-2">
                          <button
                            className="flex items-center gap-1 px-4 py-1.5 rounded-lg transition-colors bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 text-sm font-medium"
                            onClick={() => router.push(`/user/ride/${b._id}`)}
                          >
                            <span>Details</span>
                            <CgArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default page;
