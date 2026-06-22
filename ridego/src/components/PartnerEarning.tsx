"use client";

import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart2, Star, TrendingDown, TrendingUp, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

type Earnings = {
  date: string;
  earnings: number;
};

function PartnerEarning() {
  const [earningData, setEarningData] = useState<Earnings[]>([]);
  useEffect(() => {
    const fetchEarning = async () => {
      try {
        const { data } = await axios.get("/api/partner/earning");
        const last7Days: Earnings[] = data.slice(-7);
        setEarningData(last7Days);
      } catch (error) {
        console.log(error);
      }
    };
    fetchEarning();
  }, []);

  const total = earningData.reduce((a, d) => a + d.earnings, 0);
  const avg = earningData.length ? Math.round(total / earningData.length) : 0;
  const max = earningData.length
    ? Math.max(...earningData.map((d) => d.earnings))
    : 0;
  const bestEarning = earningData.find((d) => d.earnings == max);
  const today = earningData[earningData.length - 1];
  const yesterday = earningData[earningData.length - 2];
  const delta = today && yesterday ? today.earnings - yesterday.earnings : 0;
  const deltaPositive = delta >= 0;
  const deltaPct = yesterday
    ? Math.abs(Math.round(delta / yesterday.earnings) * 100)
    : 0;

  const fmt = (n: number) => {
    return "₹" + n.toLocaleString();
  };

  const matrics = [
    {
      label: "Best Day",
      value: fmt(max),
      sub: bestEarning?.date ?? "_",
      icon: <Star size={14} />,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      label: "Daily Avg",
      value: fmt(avg),
      sub: "per day",
      icon: <BarChart2 size={14} />,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Today",
      value: today ? fmt(today.earnings) : "_",
      sub:
        today && yesterday
          ? `${deltaPositive ? "+" : ""}${fmt(delta)} vs yesterday`
          : "_",
      icon: <Zap size={14} />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className=" bg-white rounded-3xl w-full border border-orange-100 shadow-sm p-6">
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <span className="text-[11px] inline-block rounded-full bg-blue-50 text-blue-600 uppercase tracking-widest font-semibold mb-1 px-3 py-1">
            Partner Dshboard
          </span>
          <h2 className=" text-xl font-bold text-gray-900 tracking-tight">
            Daily Earnings
          </h2>
          <p className=" text-gray-400 text-sm mt-0.5">
            Last 7 days performance
          </p>
        </div>
        <div className=" text-right">
          <p className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold mb-1">
            Weekly Total
          </p>
          <motion.div
            key={total}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className=" text-3xl font-bold font-mono text-gray-900 tracking-tight"
          >
            {fmt(total)}
          </motion.div>
          <div
            className={`flex items-center justify-end text-xs font-semibold gap-1 mt-1 ${deltaPositive ? "text-emerald-600" : "text-rose-500"}`}
          >
            {deltaPositive ? (
              <TrendingUp size={13} />
            ) : (
              <TrendingDown size={13} />
            )}
            <span>{deltaPct} % vs yesterday</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {matrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            className=" bg-gray-50 rounded-2xl p-4"
          >
            <div
              className={`flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold mb-2 ${m.color}`}
            >
              <span className={`p-1 rounded-lg ${m.bg} ${m.color}`}>
                {m.icon}
              </span>{" "}
              {m.label}
            </div>
            <p className=" text-lg font-bold font-mono text-gray-900 leading-none">
              {m.value}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">{m.sub}</p>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="h-56"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={earningData} barCategoryGap={"30%"}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#9ca3af", fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) =>
                  "₹" + (v >= 1000 ? (v / 1000).toFixed(0) + "k" : v)
                }
              />
              <Bar dataKey="earnings" radius={[8, 8, 3, 3]}>
                {earningData.map((d, i) => {
                  const isToday = i === earningData.length - 1;
                  const isBest = d.earnings === max && !isToday;
                  return (
                    <Cell
                      key={`cell-${i}`}
                      fill={
                        isToday ? "#10b981" : isBest ? "#8b5cf6" : "#bfdbfe"
                      }
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default PartnerEarning;
