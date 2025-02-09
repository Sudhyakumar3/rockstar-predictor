import React from "react";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-black text-white shadow-md z-50 py-4">
      <div className="max-w-4xl mx-auto flex justify-center items-center space-x-6">
        <div className="flex space-x-6">
          <Link href="/" className="hover:text-gray-400">Home</Link>
          <Link href="/analytics" className="hover:text-gray-400">Data Analytics</Link>
          <Link href="/playground" className="hover:text-gray-400">Playground</Link>
        </div>
      </div>
    </nav>
  );
}
