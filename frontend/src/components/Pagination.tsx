interface Props {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

export default function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center gap-2 justify-end mt-4">
      <button
        disabled={page === 0}
        onClick={() => onChange(page - 1)}
        className="px-3 py-1.5 text-sm rounded-lg border border-gray-700 text-gray-300 disabled:opacity-40 hover:bg-gray-800 transition"
      >
        ← Prev
      </button>
      <span className="text-gray-500 text-sm">
        {page + 1} / {totalPages}
      </span>
      <button
        disabled={page >= totalPages - 1}
        onClick={() => onChange(page + 1)}
        className="px-3 py-1.5 text-sm rounded-lg border border-gray-700 text-gray-300 disabled:opacity-40 hover:bg-gray-800 transition"
      >
        Next →
      </button>
    </div>
  )
}
