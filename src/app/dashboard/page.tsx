import { auth, signOut } from "@/auth";
import Header from "@/components/ui/Header";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  // Server Action for logging out
  async function logout() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Pass the session user and the logout action to the header */}
      <Header user={session.user} logoutAction={logout} />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-xl border bg-background p-6 shadow-sm">
          <h2 className="text-xl font-semibold">
            Welcome back, {session.user?.name ?? "User"} 👋
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            You are logged in as{" "}
            <span className="font-medium">{session.user?.email}</span>
          </p>
        </div>
      </main>
    </div>
  );
}
