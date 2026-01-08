// app/dashboard/page.tsx
import { auth } from "@/auth";

export default async function Dashboard() {
  const session = await auth();

  if (!session) return <div>Please log in to see this page.</div>;

  return (
    <div>
      <h1>Welcome {session.user?.name}</h1>
    </div>
  );
}
