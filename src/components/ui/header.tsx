"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Header = () => {
  const { data: session } = useSession();

  return (
    <header className="bg-gray-800 text-white p-4 pl-20 flex justify-between items-center">
      <h1 className="text-2xl font-bold">
        <Link href="/">Dazzi Admin Page</Link>
      </h1>
      <div>
        {session ? (
          <div className="flex items-center space-x-4">
            <p>{session.user?.email}</p>
            <button
              className="bg-red-500 px-3 py-1 rounded text-white"
              onClick={() => signOut()}
            >
              로그아웃
            </button>
          </div>
        ) : (
          <button
            className="bg-green-500 px-3 py-1 rounded text-white"
            onClick={async () => {
              const result = await signIn("google", {
                callbackUrl: "/dashboard",
                redirect: false,
              });

              if (result?.error) {
                console.error("로그인 오류:", result.error);
              } else {
                console.log("로그인 성공:", result);
              }
            }}
          >
            로그인
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
