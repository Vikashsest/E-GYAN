import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaCalendarAlt } from "react-icons/fa";
import { fetchCurrentAffairById } from "../../apiServices/booksApi";
import { useLoader } from "../../LoaderContext";

const NewsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [newsItem, setNewsItem] = useState(null);
  const { setLoading } = useLoader();

  useEffect(() => {
    async function loadNews() {
      try {
        setLoading(true);
        const data = await fetchCurrentAffairById(id);
        setNewsItem(data);
      } catch (err) {
        console.error("Error loading news:", err);
      } finally {
        setLoading(false);
      }
    }

    loadNews();
  }, [id, setLoading]);

  return (
    <div className="min-h-screen bg-[#1e1f2b] text-white p-6">
      {/* Back button always visible */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6"
      >
        <FaArrowLeft /> Back
      </button>

      {/* Content Wrapper */}
      <div className="max-w-4xl mx-auto bg-[#2a2b3d] rounded-2xl overflow-hidden shadow-lg">
        {/* Image placeholder */}
        <div className="w-full h-[448px] bg-gray-700">
          {newsItem && (
            <img
              src={
                newsItem.imageUrl?.includes("/download")
                  ? newsItem.imageUrl
                  : `${newsItem.imageUrl}/download`
              }
              alt={newsItem.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="p-6 space-y-4">
          {!newsItem ? (
            /* Skeleton */
            <>
              <div className="h-4 w-32 bg-gray-600 rounded animate-pulse" />
              <div className="h-8 w-3/4 bg-gray-600 rounded animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-600 rounded animate-pulse" />
                <div className="h-4 bg-gray-600 rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-gray-600 rounded animate-pulse" />
              </div>
            </>
          ) : (
            <>
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
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
