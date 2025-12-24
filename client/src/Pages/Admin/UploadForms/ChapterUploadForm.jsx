import { useState } from "react";
import { getRepository } from "../../../apiServices/apiRepository";

export default function ChaptersSection() {
    const [showForm, setShowForm] = useState(false);
    const [resourceOptions, setResourceOptions] = useState([]);
    const [loadingResources, setLoadingResources] = useState(false);


    const [chapterForm, setChapterForm] = useState({
        resourceType: "",
        link: "",
        file: null,
        chapterNumber: "",
        thumbnail: null,
    });

    const [chaptersList, setChaptersList] = useState([]);
    const [openPartLectureId, setOpenPartLectureId] = useState(null);

    const [partForm, setPartForm] = useState({
        number: "",
        link: "",
        thumbnail: null,
    });


    const fetchResources = async () => {
        if (resourceOptions.length > 0) return; // dobara call na ho

        try {
            setLoadingResources(true);
            const res = await getRepository("resource");

            // agar response direct array hai
            setResourceOptions(res);
        } catch (err) {
            console.error("Failed to load resources");
        } finally {
            setLoadingResources(false);
        }
    };


    const handleChange = (key, value) => {
        setChapterForm((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleClear = () => {
        setChapterForm({
            resourceType: "",
            link: "",
            file: null,
            chapterNumber: "",
            thumbnail: null,
        });
        setShowForm(false);
    };

    const getTitleByType = (type) => {
        if (type === "pdf") return "Chapter";
        if (type === "video") return "Lecture";
        if (type === "audio") return "Audio";
        if (type === "simulation") return "Simulation";
        return "Resource";
    };

    const handleUpload = () => {
        if (!chapterForm.resourceType) return;

        setChaptersList((prev) => [
            ...prev,
            {
                id: Date.now(),
                resourceType: chapterForm.resourceType,
                title: getTitleByType(chapterForm.resourceType),
                chapterNumber: chapterForm.chapterNumber,
                parts: [],
            },
        ]);

        handleClear();
    };


    const handlePartUpload = (lectureId) => {
        setChaptersList((prev) =>
            prev.map((item) =>
                item.id === lectureId
                    ? {
                        ...item,
                        parts: [
                            ...item.parts,
                            {
                                id: Date.now(),
                                number: partForm.number,
                                link: partForm.link,
                                thumbnail: partForm.thumbnail,
                            },
                        ],
                    }
                    : item
            )
        );

        setPartForm({ number: "", link: "", thumbnail: null });
        setOpenPartLectureId(null);
    };


    const handleDeletePart = (lectureId, partId) => {
        setChaptersList((prev) =>
            prev.map((item) =>
                item.id === lectureId
                    ? {
                        ...item,
                        parts: item.parts.filter((p) => p.id !== partId),
                    }
                    : item
            )
        );
    };



    return (
        <div className="bg-[#0f172a] border border-white/10 rounded-xl p-6 mt-6">

            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-white">Chapters</h2>
                    <p className="text-sm text-white/60">
                        Upload chapter resources
                    </p>
                </div>

                <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-primaryBlue text-white rounded-md"
                >
                    + Add Chapter
                </button>
            </div>

            {/* FORM */}
            {showForm && (
                <div className="border border-white/10 rounded-lg p-6 mb-6 space-y-4">

                    {/* Resource Type */}
                    <div>
                        <label className="label-dark">Resource Type</label>
                        <select
                            className="input-dark"
                            value={chapterForm.resourceType}
                            onFocus={fetchResources}   // 👈 click/open par API call
                            onChange={(e) =>
                                handleChange("resourceType", e.target.value)
                            }
                        >
                            <option value="">
                                {loadingResources ? "Loading..." : "Select resource"}
                            </option>

                            {resourceOptions.map((item) => (
                                <option key={item.id} value={item.text}>
                                    {item.text.toUpperCase()}
                                </option>
                            ))}
                        </select>

                    </div>

                    {/* Video / Audio Link */}
                    {(chapterForm.resourceType === "video" ||
                        chapterForm.resourceType === "audio") && (
                            <div>
                                <label className="label-dark">Resource Link</label>
                                <input
                                    className="input-dark"
                                    placeholder="Enter link"
                                    value={chapterForm.link}
                                    onChange={(e) =>
                                        handleChange("link", e.target.value)
                                    }
                                />
                            </div>
                        )}

                    {/* PDF File */}
                    {chapterForm.resourceType === "pdf" && (
                        <div>
                            <label className="label-dark">Upload PDF</label>
                            <input
                                type="file"
                                accept=".pdf"
                                className="input-dark"
                                onChange={(e) =>
                                    handleChange("file", e.target.files[0])
                                }
                            />
                        </div>
                    )}

                    {/* Chapter Number */}
                    <div>
                        <label className="label-dark">Chapter Number</label>
                        <input
                            type="number"
                            className="input-dark"
                            value={chapterForm.chapterNumber}
                            onChange={(e) =>
                                handleChange("chapterNumber", e.target.value)
                            }
                        />
                    </div>

                    {/* Thumbnail */}
                    <div>
                        <label className="label-dark">Thumbnail</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="input-dark"
                            onChange={(e) =>
                                handleChange("thumbnail", e.target.files[0])
                            }
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            onClick={handleClear}
                            className="px-5 py-2 border border-white/20 
              text-white/80 rounded-md"
                        >
                            Clear
                        </button>

                        <button
                            onClick={handleUpload}
                            className="px-6 py-2 bg-primaryBlue 
              text-white rounded-md"
                        >
                            Upload
                        </button>
                    </div>
                </div>
            )}

            {chaptersList.map((item) => (
                <div
                    key={item.id}
                    className="bg-black/30 border border-white/10 rounded-lg p-4 mb-4"
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-white font-medium">{item.title}</p>
                            <p className="text-xs text-white/50">
                                {item.chapterNumber}
                            </p>
                        </div>

                        {/* 🗑 Delete Button */}
                        <button
                            onClick={() => handleDeleteLecture(item.id)}
                            className="text-red-400 hover:text-red-500 text-sm"
                        >
                            Delete
                        </button>
                    </div>


                    {/* ✅ ADD PARTS BUTTON (lecture ke niche) */}
                    {(item.resourceType === "video" ||
                        item.resourceType === "audio") && (
                            <button
                                onClick={() =>
                                    setOpenPartLectureId(
                                        openPartLectureId === item.id ? null : item.id
                                    )
                                }
                                className="mt-3 px-4 py-1 bg-primaryBlue text-sm text-white rounded"
                            >
                                + Add Parts
                            </button>
                        )}

                    {/* ✅ PART FORM (same lecture ke andar open) */}
                    {openPartLectureId === item.id && (
                        <div className="mt-4 border border-white/10 rounded-lg p-4 space-y-3">

                            {/* Number */}
                            <input
                                type="number"
                                className="input-dark"
                                placeholder="Part Number"
                                value={partForm.number}
                                onChange={(e) =>
                                    setPartForm({ ...partForm, number: e.target.value })
                                }
                            />

                            {/* Resource Link */}
                            <input
                                className="input-dark"
                                placeholder="Resource Link"
                                value={partForm.link}
                                onChange={(e) =>
                                    setPartForm({ ...partForm, link: e.target.value })
                                }
                            />

                            {/* Thumbnail */}
                            <input
                                type="file"
                                accept="image/*"
                                className="input-dark"
                                onChange={(e) =>
                                    setPartForm({
                                        ...partForm,
                                        thumbnail: e.target.files[0],
                                    })
                                }
                            />

                            {/* Upload Button */}
                            <button
                                onClick={() => handlePartUpload(item.id)}
                                className="w-full py-2 bg-green-600 text-white rounded-md"
                            >
                                Upload Part
                            </button>
                        </div>
                    )}

                    {item.parts.length > 0 && (
                        <div className="mt-3 space-y-2">
                            {item.parts.map((p) => (
                                <div
                                    key={p.id}
                                    className="flex items-center justify-between 
                   bg-black/40 border border-white/10 
                   rounded px-3 py-2"
                                >
                                    <span className="text-sm text-white/70">
                                        ▶ Part {p.number}
                                    </span>

                                    {/* 🗑 Delete Part */}
                                    <button
                                        onClick={() => handleDeletePart(item.id, p.id)}
                                        className="text-xs text-red-400 hover:text-red-500"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            ))}

        </div>
    );
}
