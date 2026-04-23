// Import your images of ShopByCategories
import Img1 from "../../assets/images/ShopByCategory/1.webp";
import Img2 from "../../assets/images/ShopByCategory/2.webp";
import Img3 from "../../assets/images/ShopByCategory/3.webp";

export default function ShopByCategory() {
  const categories = [
    {
      image: Img1,
      author: "Admin",
      date: "Sep 24,2022",
      title: "Lorem ipsum dolor sit amet conse adipis.",
    },
    {
      image: Img2,
      author: "Admin",
      date: "Sep 24,2022",
      title: "It is a long established fact that a reader will.",
    },
    {
      image: Img3,
      author: "Admin",
      date: "Sep 24,2022",
      title: "Fashions fade, style is eternal About Upto.",
    },
  ];

  return (
    <section className="py-16">
      <div className="text-center mb-10">
        <h3 className="text-sm font-semibold tracking-widest text-purple-600">
          TRENDING CATEGORIES
        </h3>
        <h2 className="text-4xl font-bold text-gray-800">Shop By Category</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {categories.map((categorie, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md border p-4 hover:shadow-lg transition cursor-pointer"
          >
            <div className="overflow-hidden rounded-lg">
              <img
                src={categorie.image}
                alt={categorie.title}
                className="w-full h-64 object-cover rounded-lg transition-transform duration-300 hover:scale-105"
              />
            </div>

            <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
              <p>
                <span className="text-purple-600 font-semibold">By:</span>{" "}
                {categorie.author}
              </p>
              <p>{categorie.date}</p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-3">
              {categorie.title}
            </h3>

            <button className="mt-5 mb-2 bg-yellow-400 py-2 px-6 rounded-full font-semibold hover:bg-yellow-500 transition">
              READ MORE
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
