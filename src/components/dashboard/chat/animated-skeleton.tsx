"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const skeletonLines = [
  "100%",
  "90%",
  "95%",
  "70%",
  "80%",
  "92%",
  "100%",
  "90%",
  "95%",
  "70%",
  "80%",
  "92%",
];

export default function AnimatedSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mt-5 bg-elevated rounded-sm"
    >
      <div className="space-y-3 p-4">
        {skeletonLines.map((width, index) => (
          <motion.div
            key={index}
            initial={{ width: 0 }}
            animate={{ width }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
              delay: index * 0.05,
            }}
          >
            <Skeleton className={`h-4 w-[${width}]`} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
