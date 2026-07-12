"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="glass-card rounded-xl p-6">
            <div className="flex flex-col items-center text-center">
              <Skeleton className="size-28 rounded-full" />
              <Skeleton className="mt-4 h-8 w-40" />
              <Skeleton className="mt-1 h-5 w-24" />
              <div className="mt-8 grid w-full grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-8">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card rounded-xl p-5">
                <Skeleton className="mb-4 h-4 w-20" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="mt-2 h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-8">
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="glass-card rounded-xl p-6">
          <Skeleton className="mb-6 h-5 w-40" />
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </div>
        <div className="glass-card rounded-xl p-6">
          <Skeleton className="mb-6 h-5 w-40" />
          <Skeleton className="h-[200px] w-full rounded-lg" />
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <Skeleton className="mb-6 h-5 w-40" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}
