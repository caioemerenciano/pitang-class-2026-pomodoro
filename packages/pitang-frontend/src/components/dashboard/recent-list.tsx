import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface RecentItem {
  id: string | number;
  title: string;
  subtitle?: string;
  extra?: string;
  imageUrl?: string;
}

interface RecentListProps {
  title: string;
  description?: string;
  items: RecentItem[];
  loading?: boolean;
}

export function RecentList({
  title,
  description,
  items,
  loading,
}: RecentListProps) {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-1/3 bg-muted animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border-b last:border-0 pb-4 last:pb-0">
                {item.imageUrl && (
                  <div className="h-9 w-9 rounded-full overflow-hidden bg-muted">
                    <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="flex flex-1 items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium leading-none">
                      {item.title}
                    </span>
                    {item.subtitle && (
                      <span className="text-sm text-muted-foreground mt-1">
                        {item.subtitle}
                      </span>
                    )}
                  </div>
                  {item.extra && (
                    <div className="font-medium text-sm">{item.extra}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
