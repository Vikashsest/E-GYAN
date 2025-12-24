export function SchoolEducationForm({
  bookData,
  updateBook,
  levels,
  languages
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">

      {/* Education Level */}
      <div>
        <label className="label-dark">Education Level</label>
        <select
          className="input-dark"
          value={bookData.educationLevel}
          onChange={(e) => updateBook("educationLevel", e.target.value)}
        >
          <option value="">Select class</option>
          {levels.map((lvl) => (
            <option key={lvl.id} value={lvl.text}>
              {lvl.text}
            </option>
          ))}
        </select>
      </div>


      
      <div>
        <label className="label-dark">Subject Name *</label>
        <input
          className="input-dark"
          value={bookData.subject}
          onChange={(e) => updateBook("subject", e.target.value)}
        />
      </div>

      {/* Book Name */}
      <div>
        <label className="label-dark">Book Name *</label>
        <input
          className="input-dark"
          value={bookData.bookName}
          onChange={(e) => updateBook("bookName", e.target.value)}
        />
      </div>

      {/* Language */}
      <div>
        <label className="label-dark">Language</label>
        <select
          className="input-dark"
          value={bookData.language}
          onChange={(e) => updateBook("language", e.target.value)}
        >
          <option value="">Select language</option>
          {languages.map((lang) => (
            <option key={lang.id} value={lang.text}>
              {lang.text}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
}
