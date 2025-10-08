'use client';

interface VaultFiltersProps {
  folders: string[];
  tags: string[];
  selectedFolder: string;
  selectedTags: string[];
  onFolderChange: (folder: string) => void;
  onTagToggle: (tag: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export default function VaultFilters({
  folders,
  tags,
  selectedFolder,
  selectedTags,
  onFolderChange,
  onTagToggle,
  searchTerm,
  onSearchChange
}: VaultFiltersProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-6">
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Search your vault..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-black dark:text-white bg-white dark:bg-gray-700 focus:border-indigo-500 focus:outline-none"
        />
      </div>

      {/* Folders */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Folders</h3>
        <div className="flex flex-wrap gap-2">
          {['All', ...folders].map((folder) => (
            <button
              key={folder}
              onClick={() => onFolderChange(folder)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedFolder === folder
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
              }`}
            >
              📁 {folder}
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagToggle(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                }`}
              >
                🏷️ {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}