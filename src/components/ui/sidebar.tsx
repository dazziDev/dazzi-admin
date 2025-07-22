"use client";

import { Button } from "@/components/ui/button";
import { Edit, Home, UserCogIcon, FileText } from "lucide-react";
import Link from "next/link";

const Sidebar = () => (
  <div className="fixed left-0 top-0 h-full bg-gray-800 text-white w-16 flex flex-col items-center p-4 space-y-4 ">
    <Link href="/dashboard">
      <Button
        variant="ghost"
        className="flex flex-col items-center space-y-2 mt-11"
      >
        <Home />
      </Button>
    </Link>

    <Link href="/article">
      <Button variant="ghost" className="flex flex-col items-center space-y-2">
        <Edit />
      </Button>
    </Link>

    <Link href="/articles">
      <Button variant="ghost" className="flex flex-col items-center space-y-2">
        <FileText />
      </Button>
    </Link>

    {/* <Link href="/preview">
      <Button variant="ghost" className="flex flex-col items-center space-y-2">
        <Eye />
      </Button>
    </Link> */}

    <Link href="/editor">
      <Button variant="ghost" className="flex flex-col items-center space-y-2">
        <UserCogIcon />
      </Button>
    </Link>
  </div>
);

export default Sidebar;
