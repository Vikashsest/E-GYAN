export function SchoolEducationForm({
  bookData,
  updateBook,
  subjects,
  levels,
}) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div>
          <label className="label-dark">EducationLevel</label>
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

        {/* Subject & Class */}
        <div>
          <label className="label-dark">Subject</label>
          <select
            className="input-dark"
            value={bookData.subject}
            onChange={(e) => updateBook("subject", e.target.value)}
          >
            <option value="">Select subject</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.text}>
                {sub.text}
              </option>
            ))}
          </select>

        </div>

        {/* Book Name */}
        <div className="mb-5">
          <label className="label-dark">Book Name *</label>
          <input
            className="input-dark"
            value={bookData.bookName}
            onChange={(e) => updateBook("bookName", e.target.value)}
          />
        </div>
        <div>
          <label className="label-dark">Language</label>
          <select className="input-dark">
            <option>English</option>
            <option>Hindi</option>
          </select>
        </div>
      </div>
    </>
  );
}
