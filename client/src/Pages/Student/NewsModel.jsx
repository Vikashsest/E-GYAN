// import { useParams, useNavigate } from "react-router-dom";
// import sampleNews from "./sampleNews.json";
// import { FaArrowLeft, FaCalendarAlt } from "react-icons/fa";

// const NewsPage = () => {
//   const { id } = useParams();


//   const navigate = useNavigate();

//   const newsItem = sampleNews.find((n) => n.id === parseInt(id));
  
//   if (!newsItem) return <p className="text-white p-4">News not found</p>;

//   return (
//     <div className="min-h-screen bg-[#1e1f2b] text-white p-6">
//       <button
//         onClick={() => navigate(newsItem.newsId)}
//         className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6"
//       >
//         <FaArrowLeft /> Back
//       </button>

//       <div className="max-w-4xl mx-auto bg-[#2a2b3d] rounded-2xl overflow-hidden shadow-lg">
//         <img
//           src={newsItem.image}
//           alt={newsItem.title}
//           className="w-full h-80 object-cover"
//         />

//         <div className="p-6 space-y-4">
//           <div className="flex items-center justify-between text-sm text-gray-400">
//             <span className="flex items-center gap-1">
//               <FaCalendarAlt className="text-blue-400" /> {newsItem.date}
//             </span>
//             <span className="bg-blue-700 px-3 py-1 rounded-full text-xs">
//               {newsItem.category}
//             </span>
//           </div>

//           <h1 className="text-3xl font-bold text-white">{newsItem.title}</h1>
//           <p className="text-gray-300 text-lg">{newsItem.fullContent}</p>

//           {/* Optional extra sections */}
//           <div className="text-gray-400 text-sm space-y-3 mt-4">
//             <p>🌍 <strong>Background:</strong> {newsItem.fullContent}</p>
//             <p>🧭 <strong>Impact:</strong> Experts believe this news impacts multiple domains.</p>
//             <p>💬 <strong>Expert Opinion:</strong> Analysts say this is significant.</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NewsPage;

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaCalendarAlt } from "react-icons/fa";
import { fetchCurrentAffairById } from "../../apiServices/booksApi";

const NewsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      try {
        const data = await fetchCurrentAffairById(id);
        setNewsItem(data);
      } catch (err) {
        console.error("Error loading news:", err);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, [id]);

 if (loading)
  return (
    <div className="min-h-screen bg-[#1e1f2b] flex items-center justify-center">
      <p className="text-white text-xl">Loading...</p>
    </div>
  );

  if (!newsItem) return <p className="text-white p-6">News Not Found</p>;

  return (
    <div className="min-h-screen bg-[#1e1f2b] text-white p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6"
      >
        <FaArrowLeft /> Back
      </button>

      <div className="max-w-4xl mx-auto bg-[#2a2b3d] rounded-2xl overflow-hidden shadow-lg">
        <img
           src={
    newsItem.imageUrl?.includes("/download")
      ? newsItem.imageUrl
      : `${newsItem.imageUrl}/download`
  }
          alt={newsItem.title}
          className="w-full h-[448px] object-fit"
        />

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <FaCalendarAlt className="text-blue-400" /> {newsItem.date}
            </span>
            <span className="bg-blue-700 px-3 py-1 rounded-full text-xs">
              {newsItem.category}
            </span>
          </div>

          <h1 className="text-3xl font-bold">{newsItem.title}</h1>
       <div
  className="text-gray-300 text-lg space-y-4"
  dangerouslySetInnerHTML={{ __html: newsItem.description }}
></div>

        </div>
      </div>
    </div>
  );
};

export default NewsPage;
