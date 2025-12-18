const API_URL = import.meta.env.VITE_API_URL;

export async function getAnnouncements() {
  try {
    const res = await fetch(`${API_URL}/annoucements`, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) throw new Error("Failed to fetch annoucements");

    return await res.json();
  } catch (err) {
    console.error("getAnnouncements error:", err);
    throw err;
  }
}

export async function addAnnouncement(data) {
  try {
    const res = await fetch(`${API_URL}/annoucements`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to add announcement");

    return await res.json();
  } catch (err) {
    console.error("addAnnouncement error:", err);
    throw err;
  }
}

export async function updateAnnouncement(id, data) {
  try {
    const res = await fetch(`${API_URL}/annoucements/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to update announcement");

    return await res.json();
  } catch (err) {
    console.error("updateAnnouncement error:", err);
    throw err;
  }
}

export async function deleteAnnouncement(id) {
  try {
    const res = await fetch(`${API_URL}/annoucements/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to delete announcement");

    return await res.json();
  } catch (err) {
    console.error("deleteAnnouncement error:", err);
    throw err;
  }
}

// "use client"

// import { useState } from "react"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Upload, Plus, Trash2, BookOpen, Video, FileText, Music, ImageIcon } from "lucide-react"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// type Part = {
//   id: number
//   chapterName: string
//   resourceType: "video" | "pdf" | "audio"
//   fileUrl: string
//   thumbnail: string
//   totalPages: number | null
//   file: File | null
//   thumbnailFile: File | null
// }

// type Chapter = {
//   id: number
//   chapterName: string
//   chapterNumber: number
//   resourceType: "pdf" | "video" | "audio"
//   fileUrl: string
//   thumbnail: string
//   totalPages: number | null
//   file: File | null
//   thumbnailFile: File | null
//   parts: Part[]
// }

// type BookData = {
//   bookName: string
//   category: string
//   subject: string
//   educationLevel: string
//   language: string
//   stateBoard: string
//   fileUrl: string
//   thumbnail: string
//   totalPages: number | null
//   thumbnailFile: File | null
//   coverFile: File | null
// }

// export default function UploadBook() {
//   const [bookData, setBookData] = useState<BookData>({
//     bookName: "",
//     category: "",
//     subject: "",
//     educationLevel: "",
//     language: "English",
//     stateBoard: "",
//     fileUrl: "",
//     thumbnail: "",
//     totalPages: null,
//     thumbnailFile: null,
//     coverFile: null,
//   })

//   const [chapters, setChapters] = useState<Chapter[]>([])

//   const updateBookData = (field: keyof BookData, value: any) => {
//     setBookData((prev) => ({ ...prev, [field]: value }))
//   }

//   const addChapter = () => {
//     const newChapter: Chapter = {
//       id: chapters.length + 1,
//       chapterName: "",
//       chapterNumber: chapters.length + 1,
//       resourceType: "pdf",
//       fileUrl: "",
//       thumbnail: "",
//       totalPages: null,
//       file: null,
//       thumbnailFile: null,
//       parts: [],
//     }
//     setChapters([...chapters, newChapter])
//   }

//   const removeChapter = (id: number) => {
//     setChapters(chapters.filter((chapter) => chapter.id !== id))
//   }

//   const updateChapter = (id: number, field: keyof Chapter, value: any) => {
//     setChapters(chapters.map((chapter) => (chapter.id === id ? { ...chapter, [field]: value } : chapter)))
//   }

//   const addPart = (chapterId: number) => {
//     setChapters(
//       chapters.map((chapter) => {
//         if (chapter.id === chapterId) {
//           const newPart: Part = {
//             id: chapter.parts.length + 1,
//             chapterName: "",
//             resourceType: "pdf",
//             fileUrl: "",
//             thumbnail: "",
//             totalPages: null,
//             file: null,
//             thumbnailFile: null,
//           }
//           return { ...chapter, parts: [...chapter.parts, newPart] }
//         }
//         return chapter
//       }),
//     )
//   }

//   const removePart = (chapterId: number, partId: number) => {
//     setChapters(
//       chapters.map((chapter) => {
//         if (chapter.id === chapterId) {
//           return { ...chapter, parts: chapter.parts.filter((part) => part.id !== partId) }
//         }
//         return chapter
//       }),
//     )
//   }

//   const updatePart = (chapterId: number, partId: number, field: keyof Part, value: any) => {
//     setChapters(
//       chapters.map((chapter) => {
//         if (chapter.id === chapterId) {
//           return {
//             ...chapter,
//             parts: chapter.parts.map((part) => (part.id === partId ? { ...part, [field]: value } : part)),
//           }
//         }
//         return chapter
//       }),
//     )
//   }

//   const handleFileUpload = (
//     chapterId: number,
//     partId: number | null,
//     file: File | null,
//     fileType: "file" | "thumbnail",
//   ) => {
//     if (file) {
//       const url = URL.createObjectURL(file)
//       if (partId === null) {
//         // Chapter file upload
//         updateChapter(chapterId, fileType === "file" ? "file" : "thumbnailFile", file)
//         updateChapter(chapterId, fileType === "file" ? "fileUrl" : "thumbnail", url)
//       } else {
//         // Part file upload
//         updatePart(chapterId, partId, fileType === "file" ? "file" : "thumbnailFile", file)
//         updatePart(chapterId, partId, fileType === "file" ? "fileUrl" : "thumbnail", url)
//       }
//     }
//   }

//   const getResourceIcon = (type: string) => {
//     switch (type) {
//       case "video":
//         return <Video className="w-4 h-4" />
//       case "pdf":
//         return <FileText className="w-4 h-4" />
//       case "audio":
//         return <Music className="w-4 h-4" />
//       default:
//         return <FileText className="w-4 h-4" />
//     }
//   }

//   const getAcceptedFileTypes = (type: string) => {
//     switch (type) {
//       case "video":
//         return "video/*"
//       case "pdf":
//         return ".pdf"
//       case "audio":
//         return "audio/*"
//       default:
//         return "*"
//     }
//   }

//   return (
//     <div className="max-w-4xl space-y-6">
//       {/* Book Details */}
//       <Card className="p-6">
//         <div className="flex items-center gap-3 mb-6">
//           <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
//             <BookOpen className="w-6 h-6 text-primary" />
//           </div>
//           <div>
//             <h3 className="text-xl font-semibold text-foreground">Book Information</h3>
//             <p className="text-sm text-muted-foreground">Enter the basic details of the book</p>
//           </div>
//         </div>

//         <div className="grid gap-6">
//           <div className="grid gap-2">
//             <Label htmlFor="bookName">Book Name *</Label>
//             <Input
//               id="bookName"
//               placeholder="Enter book name"
//               value={bookData.bookName}
//               onChange={(e) => updateBookData("bookName", e.target.value)}
//             />
//           </div>

//           <div className="grid gap-2">
//             <Label htmlFor="category">Category</Label>
//             <Select value={bookData.category} onValueChange={(value) => updateBookData("category", value)}>
//               <SelectTrigger id="category">
//                 <SelectValue placeholder="Select category" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="NCERT">NCERT</SelectItem>
//                 <SelectItem value="CBSE">CBSE</SelectItem>
//                 <SelectItem value="State Board">State Board</SelectItem>
//                 <SelectItem value="Reference">Reference</SelectItem>
//                 <SelectItem value="Fiction">Fiction</SelectItem>
//                 <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="grid gap-2">
//               <Label htmlFor="subject">Subject</Label>
//               <Select value={bookData.subject} onValueChange={(value) => updateBookData("subject", value)}>
//                 <SelectTrigger id="subject">
//                   <SelectValue placeholder="Select subject" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Mathematics">Mathematics</SelectItem>
//                   <SelectItem value="Science">Science</SelectItem>
//                   <SelectItem value="Social Science">Social Science</SelectItem>
//                   <SelectItem value="English">English</SelectItem>
//                   <SelectItem value="Hindi">Hindi</SelectItem>
//                   <SelectItem value="Physics">Physics</SelectItem>
//                   <SelectItem value="Chemistry">Chemistry</SelectItem>
//                   <SelectItem value="Biology">Biology</SelectItem>
//                   <SelectItem value="History">History</SelectItem>
//                   <SelectItem value="Geography">Geography</SelectItem>
//                   <SelectItem value="Political Science">Political Science</SelectItem>
//                   <SelectItem value="Economics">Economics</SelectItem>
//                   <SelectItem value="Accountancy">Accountancy</SelectItem>
//                   <SelectItem value="Business Studies">Business Studies</SelectItem>
//                   <SelectItem value="Computer Science">Computer Science</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="grid gap-2">
//               <Label htmlFor="educationLevel">Education Level</Label>
//               <Select
//                 value={bookData.educationLevel}
//                 onValueChange={(value) => updateBookData("educationLevel", value)}
//               >
//                 <SelectTrigger id="educationLevel">
//                   <SelectValue placeholder="Select level" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Class 1">Class 1</SelectItem>
//                   <SelectItem value="Class 2">Class 2</SelectItem>
//                   <SelectItem value="Class 3">Class 3</SelectItem>
//                   <SelectItem value="Class 4">Class 4</SelectItem>
//                   <SelectItem value="Class 5">Class 5</SelectItem>
//                   <SelectItem value="Class 6">Class 6</SelectItem>
//                   <SelectItem value="Class 7">Class 7</SelectItem>
//                   <SelectItem value="Class 8">Class 8</SelectItem>
//                   <SelectItem value="Class 9">Class 9</SelectItem>
//                   <SelectItem value="Class 10">Class 10</SelectItem>
//                   <SelectItem value="Class 11">Class 11</SelectItem>
//                   <SelectItem value="Class 12">Class 12</SelectItem>
//                   <SelectItem value="Undergraduate">Undergraduate</SelectItem>
//                   <SelectItem value="Postgraduate">Postgraduate</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="grid gap-2">
//               <Label htmlFor="language">Language</Label>
//               <Select value={bookData.language} onValueChange={(value) => updateBookData("language", value)}>
//                 <SelectTrigger id="language">
//                   <SelectValue placeholder="Select language" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="English">English</SelectItem>
//                   <SelectItem value="Hindi">Hindi</SelectItem>
//                   <SelectItem value="Tamil">Tamil</SelectItem>
//                   <SelectItem value="Telugu">Telugu</SelectItem>
//                   <SelectItem value="Marathi">Marathi</SelectItem>
//                   <SelectItem value="Bengali">Bengali</SelectItem>
//                   <SelectItem value="Gujarati">Gujarati</SelectItem>
//                   <SelectItem value="Kannada">Kannada</SelectItem>
//                   <SelectItem value="Malayalam">Malayalam</SelectItem>
//                   <SelectItem value="Punjabi">Punjabi</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="grid gap-2">
//               <Label htmlFor="stateBoard">State Board</Label>
//               <Input
//                 id="stateBoard"
//                 placeholder="e.g., Maharashtra, UP, etc."
//                 value={bookData.stateBoard}
//                 onChange={(e) => updateBookData("stateBoard", e.target.value)}
//               />
//             </div>
//           </div>

//           <div className="grid gap-2">
//             <Label htmlFor="totalPages">Total Pages</Label>
//             <Input
//               id="totalPages"
//               type="number"
//               placeholder="Enter total number of pages"
//               value={bookData.totalPages || ""}
//               onChange={(e) => updateBookData("totalPages", e.target.value ? Number.parseInt(e.target.value) : null)}
//             />
//           </div>

//           <div className="grid gap-2">
//             <Label htmlFor="thumbnail">Book Thumbnail/Cover</Label>
//             <div className="flex items-center gap-4">
//               <Button variant="outline" className="w-full bg-transparent relative" asChild>
//                 <label htmlFor="thumbnail" className="cursor-pointer">
//                   <ImageIcon className="w-4 h-4 mr-2" />
//                   {bookData.thumbnailFile ? bookData.thumbnailFile.name : "Upload Thumbnail"}
//                   <input
//                     id="thumbnail"
//                     type="file"
//                     accept="image/*"
//                     className="sr-only"
//                     onChange={(e) => {
//                       const file = e.target.files?.[0] || null
//                       if (file) {
//                         updateBookData("thumbnailFile", file)
//                         updateBookData("thumbnail", URL.createObjectURL(file))
//                       }
//                     }}
//                   />
//                 </label>
//               </Button>
//             </div>
//             {bookData.thumbnailFile && (
//               <p className="text-xs text-muted-foreground">
//                 Selected: {bookData.thumbnailFile.name} ({(bookData.thumbnailFile.size / 1024 / 1024).toFixed(2)} MB)
//               </p>
//             )}
//           </div>
//         </div>
//       </Card>

//       {/* Chapters */}
//       <Card className="p-6">
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h3 className="text-xl font-semibold text-foreground">Chapters</h3>
//             <p className="text-sm text-muted-foreground">Add and organize book chapters with multiple parts</p>
//           </div>
//           <Button onClick={addChapter} size="sm">
//             <Plus className="w-4 h-4 mr-2" />
//             Add Chapter
//           </Button>
//         </div>

//         <div className="space-y-4">
//           {chapters.map((chapter, index) => (
//             <div key={chapter.id} className="p-4 rounded-lg border border-border bg-card space-y-4">
//               <div className="flex items-center justify-between">
//                 <h4 className="font-medium text-foreground">Chapter {chapter.chapterNumber}</h4>
//                 <Button variant="ghost" size="sm" onClick={() => removeChapter(chapter.id)}>
//                   <Trash2 className="w-4 h-4 text-destructive" />
//                 </Button>
//               </div>

//               <div className="grid gap-4">
//                 <div className="grid grid-cols-3 gap-4">
//                   <div className="col-span-2 grid gap-2">
//                     <Label htmlFor={`chapterName-${chapter.id}`}>Chapter Name *</Label>
//                     <Input
//                       id={`chapterName-${chapter.id}`}
//                       placeholder="Enter chapter name"
//                       value={chapter.chapterName}
//                       onChange={(e) => updateChapter(chapter.id, "chapterName", e.target.value)}
//                     />
//                   </div>
//                   <div className="grid gap-2">
//                     <Label htmlFor={`chapterNumber-${chapter.id}`}>Chapter Number</Label>
//                     <Input
//                       id={`chapterNumber-${chapter.id}`}
//                       type="number"
//                       value={chapter.chapterNumber}
//                       onChange={(e) => updateChapter(chapter.id, "chapterNumber", Number.parseInt(e.target.value))}
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="grid gap-2">
//                     <Label htmlFor={`resourceType-${chapter.id}`}>Resource Type</Label>
//                     <Select
//                       value={chapter.resourceType}
//                       onValueChange={(value: "pdf" | "video" | "audio") =>
//                         updateChapter(chapter.id, "resourceType", value)
//                       }
//                     >
//                       <SelectTrigger id={`resourceType-${chapter.id}`}>
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="pdf">
//                           <div className="flex items-center gap-2">
//                             <FileText className="w-4 h-4" />
//                             <span>PDF</span>
//                           </div>
//                         </SelectItem>
//                         <SelectItem value="video">
//                           <div className="flex items-center gap-2">
//                             <Video className="w-4 h-4" />
//                             <span>Video</span>
//                           </div>
//                         </SelectItem>
//                         <SelectItem value="audio">
//                           <div className="flex items-center gap-2">
//                             <Music className="w-4 h-4" />
//                             <span>Audio</span>
//                           </div>
//                         </SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="grid gap-2">
//                     <Label htmlFor={`totalPages-${chapter.id}`}>Total Pages</Label>
//                     <Input
//                       id={`totalPages-${chapter.id}`}
//                       type="number"
//                       placeholder="Number of pages"
//                       value={chapter.totalPages || ""}
//                       onChange={(e) =>
//                         updateChapter(chapter.id, "totalPages", e.target.value ? Number.parseInt(e.target.value) : null)
//                       }
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="grid gap-2">
//                     <Label htmlFor={`chapterFile-${chapter.id}`}>Chapter File</Label>
//                     <Button variant="outline" size="sm" className="w-full bg-transparent relative" asChild>
//                       <label htmlFor={`chapterFile-${chapter.id}`} className="cursor-pointer">
//                         {getResourceIcon(chapter.resourceType)}
//                         <span className="ml-2">{chapter.file ? chapter.file.name : "Upload File"}</span>
//                         <input
//                           id={`chapterFile-${chapter.id}`}
//                           type="file"
//                           accept={getAcceptedFileTypes(chapter.resourceType)}
//                           className="sr-only"
//                           onChange={(e) => handleFileUpload(chapter.id, null, e.target.files?.[0] || null, "file")}
//                         />
//                       </label>
//                     </Button>
//                     {chapter.file && (
//                       <p className="text-xs text-muted-foreground">
//                         {chapter.file.name} ({(chapter.file.size / 1024 / 1024).toFixed(2)} MB)
//                       </p>
//                     )}
//                   </div>

//                   <div className="grid gap-2">
//                     <Label htmlFor={`chapterThumbnail-${chapter.id}`}>Thumbnail</Label>
//                     <Button variant="outline" size="sm" className="w-full bg-transparent relative" asChild>
//                       <label htmlFor={`chapterThumbnail-${chapter.id}`} className="cursor-pointer">
//                         <ImageIcon className="w-4 h-4 mr-2" />
//                         {chapter.thumbnailFile ? chapter.thumbnailFile.name : "Upload Thumbnail"}
//                         <input
//                           id={`chapterThumbnail-${chapter.id}`}
//                           type="file"
//                           accept="image/*"
//                           className="sr-only"
//                           onChange={(e) => handleFileUpload(chapter.id, null, e.target.files?.[0] || null, "thumbnail")}
//                         />
//                       </label>
//                     </Button>
//                     {chapter.thumbnailFile && (
//                       <p className="text-xs text-muted-foreground">{chapter.thumbnailFile.name}</p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Parts Section */}
//                 <div className="space-y-3 pt-2 border-t border-border">
//                   <div className="flex items-center justify-between">
//                     <Label className="text-sm font-medium">Chapter Parts (Sub-sections)</Label>
//                     <Button variant="outline" size="sm" onClick={() => addPart(chapter.id)}>
//                       <Plus className="w-3 h-3 mr-1" />
//                       Add Part
//                     </Button>
//                   </div>

//                   {chapter.parts.length > 0 && (
//                     <div className="space-y-3">
//                       {chapter.parts.map((part, partIndex) => (
//                         <div
//                           key={part.id}
//                           className="p-3 rounded-md border border-border/50 bg-background/50 space-y-3"
//                         >
//                           <div className="flex items-center justify-between">
//                             <span className="text-sm font-medium text-muted-foreground">Part {partIndex + 1}</span>
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               onClick={() => removePart(chapter.id, part.id)}
//                               className="h-7 w-7 p-0"
//                             >
//                               <Trash2 className="w-3 h-3 text-destructive" />
//                             </Button>
//                           </div>

//                           <div className="grid gap-3">
//                             <div className="grid gap-2">
//                               <Label htmlFor={`partName-${chapter.id}-${part.id}`}>Part Name</Label>
//                               <Input
//                                 id={`partName-${chapter.id}-${part.id}`}
//                                 placeholder="e.g., Introduction, Exercise, Summary"
//                                 value={part.chapterName}
//                                 onChange={(e) => updatePart(chapter.id, part.id, "chapterName", e.target.value)}
//                               />
//                             </div>

//                             <div className="grid grid-cols-2 gap-3">
//                               <div className="grid gap-2">
//                                 <Label htmlFor={`partType-${chapter.id}-${part.id}`}>Resource Type</Label>
//                                 <Select
//                                   value={part.resourceType}
//                                   onValueChange={(value: "pdf" | "video" | "audio") =>
//                                     updatePart(chapter.id, part.id, "resourceType", value)
//                                   }
//                                 >
//                                   <SelectTrigger id={`partType-${chapter.id}-${part.id}`}>
//                                     <SelectValue />
//                                   </SelectTrigger>
//                                   <SelectContent>
//                                     <SelectItem value="pdf">
//                                       <div className="flex items-center gap-2">
//                                         <FileText className="w-4 h-4" />
//                                         <span>PDF</span>
//                                       </div>
//                                     </SelectItem>
//                                     <SelectItem value="video">
//                                       <div className="flex items-center gap-2">
//                                         <Video className="w-4 h-4" />
//                                         <span>Video</span>
//                                       </div>
//                                     </SelectItem>
//                                     <SelectItem value="audio">
//                                       <div className="flex items-center gap-2">
//                                         <Music className="w-4 h-4" />
//                                         <span>Audio</span>
//                                       </div>
//                                     </SelectItem>
//                                   </SelectContent>
//                                 </Select>
//                               </div>

//                               <div className="grid gap-2">
//                                 <Label htmlFor={`partPages-${chapter.id}-${part.id}`}>Total Pages</Label>
//                                 <Input
//                                   id={`partPages-${chapter.id}-${part.id}`}
//                                   type="number"
//                                   placeholder="Pages"
//                                   value={part.totalPages || ""}
//                                   onChange={(e) =>
//                                     updatePart(
//                                       chapter.id,
//                                       part.id,
//                                       "totalPages",
//                                       e.target.value ? Number.parseInt(e.target.value) : null,
//                                     )
//                                   }
//                                 />
//                               </div>
//                             </div>

//                             <div className="grid grid-cols-2 gap-3">
//                               <div className="grid gap-2">
//                                 <Label htmlFor={`partFile-${chapter.id}-${part.id}`}>Upload File</Label>
//                                 <Button variant="outline" size="sm" className="w-full bg-transparent relative" asChild>
//                                   <label htmlFor={`partFile-${chapter.id}-${part.id}`} className="cursor-pointer">
//                                     {getResourceIcon(part.resourceType)}
//                                     <span className="ml-2 truncate">{part.file ? part.file.name : "Upload"}</span>
//                                     <input
//                                       id={`partFile-${chapter.id}-${part.id}`}
//                                       type="file"
//                                       accept={getAcceptedFileTypes(part.resourceType)}
//                                       className="sr-only"
//                                       onChange={(e) =>
//                                         handleFileUpload(chapter.id, part.id, e.target.files?.[0] || null, "file")
//                                       }
//                                     />
//                                   </label>
//                                 </Button>
//                                 {part.file && (
//                                   <p className="text-xs text-muted-foreground">
//                                     {part.file.name} ({(part.file.size / 1024 / 1024).toFixed(2)} MB)
//                                   </p>
//                                 )}
//                               </div>

//                               <div className="grid gap-2">
//                                 <Label htmlFor={`partThumbnail-${chapter.id}-${part.id}`}>Thumbnail</Label>
//                                 <Button variant="outline" size="sm" className="w-full bg-transparent relative" asChild>
//                                   <label htmlFor={`partThumbnail-${chapter.id}-${part.id}`} className="cursor-pointer">
//                                     <ImageIcon className="w-4 h-4 mr-2" />
//                                     {part.thumbnailFile ? "✓" : "Upload"}
//                                     <input
//                                       id={`partThumbnail-${chapter.id}-${part.id}`}
//                                       type="file"
//                                       accept="image/*"
//                                       className="sr-only"
//                                       onChange={(e) =>
//                                         handleFileUpload(chapter.id, part.id, e.target.files?.[0] || null, "thumbnail")
//                                       }
//                                     />
//                                   </label>
//                                 </Button>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}

//                   {chapter.parts.length === 0 && (
//                     <p className="text-sm text-muted-foreground text-center py-4">
//                       No parts added. Click "Add Part" to add sub-sections with different resource types.
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}

//           {chapters.length === 0 && (
//             <div className="text-center py-12">
//               <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
//               <p className="text-muted-foreground mb-4">No chapters added yet</p>
//               <Button onClick={addChapter} variant="outline">
//                 <Plus className="w-4 h-4 mr-2" />
//                 Add First Chapter
//               </Button>
//             </div>
//           )}
//         </div>
//       </Card>

//       {/* Actions */}
//       <div className="flex items-center gap-4">
//         <Button className="flex-1">
//           <Upload className="w-4 h-4 mr-2" />
//           Publish Book
//         </Button>
//         <Button variant="outline" className="flex-1 bg-transparent">
//           Save as Draft
//         </Button>
//       </div>
//     </div>
//   )
// }
