"use client";

import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  Truck,
  User,
  Users,
  Video,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import AdminEarning from "./AdminEarning";
import ContentList from "./ContentList";
import Kpi from "./Kpi";
import TabButton from "./TabButton";

type Stats = {
  totalPartners: number;
  totalApprovedPartner: number;
  totalPendingPartners: number;
  totalRejectedPartners: number;
};
type Tab = "partner" | "kyc" | "vehicle";

function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>();
  const [partnerReviews, setPartnerReviews] = useState<any>();
  const [pendingKyc, setPendingKyc] = useState<any>();
  const [vehicleReviews, setVehicleReviews] = useState<any>();

  const handleGetData = async () => {
    try {
      const { data } = await axios.get("/api/admin/dashboard");

      setStats(data.stats);
      setPartnerReviews(data.pendingPartnersReviews);
      setVehicleReviews(data.pendingVehicles);
    } catch (error) {
      console.log(error);
    }
  };
  const handleGetPendingKyc = async () => {
    try {
      const { data } = await axios.get("/api/admin/video-kyc/pending");
      setPendingKyc(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleGetPendingKyc();
    handleGetData();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200">
      <div className="sticky bg-white/80 backdrop-blur-lg top-0 border-b z-40">
        <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo" height={50} width={180} />
          </div>
          <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-black text-white">
            <User size={14} />
            Admin Dashboard
          </div>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <Kpi
            label="Total Partners"
            value={stats?.totalPartners}
            icon={<Users />}
            variant={"totalPartners"}
          />
          <Kpi
            label="Approed Partners"
            value={stats?.totalApprovedPartner}
            icon={<CheckCircle2 />}
            variant={"approved"}
          />
          <Kpi
            label="Pending Partners"
            value={stats?.totalPendingPartners}
            icon={<Clock />}
            variant={"pending"}
          />
          <Kpi
            label="Rejected Partners"
            value={stats?.totalRejectedPartners}
            icon={<XCircle />}
            variant={"rejected"}
          />
        </div>
        <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100 flex flex-wrap gap-2">
          <TabButton
            active={activeTab == "partner"}
            count={partnerReviews?.length ?? 0}
            icon={<Users size={15} />}
            onClick={() => setActiveTab("partner")}
          >
            Pending Partner Reviews
          </TabButton>
          <TabButton
            active={activeTab == "kyc"}
            count={pendingKyc?.length ?? 0}
            icon={<Video size={15} />}
            onClick={() => setActiveTab("kyc")}
          >
            Pending Video KYC
          </TabButton>
          <TabButton
            active={activeTab == "vehicle"}
            count={vehicleReviews?.length ?? 0}
            icon={<Truck size={15} />}
            onClick={() => setActiveTab("vehicle")}
          >
            Pending Vehicle Reviews
          </TabButton>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-3"
          >
            {activeTab == "partner" && (
              <ContentList data={partnerReviews ?? []} type={"partner"} />
            )}
            {activeTab == "kyc" && (
              <ContentList data={pendingKyc ?? []} type={"kyc"} />
            )}
            {activeTab == "vehicle" && (
              <ContentList data={vehicleReviews ?? []} type={"vehicle"} />
            )}
          </motion.div>
        </AnimatePresence>
        <AdminEarning />
      </main>
    </div>
  );
}

export default AdminDashboard;
