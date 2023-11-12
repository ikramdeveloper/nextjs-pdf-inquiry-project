import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { UserButton, auth } from "@clerk/nextjs";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { Toaster } from "react-hot-toast";

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-rose-100 to-teal-100">
      <section className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <article className="flex items-center">
            <h1 className="mr-3 text-5xl font-semibold">
              Chat with My Chat Pdf
            </h1>
            <UserButton afterSignOutUrl="/" />
          </article>

          <article className="flex mt-2">
            {!!userId && <Button>Go to chats</Button>}
          </article>

          <p className="max-w-xl mt-1 text-lg text-slate-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos,
            sapiente neque. Quisquam dignissimos, libero recusandae, obcaecati
            expedita ipsam esse cum nulla hic rerum reiciendis. Provident
            praesentium sit molestiae quam nostrum.
          </p>

          <article className="w-full mt-4">
            {!!userId ? (
              <FileUpload />
            ) : (
              <Link href="sign-in">
                <Button>
                  <span>Login to get started</span>
                  <LogIn className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </article>
        </div>
      </section>
      <Toaster />
    </div>
  );
}
