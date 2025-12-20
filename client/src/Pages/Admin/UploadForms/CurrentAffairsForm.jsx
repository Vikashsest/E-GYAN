import JoditEditor from "jodit-react";
import { useRef } from "react";

export function CurrentAffairsForm({ bookData, updateBook }) {
  const editor = useRef(null);

  return (
    <>
     <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
      {/* 🔹 Edition Title */}
      <div>
        <label className="label-dark">Edition Title</label>
        <input
          className="input-dark"
          placeholder="January 2025 Current Affairs"
          value={bookData.bookName}
          onChange={(e) => updateBook("bookName", e.target.value)}
        />
      </div>

       {/* 🔹 News Title */}
      <div>
        <label className="label-dark">News Title</label>
        <input
          className="input-dark"
          placeholder="ISRO launches new satellite"
          value={bookData.title}
          onChange={(e) => updateBook("title", e.target.value)}
        />
      </div>
      </div>

      {/* 🔹 Month & Year */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div>
          <label className="label-dark">Month</label>
          <select
            className="input-dark"
            value={bookData.month}
            onChange={(e) => updateBook("month", e.target.value)}
          >
            <option value="">Select Month</option>
            <option>January</option>
            <option>February</option>
            <option>March</option>
          </select>
        </div>

        <div>
          <label className="label-dark">Year</label>
          <input
            className="input-dark"
            placeholder="2025"
            value={bookData.year}
            onChange={(e) => updateBook("year", e.target.value)}
          />
        </div>
      </div>

      {/* 🔹 Full Description */}
      <div className="mb-5">
        <label className="label-dark">Full Description</label>
        <JoditEditor
          ref={editor}
          value={bookData.description}
          config={{ height: 300 }}
          onChange={(content) => updateBook("description", content)}
        />
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
      {/* 🔹 News Category */}
      <div>
        <label className="label-dark">Category Type</label>
        <select
          className="input-dark"
          value={bookData.newsCategory}
          onChange={(e) => updateBook("newsCategory", e.target.value)}
        >
          <option value="">Select Category</option>
          <option>Science & Technology</option>
          <option>Economy</option>
          <option>Environment</option>
          <option>Sports</option>
          <option>Daily Current Affairs</option>
        </select>
      </div>

      {/* 🔹 Date */}
      <div>
        <label className="label-dark">Date</label>
        <input
          type="date"
          className="input-dark"
          value={bookData.date}
          onChange={(e) => updateBook("date", e.target.value)}
        />
      </div>

      {/* 🔹 Source */}
      <div>
        <label className="label-dark">Source / Author</label>
        <input
          className="input-dark"
          placeholder="PIB / The Hindu"
          value={bookData.source}
          onChange={(e) => updateBook("source", e.target.value)}
        />
      </div>

      {/* 🔹 Upload File */}
      <div>
        <label className="label-dark">Upload File (PDF / Image)</label>
        <input
          type="file"
          accept=".pdf,image/*"
          className="input-dark"
          onChange={(e) => updateBook("file", e.target.files[0])}
        />
      </div>

      {/* 🔹 External Link */}
      <div>
        <label className="label-dark">External News Link</label>
        <input
          type="url"
          className="input-dark"
          placeholder="https://example.com"
          value={bookData.link}
          onChange={(e) => updateBook("link", e.target.value)}
        />
      </div>
      </div>
    </>
  );
}
