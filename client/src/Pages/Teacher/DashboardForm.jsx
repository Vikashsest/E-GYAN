import { useParams } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";

const TeacherForms = () => {
  const { formType } = useParams();
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", formType, formData);
  };

  const formTitle = formType.replace("-", " ").toUpperCase();

  return (
    <div className="h-screen flex justify-center items-center bg-[#1e1f2b] px-5">
      <div className="bg-[#0f1020] p-8 rounded-2xl w-full max-w-xl shadow-2xl border border-purple-600/40 backdrop-blur-md">

        <h2 className="text-2xl font-bold text-center mb-6 text-purple-400">
          {formTitle}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Assign Test */}
          {formType === "assign-test" && (
            <>
              <SelectInput label="Class" name="class" onChange={handleChange} options={["6th", "7th", "8th", "9th", "10th"]} />
              <SelectInput label="Subject" name="subject" onChange={handleChange} options={["Math", "Science", "English", "Hindi"]} />

              <FormInput label="Test Name" name="testName" onChange={handleChange} />
              {/* <FormInput label="Max Marks" name="marks" onChange={handleChange} type="number" /> */}
              <FormInput label="Duration (Minutes)" name="duration" onChange={handleChange} type="number" />

              <FormInput label="Test Date" name="date" type="date" onChange={handleChange} />
              <FileInput label="Upload Test PDF" name="file" onChange={handleChange} />

              <SubmitBtn text="Assign Test" />
            </>
          )}

          {/* Summarize Report */}
          {formType === "summarize-report" && (
            <>
              <SelectInput label="Class" name="class" onChange={handleChange} options={["All", "6th", "7th", "8th", "9th", "10th"]} />

              <FormTextarea label="Enter Report Summary" name="report" onChange={handleChange} />
              <SubmitBtn text="Generate Summary" />
            </>
          )}

          {/* Create Quiz */}
          {formType === "create-quiz" && (
            <>
              {/* Quiz Title */}
              <FormInput
                label="Quiz Title"
                name="quizTitle"
                onChange={handleChange}
                placeholder="Enter quiz name"
        
              />

              {/* Select Chapter */}
              <SelectInput
                label="Select Chapter"
                name="chapter"
                onChange={handleChange}
                options={[
                  "Chapter 1",
                  "Chapter 2",
                  "Chapter 3",
                  "Chapter 4",
                  "Chapter 5",
                ]}
        
              />

              {/* Number of Questions */}
              <FormInput
                label="Number of Questions"
                name="totalQuestions"
                type="number"
                min="1"
                onChange={handleChange}
                placeholder="Enter question count"
        
              />

              {/* Question Type */}
              <SelectInput
                label="Question Type"
                name="questionType"
                onChange={handleChange}
                options={[
                  "MCQ",
                  "Yes/No",
                  "Fill in the Blanks",
                  "Mixed"
                ]}
        
              />

              {/* Difficulty Level */}
              <SelectInput
                label="Difficulty Level"
                name="difficulty"
                onChange={handleChange}
                options={["Easy", "Medium", "Hard"]}
        
              />

              {/* Language */}
              <SelectInput
                label="Language"
                name="language"
                onChange={handleChange}
                options={["English", "Hindi"]}
        
              />
               <Link to = "/start-quiz">
              <SubmitBtn text="Create Quiz" />
              </Link>
            </>
          )}


          {/* Notice Form */}
          {formType === "notice" && (
            <>
              <FormInput label="Notice Title" name="noticeTitle" onChange={handleChange} />
              <FormTextarea label="Description" name="description" onChange={handleChange} />

              <SelectInput label="Priority" name="priority" onChange={handleChange}
                options={["Normal", "Important", "Urgent"]} />

              <FileInput label="Attach File (Optional)" name="file" onChange={handleChange} />

              <SubmitBtn text="Publish Notice" />
            </>
          )}

          {/* Homework */}
          {formType === "homework" && (
            <>
              <SelectInput label="Subject" name="subject" onChange={handleChange} options={["Math", "Science", "English"]} />

              <FormInput label="Homework Title" name="homeworkTitle" onChange={handleChange} />
              <FormTextarea label="Instructions" name="instructions" onChange={handleChange} />

              <FormInput label="Due Date" name="dueDate" type="date" onChange={handleChange} />

              <FileInput label="Attach File" name="file" onChange={handleChange} />

              <SubmitBtn text="Save Homework" />
            </>
          )}

        </form>

      </div>
    </div>
  );
};

// Inputs
function FormInput({ label, type = "text", name, onChange }) {
  return (
    <div>
      <label className="text-sm text-gray-300">{label}</label>
      <input
        type={type}
        name={name}
        onChange={onChange}
        className="w-full mt-1 p-3 rounded-lg bg-[#222338] border border-purple-500/30 text-white 
        focus:border-purple-500 focus:ring focus:ring-purple-600/40 outline-none"

      />
    </div>
  );
}

function SelectInput({ label, name, options, onChange }) {
  return (
    <div>
      <label className="text-sm text-gray-300">{label}</label>
      <select
        name={name}
        className="w-full mt-1 p-3 rounded-lg bg-[#222338] border border-purple-500/30 text-white
        focus:border-purple-500 focus:ring focus:ring-purple-600/40 outline-none"
        onChange={onChange}

      >
        <option value="">Select {label}</option>
        {options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

function FileInput({ label, name, onChange }) {
  return (
    <div>
      <label className="text-sm text-gray-300">{label}</label>
      <input
        type="file"
        name={name}
        onChange={onChange}
        className="w-full mt-1 p-2 rounded-lg bg-[#222338] border border-purple-500/30 text-white"
      />
    </div>
  );
}

function FormTextarea({ label, name, onChange }) {
  return (
    <div>
      <label className="text-sm text-gray-300">{label}</label>
      <textarea
        name={name}
        rows="4"
        onChange={onChange}
        className="w-full mt-1 p-3 rounded-lg bg-[#222338] border border-purple-500/30 text-white
        focus:border-purple-500 focus:ring focus:ring-purple-600/40 outline-none"

      ></textarea>
    </div>
  );
}

function SubmitBtn({ text }) {
  return (
    <button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 py-3 rounded-lg text-white font-semibold
     hover:opacity-90 shadow-lg">
      {text}
    </button>
  );
}

export default TeacherForms;
