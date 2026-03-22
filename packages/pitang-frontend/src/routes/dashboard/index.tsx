import { createFileRoute } from "@tanstack/react-router";
import { User, Package } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { StatCard } from "@/components/dashboard/stat-card";
import { RecentList, type RecentItem } from "@/components/dashboard/recent-list";

export const Route = createFileRoute("/dashboard/")({
  loader: async () => {
    const [usersRes, productsRes] = await Promise.all([
      fetch("https://dummyjson.com/users?limit=5"),
      fetch("https://dummyjson.com/products?limit=5")
    ]);
    const usersData = await usersRes.json();
    const productsData = await productsRes.json();

    return {
      totalUsers: usersData.total,
      recentUsers: usersData.users.map((u: any) => ({
        id: u.id,
        title: `${u.firstName} ${u.lastName}`,
        subtitle: u.email,
        imageUrl: u.image,
      })) as RecentItem[],
      totalProducts: productsData.total,
      recentProducts: productsData.products.map((p: any) => ({
        id: p.id,
        title: p.title,
        subtitle: p.category,
        extra: `$${p.price.toFixed(2)}`,
        imageUrl: p.thumbnail,
      })) as RecentItem[],
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { loggedUser } = useAuth();
  const { totalUsers, recentUsers, totalProducts, recentProducts } = Route.useLoaderData();

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight p-2">Dashboard</h2>
      </div>

      <div className="mb-4 p-4">
        <p className="text-muted-foreground">Bem vindo, {loggedUser?.firstName}!</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-4">
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={User}
          description="Registered users in the system"
        />
        <StatCard
          title="Total Products"
          value={totalProducts}
          icon={Package}
          description="Products available in the catalog"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 p-4">
        <RecentList
          title="Recent Users"
          description="The most recently registered users."
          items={recentUsers}
        />
        <RecentList
          title="Recent Products"
          description="Latest products added to the catalog."
          items={recentProducts}
        />
      </div>
    </div>
  );
}
