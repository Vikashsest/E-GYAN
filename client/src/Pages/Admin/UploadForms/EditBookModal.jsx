import { toast } from "react-toastify";

export default function EditBookModal({
    isOpen,
    bookData,
    setBookData,
    onClose,
    onSave,
}) {
    if (!isOpen || !bookData) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
            <div className="bg-cardBg w-full max-w-lg rounded-xl shadow-xl p-6 border border-gray-700">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-xl font-bold">Edit Book</h3>
                    <button
                        onClick={onClose}
                        className="text-2xl hover:text-primaryRed"
                    >
                        ✕
                    </button>
                </div>

                {/* FORM */}
                <div className="space-y-4">

                    {/* CATEGORY */}
                    <div>
                        <label className="text-sm text-gray-400">Category</label>
                        <input
                            value={bookData.category || ""}
                            onChange={(e) =>
                                setBookData({ ...bookData, category: e.target.value })
                            }
                            className="w-full mt-1 px-3 py-2 bg-darkBg border border-gray-600 rounded"
                        />
                    </div>

                    {/* EDUCATION LEVEL */}
                    <div>
                        <label className="text-sm text-gray-400">Education Level</label>
                        <input
                            value={bookData.educationLevel || ""}
                            onChange={(e) =>
                                setBookData({
                                    ...bookData,
                                    educationLevel: e.target.value,
                                })
                            }
                            className="w-full mt-1 px-3 py-2 bg-darkBg border border-gray-600 rounded"
                        />
                    </div>

                    {/* SUBJECT */}
                    <div>
                        <label className="text-sm text-gray-400">Subject</label>
                        <input
                            value={bookData.subject || ""}
                            onChange={(e) =>
                                setBookData({ ...bookData, subject: e.target.value })
                            }
                            className="w-full mt-1 px-3 py-2 bg-darkBg border border-gray-600 rounded"
                        />
                    </div>

                    {/* BOOK NAME */}
                    <div>
                        <label className="text-sm text-gray-400">Book Name</label>
                        <input
                            value={bookData.bookName || ""}
                            onChange={(e) =>
                                setBookData({ ...bookData, bookName: e.target.value })
                            }
                            className="w-full mt-1 px-3 py-2 bg-darkBg border border-gray-600 rounded"
                        />
                    </div>

                    {/* LANGUAGE */}
                    <div>
                        <label className="text-sm text-gray-400">Language</label>
                        <select
                            value={bookData.language || ""}
                            onChange={(e) =>
                                setBookData({ ...bookData, language: e.target.value })
                            }
                            className="w-full mt-1 px-3 py-2 bg-darkBg border border-gray-600 rounded"
                        >
                            <option value="">Select Language</option>
                            <option value="English">English</option>
                            <option value="Hindi">Hindi</option>
                        </select>
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-600 rounded hover:bg-gray-700"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => {
                            const ok = window.confirm(
                                "Do you want to update this content?"
                            );
                            if (!ok) return;

                            onSave(bookData);
                        }}
                        className="px-4 py-2 bg-primaryBlue hover:bg-hoverBlue rounded"
                    >
                        Save
                    </button>


                </div>
            </div>
        </div>
    );
}
