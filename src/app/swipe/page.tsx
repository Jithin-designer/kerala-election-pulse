"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, RotateCcw, Flame } from "lucide-react";
import Link from "next/link";
import { SWIPE_CANDIDATES } from "@/lib/swipeData";
import CandidateSwipeCard from "@/components/CandidateSwipeCard";

const VISIBLE_CARDS = 3; // how many cards render in the stack

export default function SwipePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [saved, setSaved] = useState<string[]>([]);
  const [exiting, setExiting] = useState(false);

  const candidates = SWIPE_CANDIDATES;
  const remaining = candidates.length - currentIndex;
  const isFinished = currentIndex >= candidates.length;

  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      if (exiting) return;
      setExiting(true);

      if (direction === "right") {
        setSaved((prev) => [...prev, candidates[currentIndex].id]);
      }

      // Small delay for exit animation
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setExiting(false);
      }, 350);
    },
    [currentIndex, candidates, exiting]
  );

  const handleRestart = () => {
    setCurrentIndex(0);
    setSaved([]);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* ── Top Bar ── */}
      <header className="relative z-50 flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <Link
          href="/"
          className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium hidden sm:inline">Back</span>
        </Link>

        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-400" />
          <span className="text-white font-black text-lg tracking-tight">
            Neta<span className="text-gold">Match</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-white/40 text-sm">
          <span className="font-bold text-gold">{saved.length}</span>
          <span className="hidden sm:inline">saved</span>
          <span className="text-white/20 mx-1">·</span>
          <span className="font-mono">{remaining > 0 ? remaining : 0}</span>
          <span className="hidden sm:inline">left</span>
        </div>
      </header>

      {/* ── Card Stack Area ── */}
      <main className="flex-1 relative flex items-center justify-center px-4 py-6 overflow-hidden">
        {!isFinished ? (
          <div className="relative w-full max-w-[400px] aspect-[3/4.8] mx-auto">
            <AnimatePresence mode="popLayout">
              {candidates
                .slice(currentIndex, currentIndex + VISIBLE_CARDS)
                .map((candidate, i) => (
                  <CandidateSwipeCard
                    key={candidate.id}
                    candidate={candidate}
                    onSwipe={handleSwipe}
                    isTop={i === 0}
                    stackIndex={i}
                  />
                ))
                .reverse()}
            </AnimatePresence>
          </div>
        ) : (
          /* ── All Done Screen ── */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center px-6"
          >
            <div className="text-6xl mb-6">🗳️</div>
            <h2 className="text-white text-2xl font-black mb-2">
              All caught up!
            </h2>
            <p className="text-white/40 text-sm mb-2">
              You saved{" "}
              <span className="text-gold font-bold">{saved.length}</span> of{" "}
              {candidates.length} candidates
            </p>
            <p className="text-white/25 text-xs mb-8 max-w-xs mx-auto">
              Share your favorites on social media and start conversations about
              Kerala&apos;s most-watched battles
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleRestart}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/10 text-white font-semibold text-sm hover:bg-white/15 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Swipe Again
              </button>
              <Link
                href="/browse"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-gold-dark to-gold text-black font-bold text-sm hover:scale-105 transition-transform"
              >
                Browse All 140
              </Link>
            </div>
          </motion.div>
        )}
      </main>

      {/* ── Bottom progress bar ── */}
      {!isFinished && (
        <div className="px-6 pb-5">
          <div className="h-1 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-gold-dark to-gold rounded-full"
              initial={{ width: "0%" }}
              animate={{
                width: `${(currentIndex / candidates.length) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-center text-white/15 text-[10px] mt-2 tracking-widest uppercase">
            {currentIndex + 1} of {candidates.length} candidates
          </p>
        </div>
      )}
    </div>
  );
}
