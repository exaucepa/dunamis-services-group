"use client";

import { motion } from "framer-motion";

export const FadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
    },
  },
};

export const SlideUp = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

export const SlideRight = {
  hidden: {
    x: 100,
  },
  visible: {
    x: 0,
    transition: {
      duration: 0.4,
    },
  },
};

export const HoverCard = {
  whileHover: {
    y: -8,
    scale: 1.03,
  },
  transition: {
    duration: 0.25,
  },
};

export const ButtonAnimation = {
  whileHover: {
    scale: 1.05,
  },
  whileTap: {
    scale: 0.95,
  },
};

export { motion };