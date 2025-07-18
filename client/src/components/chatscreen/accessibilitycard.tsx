"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, MenuIcon, Search } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "../ui/button";
import CustomAvatar from "../ui/customavatar";
import { Input } from "../ui/input";
import UserCard from "./usercard";

export default function AccessibilityCard({
  users,
}: {
  users: { id: string; name: string; image?: string | null }[];
}) {
  const { data: session } = useSession();
  const [inputtext, setInputtext] = useState("");
  const UsersRef = useRef(
    users.filter(
      (User: { id: string; name: string; image?: string | null }) =>
        User.id != session?.user?.id,
    ),
  );
  const [SearchedUsers, setSearchedUsers] = useState<
    { id: string; name: string; image?: string | null }[]
  >([]);
  const [Searchpanel, setSearchpanel] = useState(false);

  useEffect(() => {
    if (!inputtext.trim()) {
      setSearchedUsers([]);
      return;
    }
    const timout = 400;
    const searchtimeout = setTimeout(() => {
      setSearchedUsers(
        UsersRef.current.filter((user) =>
          user.name.toLowerCase().includes(inputtext.toLowerCase()),
        ),
      );
    }, timout);

    return () => {
      clearTimeout(searchtimeout);
    };
  }, [inputtext]);

  if (!session) {
    return <div>Not authenticated</div>;
  }

  return (
    <div
      className={`flex  h-16 relative ${
        Searchpanel ? "bg-transparent" : ""
      }  w-full items-center px-2`}
    >
      <AnimatePresence mode="wait">
        {!Searchpanel ? (
          <motion.div
            className="w-10 h-10"
            key={"menubutton"}
            initial={{ rotate: -45, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -45, opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <DropdownMenu>
              <DropdownMenuTrigger
                asChild
                className=" cursor-pointer [&[data-state=open]]:bg-transparent focus:ring-0 focus:ring-offset-0 ring-0 flex justify-center items-center "
              >
                <MenuIcon className="hover:scale-110 duration-500" size={40} />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="border-1 border-gray-100   bg-white/70 backdrop-blur-lg  shadow-2xl shadow-black/50 ">
                <DropdownMenuLabel className="font-bold ">
                  <div
                    className=" gap-1.5 flex
                  items-center"
                  >
                    <div>
                      {session.user?.image && (
                        <CustomAvatar
                          className="rounded-full object-cover aspect-square"
                          width={40}
                          height={40}
                          alt={session.user.image}
                          src={`${session.user?.image}`}
                        />
                      )}
                    </div>
                    <div>{session.user?.name}</div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  Saved Chats
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href={`/c/settings`}>Settings</Link>
                </DropdownMenuItem>

                <Dialog>
                  <DialogTrigger className="w-full">
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className={` hover:!bg-red-500 cursor-pointer hover:!text-white text-red-500`}
                    >
                      Logout
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent className="bg-black/30 ">
                    <AnimatePresence>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="shadow-2xl shadow-black/30  flex flex-col bg-white backdrop-blur-lg p-3 rounded-2xl"
                      >
                        <DialogHeader className="m-2.5 mr-0">
                          <DialogTitle className="text-2xl font-bold">
                            Are you absolutely sure?
                          </DialogTitle>
                          <DialogDescription className="text-xl">
                            This will log you out of your account.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-2 mt-4">
                          <DialogClose asChild>
                            <Button className="cursor-pointer text-center  hover:scale-105">
                              Cancel
                            </Button>
                          </DialogClose>
                          <Button
                            className="text-center cursor-pointer hover:scale-105"
                            variant="destructive"
                            onClick={() => {
                              signOut({ callbackUrl: "/signin" });
                              toast.info("Logging out...");
                            }}
                          >
                            Logout
                          </Button>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </DialogContent>
                </Dialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        ) : (
          <motion.div
            className="w-10 h-10"
            key={"closebutton"}
            initial={{ rotate: 45, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 45, opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <Button
              onClick={() => {
                setSearchpanel(false);
                setInputtext("");
              }}
              className="group flex w-10 h-10 justify-center items-center rounded-full  cursor-pointer "
            >
              <ArrowLeft className="size-5 transition-transform group-hover:-translate-x-0.5 group-hover:scale-105 " />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        transition={{ duration: 0.5 }}
        className={`w-full  mx-auto px-0.5`}
      >
        <Input
          onChange={(e) => setInputtext(e.target.value)}
          onClick={() => {
            setSearchpanel(true);
          }}
          value={inputtext}
          placeholder="Search people"
          className=" rounded-full border-1 border-black/30 focus:border-3 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-black focus:outline-none hover:ring-0 ring-0  !text-2xl h-11  w-full"
          type="search"
        />
      </motion.div>
      <AnimatePresence>
        {Searchpanel && (
          <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="overflow-y-auto h-[94vh] scrollbar-thin origin-left absolute left-0 top-full  w-full  bg-white shadow-lg border-black/50 border-t-1 z-10"
          >
            {SearchedUsers.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center text-2xl mt-4 "
              >
                <div className="lg:mt-48 opacity-50 flex flex-col items-center justify-center">
                  {!inputtext ? "Search people here" : "No users found"}

                  <Search className=" size-20" />
                </div>
              </motion.div>
            )}
            {SearchedUsers.map((user) => (
              <motion.div key={user.id}>
                <UserCard user={user} notifications={[]} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
