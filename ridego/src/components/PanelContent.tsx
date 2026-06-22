"use client";
import { AnimatePresence, motion } from "framer-motion";

import {
  Bike,
  Car,
  Clock,
  IndianRupee,
  MessageCircle,
  Phone,
  Truck,
  User,
} from "lucide-react";
import RideChat from "./RideChat";

const getVehicleIcon = (vehicleType?: string) => {
  switch (vehicleType?.toLowerCase()) {
    case "bike":
      return <Bike size={18} className="text-white" />;
    case "auto":
      return <Car size={18} className="text-white" />;
    case "truck":
      return <Truck size={18} className="text-white" />;
    case "loading":
      return <Truck size={18} className="text-white" />;
    case "car":
    default:
      return <Car size={18} className="text-white" />;
  }
};

function PanelContent({
  isActive,
  displayDistance,
  displayEta,
  status,
  booking,
  cfg,
  canChat,
  paymentBadge,
  chatOpen,
  currentRole,
  onChatToggle,
}: any) {
  return (
    <div className="flex flex-col flex-1 pt-5 mb-4 gap-3">
      {isActive && (
        <div className="mx-5 lg:mx-6 grid grid-cols-2 gap-2">
          <div className=" bg-zinc-50 border border-zinc-100 rounded-2xl p-5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
              <Clock size={16} className=" text-zinc-600" />
            </div>
            <div>
              <p className="text-[10px] text-zinc-400 tracking-wider font-semibold uppercase">
                ETA
              </p>
              <p className=" text-lg text-zinc-900 font-black mt-0.5 leading-none">
                {Math.round(displayEta)}
                <span className=" text-xs text-zinc-400 font-normal ml-0.5">
                  min
                </span>{" "}
              </p>
            </div>
          </div>
          <div className=" bg-zinc-950 flex items-center gap-3 rounded-2xl p-4">
            <div className="w-9 h-9 rounded-xl bg-white/10 shrink-0 flex items-center justify-center">
              <IndianRupee size={16} className=" text-white" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400">
                Fare
              </p>
              <p className=" text-lg font-black text-white mt-0.5">
                {booking.fare || "-"}
              </p>
            </div>
          </div>
        </div>
      )}
      {booking?.user && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-5 lg:mx-6"
        >
          <div className=" bg-zinc-950 rounded-2xl p-4 flex items-center gap-4">
            <div className=" relative shrink-0">
              <div className="w-14 h-14 rounded-xl bg-zinc-800 flex items-center justify-center">
                <User size={26} className=" text-zinc-300" />
              </div>
              <div className=" absolute -bottom-1 -right-1 bg-emerald-400 w-4 h-4 rounded-full border-2 border-zinc-950" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className=" text-white font-bold text-base truncate">
                  {booking.user.name || "Customer"}
                </p>
                <div className="flex items-center gap-1 bg-white/10 rounded-full shrink-0 px-2 py-1">
                  <IndianRupee size={10} className=" text-emerald-300" />
                  <span className=" text-white text-xs font-semibold">
                    {booking.fare}
                  </span>
                </div>
              </div>
              {booking?.paymentStatus && (
                <div className="flex items-center gap-2 mt-1.5">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${paymentBadge.cls ?? "bg-zinc-700 text-zinc-300"}`}
                  >
                    {paymentBadge.label}
                  </span>
                </div>
              )}
            </div>
          </div>
          {isActive && (
            <div className="flex gap-2 mt-2">
              {booking.userMobileNumber && (
                <a
                  href={`tel:${booking.userMobileNumber}`}
                  className={`flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 active:scale-[0.97] transition-all py-3 text-zinc-900 gap-2 text-sm font-semibold ${canChat ? "flex-1" : "w-full"} rounded-xl`}
                >
                  <Phone size={15} /> Call
                </a>
              )}
              {canChat && (
                <button
                  className={`flex-1 flex items-center justify-center gap-2 active:scale-[0.97] transition-all py-3 rounded-xl text-sm font-semibold ${chatOpen ? "bg-zinc-200 text-zinc-900" : "bg-zinc-900 hover:bg-zinc-800 text-white"}`}
                  onClick={onChatToggle}
                >
                  <MessageCircle size={15} />
                  {chatOpen ? "Close Chat" : "Message"}
                </button>
              )}
            </div>
          )}
        </motion.div>
      )}
      <AnimatePresence>
        {chatOpen && canChat && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mx-5 lg:mx-6 overflow-hidden"
          >
            <div className=" rounded-2xl overflow-hidden border border-zinc-100 h-115">
              <RideChat
                currentRole={currentRole}
                bookingId={booking._id}
                userName={booking.user.name || "Customer"}
                driverName={booking.driver.name || "Driver"}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {booking?.vehicle && (
        <div className="mx-5 lg:mx-6">
          <div className="flex bg-zinc-50 border border-zinc-100 rounded-2xl items-center p-4 gap-3">
            <div className="w-11 h-11 rounded-xl bg-zinc-900 flex items-center justify-center shrink-0">
              {getVehicleIcon(booking.vehicle.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                Your Vehicle
              </p>
              <p className=" text-sm font-bold text-zinc-900 truncate">
                {booking.vehicle.vehicleModel || "Vehicle"}
              </p>
            </div>
            <div className=" shrink-0 bg-zinc-900 px-3 py-1.5 rounded-lg">
              <p className=" text-white text-xs font-black tracking-widest font-mono">
                {booking.vehicle.number || "Number"}
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="mx-5 lg:mx-6">
        <div className=" bg-zinc-50 border border-zinc-100 rounded-2xl overflow-hidden">
          <div className="flex gap-3 p-4 border-b border-zinc-100">
            <div className="flex flex-col items-center shrink-0 pt-1">
              <div className="w-3 h-3 rounded-full bg-zinc-900 border-2 border-white shadow-sm" />
              <div className="w-px bg-zinc-200 mt-1" style={{ height: 20 }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">
                Pick Up
              </p>
              <p className=" text-sm text-zinc-800 leading-snug">
                {booking?.pickUpAddress}
              </p>
            </div>
          </div>
          <div className="flex gap-3 p-4 border-b border-zinc-100">
            <div className="flex flex-col items-center shrink-0 pt-1">
              <div className="w-3 h-3 rounded-full bg-zinc-900 border-2 border-white shadow-sm" />
              <div className="w-px bg-zinc-200 mt-1" style={{ height: 20 }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">
                Drop
              </p>
              <p className=" text-sm text-zinc-800 leading-snug">
                {booking?.dropAddress}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PanelContent;
