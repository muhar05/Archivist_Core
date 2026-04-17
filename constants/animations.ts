export const fadeInSubtle = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
} as const;

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
} as const;

export const cardHover = {
  whileHover: { 
    scale: 1.05,
    transition: { type: "spring", stiffness: 400, damping: 20 }
  }
} as const;

export const buttonSpring = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { type: "spring", stiffness: 400, damping: 25 }
} as const;
