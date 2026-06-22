"use client";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { CircleDashed, Lock, Mail, User, X } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";

type propType = {
  open: boolean;
  onClose: () => void;
};
type stepType = "login" | "signup" | "otp";

function AuthModel({ open, onClose }: propType) {
  const [step, setStep] = useState<stepType>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const { data } = useSession();
  console.log(data);

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });
      setError("");
      setStep("otp");
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setError(error.response.data.message || "Something went wrong");
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      console.log(res);

      if (res?.error) {
        setError(res.error);
      } else {
        setError("");
        onClose();
      }
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleLogin = async () => {
    await signIn("google");
  };
  const handleChangeOtp = (index: number, value: string) => {
    if (value !== "" && !/^[0-9]$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }

    if (!value && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };
  const handleVerifyEmail = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/verify-email", {
        email,
        otp: otp.join(""),
      });
      setOtp(["", "", "", "", "", ""]);
      setError("");
      setStep("login");
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setError(error.response.data.message || "Something went wrong");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className=" fixed inset-0 z-90 bg-black/80 backdrop-blur-md "
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              exit={{ opacity: 0, scale: 0.95, y: 40 }}
              className=" fixed inset-0 z-100 flex items-center justify-center px-4 "
            >
              <div className=" relative w-full max-w-md rounded-3xl bg-white border border-black/10 shadow-[0_40px_100px_rgba(0,0,0,0.35)] p-6 sm:p-8 text-black ">
                <div
                  className=" absolute right-4 top-4 text-gray-500 hover:text-black transition cursor-pointer "
                  onClick={onClose}
                >
                  {" "}
                  <X size={20} />{" "}
                </div>
                <div className=" mb-6 text-center ">
                  <h1 className=" text-3xl font-extrabold tracking-widest ">
                    RideGo
                  </h1>
                  <p className=" mt-1 text-xs text-gray-400 ">
                    Premium Vehicle Booking
                  </p>
                </div>
                <button
                  className=" w-full h-11 rounded-xl border border-black/20 flex items-center justify-center gap-3 text-sm font-semibold hover:bg-black hover:text-white transition "
                  onClick={handleGoogleLogin}
                >
                  <img src="/google.svg" className="w-5 h-5" alt="google"></img>
                  Continue With Google
                </button>
                <div className=" flex items-center gap-4 my-6 ">
                  <div className="flex-1 h-px bg-black/10" />
                  <div className="flex-1 h-px bg-black/10" />
                  <div className="text-sm text-gray-500">OR</div>
                  <div className="flex-1 h-px bg-black/10" />
                </div>
                <div>
                  {step == "login" && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <h1 className="text-xl font-semibold">Welcome back</h1>
                      <div className="mt-5 space-y-4">
                        <div className="flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3">
                          <Mail size={18} className="text-gray-400" />
                          <input
                            type="email"
                            placeholder="Email"
                            className="w-full bg-transparent outline-none text-sm"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                          ></input>
                        </div>
                        <div className="flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3">
                          <Lock size={18} className="text-gray-400" />
                          <input
                            type="password"
                            placeholder="Password"
                            className="w-full bg-transparent outline-none text-sm"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                          ></input>
                        </div>
                        <button
                          className="w-full h-11 rounded-xl bg-black text-white font-semibold hover:bg-gray-900 transition flex items-center justify-center"
                          disabled={loading}
                          onClick={handleLogin}
                        >
                          {!loading ? (
                            "Login"
                          ) : (
                            <CircleDashed
                              size={18}
                              color="white"
                              className=" animate-spin "
                            />
                          )}
                        </button>
                        {error && <div className="text-red-500">*{error}</div>}
                      </div>
                      <p className="mt-6 text-center text-sm text-gray-400">
                        Don't have an account?{" "}
                        <span
                          className=" text-black font-medium hover:underline "
                          onClick={() => setStep("signup")}
                        >
                          Sign Up
                        </span>{" "}
                      </p>
                    </motion.div>
                  )}
                  {step == "signup" && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <h1 className="text-xl font-semibold">
                        Create New Account
                      </h1>
                      <div className="mt-5 space-y-4">
                        <div className="flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3">
                          <User size={18} className="text-gray-400" />
                          <input
                            type="text"
                            placeholder="Full Name"
                            className="w-full bg-transparent outline-none text-sm"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                          ></input>
                        </div>
                        <div className="flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3">
                          <Mail size={18} className="text-gray-400" />
                          <input
                            type="email"
                            placeholder="Email"
                            className="w-full bg-transparent outline-none text-sm"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                          ></input>
                        </div>
                        <div className="flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3">
                          <Lock size={18} className="text-gray-400" />
                          <input
                            type="password"
                            placeholder="Password"
                            className="w-full bg-transparent outline-none text-sm"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                          ></input>
                        </div>
                        {error && <div className="text-red-500 ">*{error}</div>}
                        <button
                          className="w-full h-11 rounded-xl bg-black text-white font-semibold hover:bg-gray-900 transition flex justify-center items-center"
                          disabled={loading}
                          onClick={handleSignUp}
                        >
                          {!loading ? (
                            "Send OTP"
                          ) : (
                            <CircleDashed
                              size={18}
                              color="white"
                              className=" animate-spin "
                            />
                          )}
                        </button>
                      </div>
                      <p className="mt-6 text-center text-sm text-gray-400">
                        Already have an account?{" "}
                        <span
                          className=" text-black font-medium hover:underline "
                          onClick={() => setStep("login")}
                        >
                          Login
                        </span>{" "}
                      </p>
                    </motion.div>
                  )}
                  {step == "otp" && (
                    <motion.div
                      key="otp"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h2 className="text-xl font-semibold">Verify Email</h2>
                      <div className="flex justify-between gap-2 mt-6">
                        {otp.map((digit, i) => (
                          <input
                            key={i}
                            id={`otp-${i}`}
                            value={digit}
                            className="w-10 h-12 sm:w-12 text-center text-lg font-semibold rounded-xl bg-white border border-black/20 outline-none"
                            maxLength={1}
                            onChange={(e) => handleChangeOtp(i, e.target.value)}
                          />
                        ))}
                      </div>
                      {error && <div className="text-red-500 ">*{error}</div>}
                      <button
                        className="mt-6 w-full h-11 rounded-xl bg-black text-white hover:bg-gray-900 transition font-semibold flex items-center justify-center"
                        disabled={loading}
                        onClick={handleVerifyEmail}
                      >
                        {!loading ? (
                          "Verify"
                        ) : (
                          <CircleDashed
                            size={18}
                            color="white"
                            className=" animate-spin "
                          />
                        )}
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default AuthModel;
