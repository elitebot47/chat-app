import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Rootpage() {
  const session = await auth();

  if (session) {
    redirect("/c");
  } else {
    redirect("/signin");
  }
}
