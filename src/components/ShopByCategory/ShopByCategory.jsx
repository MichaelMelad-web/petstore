


import Img1 from "../../assets/images/ShopByCategory/1.webp";
import Img2 from "../../assets/images/ShopByCategory/2.webp";
import Img3 from "../../assets/images/ShopByCategory/3.webp";

const categories = [
  { image: Img1, author: "Admin", date: "Sep 24,2026", title: "5 Tips to Keep Your Dog's Coat Bright and Fluffy" },
  { image: Img2, author: "Admin", date: "Sep 12,2020", title: "How to Build an Unbreakable Bond with Your Dog" },
  { image: Img3, author: "Admin", date: "Sep 2,2012",  title: "Understanding Your Pet's Body Language" },
];

export default function ShopByCategory() {
  return (
    <section className="py-16 bg-white dark:bg-[#13111C] transition-colors duration-300">
      <div className="text-center mb-10">
        <h3 className="text-sm font-semibold tracking-widest text-purple-600 dark:text-purple-400">
          LATEST FROM OUR BLOG
        </h3>
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white">Insights & Pet Care Tips</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {categories.map((cat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-[#1e1a2e] rounded-xl shadow-md border border-gray-200 dark:border-purple-900/30 p-4 hover:shadow-lg dark:hover:shadow-purple-900/20 hover:border-purple-200 dark:hover:border-purple-700 transition cursor-pointer"
          >
            <div className="overflow-hidden rounded-lg">
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-64 object-cover rounded-lg transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="flex items-center justify-between mt-4 text-sm text-gray-600 dark:text-gray-400">
              <p>
                <span className="text-purple-600 dark:text-purple-400 font-semibold">By:</span> {cat.author}
              </p>
              <p>{cat.date}</p>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mt-3">{cat.title}</h3>
            <button className="mt-5 mb-2 bg-yellow-400 hover:bg-yellow-500 py-2 px-6 rounded-full font-semibold transition text-gray-900">
              READ MORE
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}