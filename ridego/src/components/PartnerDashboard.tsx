"use client";

import { IVehicle } from "@/models/vehicle.model";
import { RootState } from "@/redux/store";
import axios from "axios";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Lock,
  Video,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ActionCard from "./ActionCard";
import PartnerEarning from "./PartnerEarning";
import PricingModel from "./PricingModel";
import RejectionCard from "./RejectionCard";
import StatusCard from "./StatusCard";
type Step = {
  id: number;
  title: string;
  route?: string;
};

const STEPS: Step[] = [
  { id: 1, title: "Vehicle", route: "/partner/onboarding/vehicle" },
  { id: 2, title: "Documents", route: "/partner/onboarding/documents" },
  { id: 3, title: "Bank", route: "/partner/onboarding/bank" },
  { id: 4, title: "Review" },
  { id: 5, title: "Video KYC" },
  { id: 6, title: "Pricing" },
  { id: 7, title: "Final Review" },
  { id: 8, title: "Live" },
];

const TOTAL_STEPS = STEPS.length;

function PartnerDashboard() {
  const [activeStep, setActiveStep] = useState(0);
  const { userData } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const [reqLoading, setReqLoading] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [vehicleData, setVehicleData] = useState<IVehicle | null>(null);
  

  useEffect(() => {
    if (userData) {
      setActiveStep(userData.partnerOnboardingSteps + 1);
    }
  }, [userData]);

  const handleGetPrice = async () => {
    try {
      const { data } = await axios.get("/api/partner/onboarding/pricing");

      setVehicleData(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleGetPrice();
  }, []);

  const goToStep = (step: Step) => {
    if (
      step.id === 6 &&
      userData?.partnerStatus === "approved" &&
      userData.videoKycStatus === "approved"
    ) {
      setShowPricing(true);
      return;
    }
    if (step.route && step.id <= activeStep) {
      router.push(step.route);
    }
  };

  const progressPercentage = ((activeStep - 1) / (TOTAL_STEPS - 1)) * 100;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200 pt-28 pb-20 px-4">
      <div className="max-w-7xl mx-auto space-y-16">
        <div>
          <h1 className="text-4xl font-bold">Partner Dashboard</h1>
          <p className="text-gray-500 mt-3">
            Complete all steps to active your account
          </p>
        </div>
        <div className="bg-white rounded-3xl p-10 shadow-xl border overflow-auto">
          <div className="relative min-w-200">
            <div className="absolute top-7 left-0 rounded-full bg-gray-200 w-full h-0.75" />
            <motion.div
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.6 }}
              className="absolute top-7 left-0 bg-black rounded-full h-0.75"
            />
            <div className="relative flex justify-between">
              {STEPS.map((s, index) => {
                const completed = s.id < activeStep;
                const active = s.id == activeStep;
                const locked = s.id > activeStep;
                return (
                  <motion.div
                    key={s.id}
                    whileHover={!locked ? { scale: 1.1 } : {}}
                    className="flex flex-col items-center z-10 cursor-pointer"
                    onClick={() => goToStep(s)}
                  >
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all ${completed ? "text-white bg-black border-black" : active ? "border-black bg-white" : "border-gray-300 text-gray-400 bg-white"}`}
                    >
                      {completed ? (
                        <Check size={20} />
                      ) : locked ? (
                        <Lock size={20} />
                      ) : (
                        s.id
                      )}
                    </div>
                    <p className="mt-3 text-sm font-semibold text-center">
                      {s.title}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
        {activeStep == 4 && userData?.partnerStatus === "rejected" && (
          <RejectionCard
            title="Partner Rejected"
            reason={userData.rejectionReason}
            actionLabel={"Review and Update"}
            onAction={() => router.push("/partner/onboarding/vehicle")}
          />
        )}
        {activeStep == 4 && userData?.partnerStatus === "pending" && (
          <StatusCard
            icon={<Clock size={18} />}
            title={"Documents Under Review"}
            desc={"Admin verifying your documents."}
          />
        )}
        {activeStep === 5 &&
          (userData?.videoKycStatus === "approved" ? (
            <StatusCard
              icon={<CheckCircle2 size={18} />}
              title={"Video KYC Approved"}
              desc={"You can now proceed to pricing"}
            />
          ) : userData?.videoKycStatus === "rejected" ? (
            <RejectionCard
              reason={userData.videoKycRejectionReason}
              actionLabel={reqLoading ? "Request..." : "Try Again"}
              title={"Video KYC Rejected"}
              onAction={async () => {
                setReqLoading(true);
                await axios.get("/api/partner/video-kyc/request");
                setReqLoading(false);
              }}
            />
          ) : userData?.videoKycStatus === "in_progress" &&
            userData.videoKycRoomId ? (
            <ActionCard
              icon={<Video size={18} />}
              title={"Admin Started Video KYC"}
              button={"Join Call"}
              onClick={() =>
                router.push(`/video-kyc/${userData.videoKycRoomId}`)
              }
            />
          ) : (
            <StatusCard
              icon={<Clock size={18} />}
              title={"Waiting for Admin"}
              desc={"Admin will initiate Video KYC shortly."}
            />
          ))}
        {activeStep == 7 && vehicleData?.status == "pending" && (
          <StatusCard
            icon={<Clock size={20} />}
            title={"Pricing Under Review"}
            desc={"Admin is reviewing your pricing"}
          />
        )}
        {activeStep == 7 && vehicleData?.status == "rejected" && (
          <RejectionCard
            title="Pricing Rejected"
            reason={vehicleData?.rejectionReason}
            actionLabel="Edit"
            onAction={() => setShowPricing(true)}
          />
        )}
        {activeStep == 8 && vehicleData?.status == "approved" && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black text-white rounded-3xl p-10 shadow-2xl"
          >
            <h2 className="text-2xl font-bold">🚀You're Live</h2>
            <button className="mt-6 bg-white text-black px-6 py-3 rounded-xl font-semibold flex items-center gap-2" onClick={() => router.push("/partner/bookings") }>
              Go To Bookings <ArrowRight size={16} />{" "}
            </button>
          </motion.div>
        )}
        <PartnerEarning />
      </div>
      <PricingModel
        open={showPricing}
        onClose={() => setShowPricing(false)}
        data={vehicleData}
      />
    </div>
  );
}

export default PartnerDashboard;
