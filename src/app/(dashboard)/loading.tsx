import { Loader } from "@/components/shared/loader"

export default function DashboardLoading() {
  return (
    <div className="flex h-full min-h-[50vh] items-center justify-center">
      <Loader size="lg" text="Loading..." />
    </div>
  )
}
