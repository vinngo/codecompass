import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-gray-800 w-full">
      <div className="w-full px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Logos and stuff*/}
          <div className="flex flex-col gap-3">
            <div className="bg-teal-500 text-black font-bold px-4 py-2 rounded w-fit text-sm">
              logo
            </div>
            <p className="text-gray-500 text-xs">placeholder</p>
          </div>

          {/* Links */}
          <div className="flex gap-8 text-sm">
            <Link
              href="/"
              className="text-gray-500 hover:text-teal-500 transition-colors"
            >
              placeholder
            </Link>
            <Link
              href="/"
              className="text-gray-500 hover:text-teal-500 transition-colors"
            >
              placeholder
            </Link>
            <Link
              href="/"
              className="text-gray-500 hover:text-teal-500 transition-colors"
            >
              placeholder
            </Link>
            <Link
              href="/"
              className="text-gray-500 hover:text-teal-500 transition-colors"
            >
              placeholder
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
