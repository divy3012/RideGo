"use client";

import axios from "axios";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle,
  CircleDashed,
  CreditCard,
  Landmark,
  Phone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const IFSC_CODE = /^[A-Z]{4}0[A-Z0-9]{6}$/;

function page() {
  const router = useRouter();
  const [accountHolder, setAccountHolder] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [upi, setUpi] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sanitizeIfsc = ifsc.trim().toUpperCase();

  const IsNameValid = accountHolder.trim().length >= 3;
  const isAccountValid = accountNumber.trim().length >= 9;
  const IsIfscValid = IFSC_CODE.test(sanitizeIfsc);
  const isMobileValid = /^[0-9]{10}$/.test(mobileNumber.trim());

  const canSubmit =
    IsNameValid && isAccountValid && IsIfscValid && isMobileValid;

  const handleBank = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post("/api/partner/onboarding/bank", {
        accountHolder,
        accountNumber,
        ifsc: sanitizeIfsc,
        upi,
        mobileNumber,
      });

      setLoading(false);
      window.location.href = "/";
    } catch (error: any) {
      setError(error.response?.data?.message || "Something went wrong");
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleGetBank = async () => {
      try {
        const { data } = await axios.get("/api/partner/onboarding/bank");
        setAccountHolder(data.partnerBank.accountHolder);
        setAccountNumber(data.partnerBank.accountNumber);
        setIfsc(data.partnerBank.ifsc);
        setMobileNumber(data.mobileNumber);
        setUpi(data.partnerBank.upi);
      } catch (error: any) {
        console.log(error);
      }
    };
    handleGetBank();
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl bg-white rounded-3xl border border-gray-200 shadow-[0_25px_70px_rgba(0,0,0,0.15)] p-6 sm:p-8"
      >
        <div className=" relative text-center">
          <button
            className=" absolute left-0 top-0 w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
            onClick={() => router.back()}
          >
            <ArrowLeft size={18} />
          </button>
          <p className="text-xl text-gray-400 font-medium">Step 3 of 3</p>
          <h1 className="text-2xl font-bold mt-1">Bank And Payouts</h1>
          <p className="text-sm text-gray-400 mt-2">Used for partner payouts</p>
        </div>
        <div className="mt-6 space-y-6">
          <div>
            <label
              htmlFor="ahn"
              className=" text-xs font-semibold text-gray-400"
            >
              Account holder name
            </label>
            <div className="flex items-center gap-2 mt-2">
              <div className="text-gray-400">
                <BadgeCheck />
              </div>
              <input
                type="text"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                className={` flex-1 border-b pb-2 text-sm focus:outline-none ${!IsNameValid && accountHolder.length > 0 ? "border-red-500 focus:border-red-500" : " border-gray-300 focus:border-black"}`}
                placeholder="As per bank records"
                id="ahn"
              />
            </div>
            {!IsNameValid && accountHolder.length > 0 && (
              <p className="mt-1 text-red-500 text-xs">
                Minimum 3 chararcters required
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="ahnum"
              className=" text-xs font-semibold text-gray-400"
            >
              Account Number
            </label>
            <div className="flex items-center gap-2 mt-2">
              <div className="text-gray-400">
                <CreditCard />
              </div>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className={`flex-1 border-b pb-2 text-sm focus:outline-none ${!isAccountValid && accountNumber.length > 0 ? "border-red-500 focus:border-red-500" : " border-gray-300 focus:border-black"}`}
                placeholder="Enter Account Number"
                id="ahnum"
              />
            </div>
            {!isAccountValid && accountNumber.length > 0 && (
              <p className="mt-1 text-red-500 text-xs">
                Minimum 9 chararcters required
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="code"
              className=" text-xs font-semibold text-gray-400"
            >
              IFSC Code
            </label>
            <div className="flex items-center gap-2 mt-2">
              <div className="text-gray-400">
                <Landmark />
              </div>
              <input
                type="text"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                className={`flex-1 border-b pb-2 text-sm focus:outline-none ${!IsIfscValid && ifsc.length > 0 ? "border-red-500 focus:border-red-500" : " border-gray-300 focus:border-black"}`}
                placeholder="HDFC0001234"
                id="code"
              />
            </div>
            {!IsIfscValid && ifsc.length > 0 && (
              <p className="mt-1 text-red-500 text-xs">Invalid ifsc code</p>
            )}
          </div>
          <div>
            <label
              htmlFor="mn"
              className=" text-xs font-semibold text-gray-400"
            >
              Mobile Number
            </label>
            <div className="flex items-center gap-2 mt-2">
              <div className="text-gray-400">
                <Phone />
              </div>
              <input
                type="text"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className={` flex-1 border-b pb-2 text-sm focus:outline-none ${!isMobileValid && mobileNumber.length > 0 ? "border-red-500 focus:border-red-500" : " border-gray-300 focus:border-black"} `}
                placeholder="Mobile Number"
                id="mn"
              />
            </div>
            {!isMobileValid && mobileNumber.length > 0 && (
              <p className="mt-1 text-red-500 text-xs">
                Enter 10 digit mobile number
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="upi"
              className=" text-xs font-semibold text-gray-400"
            >
              UPI ID (optional)
            </label>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                value={upi}
                onChange={(e) => setUpi(e.target.value)}
                className=" flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black"
                placeholder="name@upi"
                id="upi"
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-start text-xs gap-3 text-gray-400">
          <CheckCircle size={16} className="mt-0.5" />
          <p>
            Bank details verified before first payout. This usually takes 24-48
            hours.
          </p>
        </div>
        <p className=" text-red-500 mt-4">*{error} </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="mt-8 w-full h-14 rounded-2xl bg-black text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-40 transition"
          disabled={loading || !canSubmit}
          onClick={handleBank}
        >
          {loading ? (
            <CircleDashed className=" text-white animate-spin" />
          ) : (
            "Continue"
          )}
        </motion.button>
      </motion.div>
    </div>
  );
}

export default page;
