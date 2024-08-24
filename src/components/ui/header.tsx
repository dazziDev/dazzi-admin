"use client";
import Link from "next/link";

const Header: React.FC = () => (
  <header className="bg-gray-800 text-white p-4 pl-20">
    {" "}
    <h1 className="text-2xl font-bold">
      <Link href="/">Dazzi Admin Page</Link>
    </h1>
  </header>
);

export default Header;
