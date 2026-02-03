import { useState } from 'react'
import { ALL_CITIES } from '../data/cities'

function AddCityModal({ currentIds, onAdd, onClose }) {
  const [search, setSearch] = useState('')
  const available = ALL_CITIES.filter(
    (c) => !currentIds.includes(c.id) && c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 dark:border dark:border-gray-600 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-black dark:text-white">Add city</h2>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-black dark:text-gray-300 dark:hover:text-white">
            ✕
          </button>
        </div>
        <input
          type="search"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="m-4 rounded border border-gray-300 dark:bg-gray-700 dark:border-gray-500 dark:text-white dark:placeholder-gray-400 px-3 py-2"
        />
        <ul className="overflow-auto flex-1 p-4 space-y-1">
          {available.map((c) => (
            <li key={c.id} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-black dark:text-white">{c.name}</span>
              <span className="text-sm text-gray-500 dark:text-gray-300">{c.label}</span>
              <button
                type="button"
                onClick={() => onAdd(c.id)}
                className="text-blue-600 dark:text-blue-300 text-sm font-medium"
              >
                Add
              </button>
            </li>
          ))}
          {available.length === 0 && (
            <li className="text-gray-500 dark:text-gray-300 py-4">
              {search ? 'No matching cities' : 'All cities added'}
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default AddCityModal
