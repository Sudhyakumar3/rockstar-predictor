"use client";

import React from "react";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-black text-white shadow-md z-50 py-4">
      <div className="max-w-4xl mx-auto flex justify-between items-center px-8">
        {/* Title Now Redirects to Home */}
        <Link href="/" className="text-xl font-bold hover:text-gray-400 transition">
          Rockstar Predictor 🎵
        </Link>
        <div className="space-x-6">
          <Link href="/" className="hover:text-gray-400">Home</Link>
          <Link href="/about" className="hover:text-gray-400">About</Link>
          <Link href="/analytics" className="hover:text-gray-400">Data Analytics</Link>
          <Link href="/playground" className="hover:text-gray-400">Playground</Link>
        </div>
      </div>
    </nav>
  );
}
