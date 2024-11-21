import { auth, signIn, signOut } from "@/auth";
import { BadgePlus, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Navbar = async () => {
  const session = await auth();

  return (
    <header className="py-3 px-5 bg-white shadow-sm font-work-sans ">
      <nav className="flex justify-between items-center ">
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={144} height={30} />
        </Link>

        <div className="flex items-center gap-5 text-black">
          {session && session?.user ? (
            <>
              <Link href="/startup/create" className="text-sm font-semibold">
                <span className="max-sm:hidden">Create</span>
                <BadgePlus className="size-6 sm:hidden" />
              </Link>

              <button
                onClick={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
                className="text-sm font-semibold"
              >
                <span className="max-sm:hidden">Logout</span>
                <LogOut className="size-6 sm:hidden text-primary" />
              </button>

              <Link
                href={`/user/${session.id}`}
                className="text-sm font-semibold"
              >
                <Avatar className="size-10">
                  <AvatarImage
                    src={session?.user.image || ""}
                    alt={session?.user.name || ""}
                  />
                  <AvatarFallback>AV</AvatarFallback>
                </Avatar>
              </Link>
            </>
          ) : (
            <button
              onClick={async () => {
                "use server";
                await signIn("github");
              }}
              className="text-sm font-semibold"
            >
              Sign In
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
