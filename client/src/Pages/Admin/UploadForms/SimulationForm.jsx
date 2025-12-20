export default function SimulationForm({ formData, updateBook }) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div>

          <input
            className="input-dark"
            placeholder="Simulation Title"
            value={formData.bookName}
            onChange={(e) => updateBook("bookName", e.target.value)}
          />
        </div>

        
        <div>
          <select
            className="input-dark"
            value={formData.grade}
            onChange={(e) => updateBook("grade", e.target.value)}
          >
            <option value="">Select Grade</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
          </select>
        </div>

        <div>
          <select
            className="input-dark"
            value={formData.difficulty}
            onChange={(e) => updateBook("difficulty", e.target.value)}
          >
            <option value="">Select Difficulty</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>



        <div>
          <input
            className="input-dark"
            placeholder="Topics"
            value={formData.topic}
            onChange={(e) => updateBook("topic", e.target.value)}
          />
        </div>

        <div>
          <input
            type="file"
            className="input-dark"
            onChange={(e) => updateBook("simulationFile", e.target.files[0])}
          />
        </div>

        <div>
          <input
            type="file"
            className="input-dark"
            onChange={(e) => updateBook("thumbnail", e.target.files[0])}
          />
        </div>
      </div>

      <div className="mb-5">
        <textarea
          className="input-dark"
          placeholder="Simulation Description"
          value={formData.description}
          onChange={(e) => updateBook("description", e.target.value)}
        />
      </div>


      <div className="mb-5">
        <textarea
          className="input-dark"
          placeholder="Prerequisites"
          value={formData.prerequisites}
          onChange={(e) => updateBook("prerequisites", e.target.value)}
        />
      </div>
    </>

  );
}
