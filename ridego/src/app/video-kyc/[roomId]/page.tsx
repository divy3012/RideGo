"use client";
import { RootState } from "@/redux/store";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle,
  Mic,
  MicOff,
  PhoneOff,
  Video,
  VideoOff,
  X,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

function page() {
  const { userData } = useSelector((state: RootState) => state.user);
  const [joined, setJoined] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const previewRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { roomId } = useParams();
  const [reason, setReason] = useState("");
  const [aLoading, setALoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rLoading, setRLoading] = useState(false);
  const [showApprovalModel, setShowApprovalModel] = useState(false);
  const [showRejectModel, setShowRejectModel] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (joined) return;
    let localStream: MediaStream;
    const init = async () => {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(localStream);
        if (previewRef?.current) {
          previewRef.current.srcObject = localStream;
        }
      } catch (error) {
        console.log(error);
      }
    };
    init();
  }, []);

  const toggleMic = () => {
    if (!stream) return;
    stream.getAudioTracks().forEach((track) => (track.enabled = !isMicOn));
    setIsMicOn(!isMicOn);
  };

  const toggleCamera = () => {
    if (!stream) return;
    stream.getVideoTracks().forEach((track) => (track.enabled = !isCameraOn));
    setIsCameraOn(!isCameraOn);
  };

  const startCall = async () => {
    if (!containerRef) {
      return null;
    }
    setLoading(true);
    try {
      const displayName =
        userData?.role === "admin"
          ? "Admin"
          : `${userData?.name} {${userData?.email}`;
      const appId = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
      const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET;
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appId,
        serverSecret!,
        roomId?.toString()!,
        userData?._id.toString()!,
        displayName,
      );
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: containerRef.current,

        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        showPreJoinView: false,
      });
      setJoined(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const handleApprove = async () => {
    setALoading(true);
    try {
      const { data } = await axios.post("/api/admin/video-kyc/complete", {
        roomId,
        action: "approved",
      });
      console.log(data);
      setALoading(false);
      router.push("/");
    } catch (error: any) {
      console.log(error.response.data.message || error);
      setALoading(false);
    }
  };

  const handleReject = async () => {
    setRLoading(true);
    try {
      const { data } = await axios.post("/api/admin/video-kyc/complete", {
        roomId,
        action: "rejected",
        reason,
      });
      console.log(data);
      setRLoading(false);
      router.push("/");
    } catch (error: any) {
      console.log(error.response.data.message || error);
      setRLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="px-6 py-4 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Image src="/logo.png" alt="Logo" height={50} width={180} />
          <p className="text-xs text-gray-400">
            {userData?.role === "admin"
              ? "Admin Verification"
              : "Partner Video KYC"}
          </p>
        </div>
        {joined && (
          <div className="flex flex-wrap gap-3">
            {userData?.role === "admin" && (
              <>
                <button
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full text-sm flex items-center gap-2"
                  onClick={() => setShowApprovalModel(true)}
                >
                  <CheckCircle size={16} />
                  Approve
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700  px-4 py-2 rounded-full text-sm flex items-center gap-2"
                  onClick={() => setShowRejectModel(true)}
                >
                  <XCircle size={16} />
                  Reject
                </button>
              </>
            )}
            <button
              className="bg-red-700 hover:bg-red-800  px-4 py-2 rounded-full text-sm flex items-center gap-2"
              onClick={() => router.push("/")}
            >
              <PhoneOff size={16} />
              End Call
            </button>
          </div>
        )}
      </div>
      <div className="flex-1 relative">
        <div
          ref={containerRef}
          className={`absolute inset-0 ${joined ? "block" : "hidden"}`}
        />
        {!joined && (
          <div className="h-full flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <video
                  ref={previewRef}
                  autoPlay
                  playsInline
                  className="w-full h-75 sm:h-100 object-cover"
                />
                {!isCameraOn && (
                  <div className="absolute flex items-center justify-center inset-0 bg-black">
                    <VideoOff size={14} />
                  </div>
                )}
              </div>
              <div className="space-y-8 text-center lg:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold">
                  Secure Video KYC
                </h1>
                <div className="flex justify-center lg:justify-start gap-6">
                  <button
                    onClick={toggleCamera}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition ${isCameraOn ? "bg-white text-black" : "bg-white/10 border border-white/20"}`}
                  >
                    {isCameraOn ? <Video /> : <VideoOff />}
                  </button>
                  <button
                    onClick={toggleMic}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition ${isMicOn ? "bg-white text-black" : "bg-white/10 border border-white/20"}`}
                  >
                    {isMicOn ? <Mic /> : <MicOff />}
                  </button>
                </div>
                <button
                  className="w-full bg-white text-black py-4 rounded-xl font-semibold"
                  onClick={startCall}
                  disabled={loading}
                >
                  {loading ? "Connecting..." : " Join Call"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <AnimatePresence>
        {showApprovalModel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="relative bg-[#111] rounded-2xl w-full max-w-md p-6 shadow-2xl"
            >
              <button
                className="absolute top-4 right-4 text-gray-400"
                onClick={() => setShowApprovalModel(false)}
              >
                <X size={16} />
              </button>
              <h2 className="text-lg font-semibold mb-4">Confirm Approval</h2>
              <div className="flex gap-4">
                <button
                  className="flex-1 rounded-xl py-2 border"
                  onClick={() => setShowApprovalModel(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 bg-green-600 rounded-xl py-2"
                  onClick={handleApprove}
                  disabled={aLoading}
                >
                  {aLoading ? "Processing..." : "Approve"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showRejectModel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="relative bg-[#111] rounded-2xl w-full max-w-md p-6 shadow-2xl"
            >
              <button
                className="absolute top-4 right-4 text-gray-400"
                onClick={() => setShowRejectModel(false)}
              >
                <X size={16} />
              </button>
              <h2 className="text-lg font-semibold mb-4">Reject Partner</h2>
              <textarea
                className="w-full bg-white/10 border border-white/20 rounded-xl p-3 mb-4 text-sm"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Rejection Reason"
              ></textarea>
              <div className="flex gap-4">
                <button
                  className="flex-1 rounded-xl py-2 border"
                  onClick={() => setShowRejectModel(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 bg-green-600 rounded-xl py-2"
                  onClick={handleReject}
                  disabled={rLoading}
                >
                  {rLoading ? "Processing..." : "Reject"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default page;
