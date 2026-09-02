import React from 'react'

export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white px-4 pt-10">
        <div className="mx-auto max-w-2xl space-y-4">

          {/* Profile */}
          <div className="rounded-2xl border border-red-100 bg-white p-6">
            <div className="mx-auto h-24 w-24 rounded-full bg-gray-200 skeleton" />

            <div className="mx-auto mt-4 h-5 w-32 rounded bg-gray-200 skeleton" />

            <div className="mx-auto mt-2 h-4 w-44 rounded bg-gray-100 skeleton" />

            <div className="mt-5 h-12 rounded-xl bg-gray-100 skeleton" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-red-100 bg-white p-4"
              >
                <div className="mx-auto h-6 w-6 rounded bg-gray-200 skeleton" />

                <div className="mx-auto mt-2 h-5 w-8 rounded bg-gray-200 skeleton" />

                <div className="mx-auto mt-2 h-3 w-12 rounded bg-gray-100 skeleton" />
              </div>
            ))}
          </div>

          {/* Information */}
          <div className="rounded-2xl border border-red-100 bg-white p-6">
            <div className="h-5 w-40 rounded bg-gray-200 skeleton" />

            <div className="mt-5 space-y-4">
              <div className="h-10 rounded bg-gray-100 skeleton" />
              <div className="h-10 rounded bg-gray-100 skeleton" />
              <div className="h-10 rounded bg-gray-100 skeleton" />
              <div className="h-10 rounded bg-gray-100 skeleton" />
            </div>
          </div>
        </div>
      </div>
  )
}
