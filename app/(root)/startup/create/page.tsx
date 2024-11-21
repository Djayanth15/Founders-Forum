import StartupForm from "@/components/StartupForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await auth();
  if (!session) redirect("/");
  return (
    <>
      <section className="pink_container">
        <h1 className="heading">Submit your Startup</h1>
      </section>

      <StartupForm />
    </>
  );
};

export default page;
