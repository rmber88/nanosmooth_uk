import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  children: ReactNode;
  isOpen: boolean;
}

export default function Portal({ children, isOpen }: PortalProps) {
  return isOpen ? (
    createPortal(
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>,
      document.getElementById("modal") as Element
    )
  ) : (
    <></>
  );
}
