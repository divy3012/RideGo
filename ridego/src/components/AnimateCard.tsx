"use client";
import { motion } from "framer-motion";

function AnimateCard({ title, icon, children }: any) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white p-8 space-y-6 shadow-xl rounded-4xl"
    >
      <div className="flex items-center gap-2 font-semibold">
        {icon}
        {title}
      </div>
      {children}
    </motion.div>
  );
}

export default AnimateCard;
