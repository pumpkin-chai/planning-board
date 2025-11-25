import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="bg-muted h-14 stretch max-w-96 rounded-xl" />
      <Skeleton className="bg-muted h-8 stretch max-w-64" />
    </div>
  );
}
