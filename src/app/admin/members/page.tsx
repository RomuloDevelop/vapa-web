import { Suspense } from "react";
import { getUsers, getUsersCount } from "@/lib/services/members";
import { MembersTable } from "./MembersTable";

export const dynamic = "force-dynamic";

export default async function AdminMembersPage() {
  const [users, totalCount] = await Promise.all([
    getUsers(),
    getUsersCount(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-sm text-foreground-subtle mt-1">
            {totalCount} {totalCount === 1 ? "user" : "users"}
          </p>
        </div>
      </div>
      <Suspense>
        <MembersTable initialMembers={users} />
      </Suspense>
    </div>
  );
}
