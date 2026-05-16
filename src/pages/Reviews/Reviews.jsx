
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { HiOutlineTrash, HiOutlinePencil, HiX, HiCheck } from "react-icons/hi";
import { getReviews, addReview, updateReview, deleteReview } from "../../services/reviewServices";
import { getLoggedUserData } from "../../services/authServices";

const successToast = (msg) =>
  toast.success(msg, { style: { background: "#6B21A8", color: "#fff", fontWeight: "600", borderRadius: "12px" }, progressStyle: { background: "#D8B4FE" } });
const errorToast = (msg) =>
  toast.error(msg, { style: { background: "#FEF2F2", color: "#B91C1C", fontWeight: "600", borderRadius: "12px", border: "1px solid #FECACA" }, progressStyle: { background: "#F87171" }, icon: "❌" });

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)} onMouseLeave={() => setHovered(0)}
          className="text-3xl leading-none transition-transform hover:scale-110">
          <span className={(hovered || value) >= star ? "text-yellow-400" : "text-gray-200 dark:text-gray-600"}>★</span>
        </button>
      ))}
      <span className="text-sm text-gray-400 ml-2">{value > 0 ? `${value}/5` : "Select rating"}</span>
    </div>
  );
}

function ReviewCard({ review, currentUserId, productId, onRefresh }) {
  const [editing, setEditing]       = useState(false);
  const [editRating, setEditRating] = useState(review.rating || 5);
  const [editComment, setEditComment] = useState(review.comment || "");
  const [submitting, setSubmitting] = useState(false);

  const isOwner = currentUserId && (
    review.user?._id === currentUserId || review.userId === currentUserId || review.user === currentUserId
  );

  const handleUpdate = async () => {
    if (!editComment.trim()) { errorToast("Comment cannot be empty"); return; }
    setSubmitting(true);
    try {
      await updateReview(productId, review._id, { rating: editRating, comment: editComment });
      successToast("Review updated ✅");
      setEditing(false);
      onRefresh();
    } catch (err) { errorToast(err.response?.data?.message || "Failed to update review"); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    try { await deleteReview(productId, review._id); successToast("Review deleted"); onRefresh(); }
    catch (err) { errorToast(err.response?.data?.message || "Failed to delete review"); }
  };

  const userName = review.user?.userName || review.user?.firstName || review.userName || "Anonymous";
  const initials = userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  return (
    <div className="bg-white dark:bg-[#1e1a2e] rounded-2xl border border-gray-100 dark:border-purple-900/30 shadow-sm p-5">
      {editing ? (
        <div className="space-y-3">
          <StarPicker value={editRating} onChange={setEditRating} />
          <textarea value={editComment} onChange={(e) => setEditComment(e.target.value)} rows={3}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl text-sm focus:outline-none focus:border-purple-400 resize-none" />
          <div className="flex gap-2">
            <button onClick={handleUpdate} disabled={submitting}
              className="flex items-center gap-1 px-4 py-2 bg-[#6C1A6B] text-white font-semibold rounded-xl text-sm hover:bg-purple-800 transition disabled:opacity-60">
              <HiCheck /> {submitting ? "Saving..." : "Save"}
            </button>
            <button onClick={() => setEditing(false)}
              className="flex items-center gap-1 px-4 py-2 border-2 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 font-semibold rounded-xl text-sm hover:border-purple-300 transition">
              <HiX /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center shrink-0">
                <span className="text-purple-700 dark:text-purple-300 font-bold text-sm">{initials}</span>
              </div>
              <div>
                <p className="font-bold text-gray-800 dark:text-white text-sm">{userName}</p>
                <div className="flex items-center gap-0.5 mt-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={`text-base ${review.rating >= star ? "text-yellow-400" : "text-gray-200 dark:text-gray-600"}`}>★</span>
                  ))}
                </div>
              </div>
            </div>
            {isOwner && (
              <div className="flex gap-2 shrink-0">
                <button onClick={() => { setEditing(true); setEditRating(review.rating); setEditComment(review.comment || ""); }}
                  className="p-2 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-400 hover:border-purple-300 hover:text-purple-600 transition">
                  <HiOutlinePencil size={15} />
                </button>
                <button onClick={handleDelete}
                  className="p-2 rounded-xl border border-red-100 dark:border-red-900 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 transition">
                  <HiOutlineTrash size={15} />
                </button>
              </div>
            )}
          </div>
          {review.comment && <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 leading-relaxed">{review.comment}</p>}
          {review.createdAt && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              {new Date(review.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default function Reviews({ productId }) {
  const [reviews, setReviews]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [rating, setRating]             = useState(5);
  const [comment, setComment]           = useState("");
  const [submitting, setSubmitting]     = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("userToken"));

  const fetchReviews = async () => {
    try {
      const res = await getReviews(productId);
      const data = res.data?.data ?? res.data?.reviews ?? res.data ?? [];
      setReviews(Array.isArray(data) ? data : []);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchReviews();
    if (isLoggedIn) {
      getLoggedUserData()
        .then((res) => { const user = res.data?.user ?? res.data?.data ?? res.data; setCurrentUserId(user?._id); })
        .catch(() => {});
    }
  }, [productId]);

  const userAlreadyReviewed = currentUserId && reviews.some((r) =>
    r.user?._id === currentUserId || r.userId === currentUserId || r.user === currentUserId
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) { navigate("/login"); return; }
    if (rating < 1) { errorToast("Please select a rating"); return; }
    setSubmitting(true);
    try {
      await addReview(productId, { rating, comment });
      successToast("Review added successfully ⭐");
      setComment(""); setRating(5);
      fetchReviews();
    } catch (err) { errorToast(err.response?.data?.message || "Failed to add review"); }
    finally { setSubmitting(false); }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="mt-14">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-7 bg-[#6C1A6B] rounded-full" />
        <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white">Customer Reviews</h2>
        {avgRating && (
          <div className="flex items-center gap-2 ml-2 bg-purple-50 dark:bg-purple-900/30 px-3 py-1 rounded-full">
            <span className="text-yellow-400 text-lg">★</span>
            <span className="font-bold text-gray-800 dark:text-white">{avgRating}</span>
            <span className="text-sm text-gray-400">({reviews.length})</span>
          </div>
        )}
      </div>

      {isLoggedIn && !userAlreadyReviewed && (
        <form onSubmit={handleSubmit}
          className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-5 border border-purple-100 dark:border-purple-800 mb-6 space-y-4">
          <h3 className="font-bold text-gray-700 dark:text-gray-200">Write a Review</h3>
          <StarPicker value={rating} onChange={setRating} />
          <textarea value={comment} onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..." rows={3}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 resize-none bg-white" />
          <button type="submit" disabled={submitting}
            className="px-6 py-2.5 bg-[#6C1A6B] text-white font-semibold rounded-xl hover:bg-purple-800 transition text-sm disabled:opacity-60">
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}

      {userAlreadyReviewed && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl px-5 py-4 mb-6 text-sm text-green-700 dark:text-green-400 font-semibold">
          ✅ You've already reviewed this product. You can edit or delete your review below.
        </div>
      )}

      {!isLoggedIn && (
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-2xl px-5 py-4 mb-6 text-sm text-purple-700 dark:text-purple-400 font-semibold flex items-center justify-between">
          <span>Sign in to write a review</span>
          <button onClick={() => navigate("/login")}
            className="px-4 py-2 bg-[#6C1A6B] text-white rounded-xl text-xs font-bold hover:bg-purple-800 transition">
            Sign In
          </button>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-white dark:bg-[#1e1a2e] rounded-2xl animate-pulse" />)}</div>
      ) : reviews.length === 0 ? (
        <div className="bg-white dark:bg-[#1e1a2e] rounded-2xl border border-gray-100 dark:border-purple-900/30 p-10 text-center">
          <div className="text-4xl mb-3">💬</div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">No reviews yet</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} currentUserId={currentUserId} productId={productId} onRefresh={fetchReviews} />
          ))}
        </div>
      )}
    </div>
  );
}