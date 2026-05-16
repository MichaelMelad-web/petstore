
import { useNavigate } from "react-router-dom";
import CatImg  from "../../assets/images/PetCategories/1.webp";
import FishImg from "../../assets/images/PetCategories/2.webp";
import BirdImg from "../../assets/images/PetCategories/3.webp";
import DogImg  from "../../assets/images/PetCategories/4.webp";

const categories = [
  { key: "cats",  label: "Cats",  desc: "Food, toys & accessories for your feline friend", img: CatImg  },
  { key: "dogs",  label: "Dogs",  desc: "Everything your dog needs to thrive",              img: DogImg  },
  { key: "birds", label: "Birds", desc: "Seeds, cages & more for your feathered pets",      img: BirdImg },
  { key: "fish",  label: "Fish",  desc: "Tanks, food & care for aquatic life",              img: FishImg },
];

export default function Shop() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#13111C] pt-24 pb-16 transition-colors duration-300">

      {/* Header */}
      <div className="bg-primary-purple py-10 px-4 mb-10">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-yellow-300 text-xs font-bold uppercase tracking-widest mb-2">
            Trending Categories
          </p>
          <h1 className="text-4xl font-bold text-white mb-2">Shop by Category</h1>
          <p className="text-yellow-300 text-sm font-medium uppercase tracking-widest">
            Home › Shop
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6">
        <p className="text-center text-gray-500 dark:text-gray-400 mb-10 text-base">
          Browse our wide selection of premium pet products by category
        </p>

        {/* 2-column grid of rectangular cards */}
        <div className="grid grid-cols-2 gap-5">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => navigate(`/products?category=${cat.key}`)}
              className="group bg-white dark:bg-[#1e1a2e] rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-purple-900/30 hover:shadow-xl dark:hover:shadow-purple-900/20 hover:border-purple-200 dark:hover:border-purple-700 transition-all duration-300 text-left flex flex-col"
            >
              {/* Image */}
              <div className="w-full bg-gray-50 dark:bg-[#2a2040] overflow-hidden" style={{ height: "220px" }}>
                <img
                  src={cat.img}
                  alt={cat.label}
                  className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>

              {/* Text row */}
              <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 dark:border-purple-900/30">
                <div>
                  <h3 className="text-lg font-extrabold text-gray-800 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors duration-200">
                    {cat.label}
                  </h3>
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">{cat.desc}</p>
                </div>

                {/* Arrow */}
                <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center shrink-0 ml-3 group-hover:bg-purple-700 transition-colors duration-300">
                  <svg
                    className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:text-white transition-colors duration-300"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => navigate("/products")}
            className="px-8 py-3 bg-[#6B21A8] text-white font-semibold rounded-xl hover:bg-purple-800 transition shadow-sm"
          >
            View All Products
          </button>
        </div>
      </div>
    </div>
  );
}