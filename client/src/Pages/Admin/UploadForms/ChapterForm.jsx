export default function ChapterModal({
  isOpen,
  onClose,
  chapterData,
  setChapterData,
  onSave,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-[#0f172a] w-full max-w-md rounded-xl p-6 border border-white/10">

        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-semibold text-white">
            Add Chapter
          </h3>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Resource Type */}
        <div className="mb-4">
          <label className="label-dark">Resource Type</label>
          <select
            className="input-dark"
            value={chapterData.resourceType}
            onChange={(e) =>
              setChapterData({ ...chapterData, resourceType: e.target.value })
            }
          >
            <option value="">Select Resource</option>
            <option value="pdf">PDF</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
          </select>
        </div>

        {/* Chapter Number */}
        <div className="mb-4">
          <label className="label-dark">Chapter Number</label>
          <input
            type="number"
            className="input-dark"
            placeholder="e.g. 1"
            value={chapterData.chapterNumber}
            onChange={(e) =>
              setChapterData({ ...chapterData, chapterNumber: e.target.value })
            }
          />
        </div>

        {/* PDF */}
        {chapterData.resourceType === "pdf" && (
          <div className="mb-4">
            <label className="label-dark">Upload PDF</label>
            <input
              type="file"
              accept=".pdf"
              className="input-dark"
              onChange={(e) =>
                setChapterData({ ...chapterData, file: e.target.files[0] })
              }
            />
          </div>
        )}

        {/* Video */}
        {chapterData.resourceType === "video" && (
          <div className="mb-4">
            <label className="label-dark">Video Link</label>
            <input
              type="text"
              className="input-dark"
              placeholder="https://youtube.com/..."
              onChange={(e) =>
                setChapterData({ ...chapterData, link: e.target.value })
              }
            />
          </div>
        )}

        {/* Audio */}
        {chapterData.resourceType === "audio" && (
          <div className="mb-4">
            <label className="label-dark">Upload Audio</label>
            <input
              type="file"
              accept="audio/*"
              className="input-dark"
              onChange={(e) =>
                setChapterData({ ...chapterData, file: e.target.files[0] })
              }
            />
          </div>
        )}

        {/* Thumbnail */}
        <div className="mb-5">
          <label className="label-dark">Thumbnail</label>
          <input
            type="file"
            accept="image/*"
            className="input-dark"
            onChange={(e) =>
              setChapterData({ ...chapterData, thumbnail: e.target.files[0] })
            }
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-white/20 text-white/80 rounded-md hover:bg-white/10"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className="px-4 py-2 bg-primaryBlue text-white rounded-md hover:bg-primaryBlue/90"
          >
            Save Chapter
          </button>
        </div>
      </div>
    </div>
  );
}
