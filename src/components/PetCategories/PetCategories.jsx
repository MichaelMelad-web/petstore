
import CatImg from "../../assets/images/PetCategories/1.webp";
import FishImg from "../../assets/images/PetCategories/2.webp";
import ParrotImg from "../../assets/images/PetCategories/3.webp";
import DogImg from "../../assets/images/PetCategories/4.webp";

import { useNavigate } from "react-router-dom";

const categories = [
  {
    name: "Cats",
    query: "cats",
    img: CatImg,
  },
  {
    name: "Gold Fish",
    query: "fish",
    img: FishImg,
  },
  {
    name: "Parrot",
    query: "birds",
    img: ParrotImg,
  },
  {
    name: "Dog",
    query: "dogs",
    img: DogImg,
  },
];

export default function PetCategories() {
  const navigate = useNavigate();

  return (
    <section className="py-16 pt-45 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto text-center">
        {/* Label */}
        <p className="text-primary-purple text-xs font-bold uppercase tracking-widest mb-2">
          Trending Categories
        </p>
        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-800 mb-12">
          Choose Your Pet
        </h2>

        {/* Categories */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {categories.map((cat) => (
            <button
              key={cat.query}
              onClick={() => navigate(`/products?category=${cat.query}`)}
              className="flex flex-col items-center gap-4 group"
            >
              {/* Image Circle */}
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden transition-all duration-300">
                
                {/* Glow Border */}
                <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-primary-purple group-hover:shadow-[0_0_25px_rgba(124,58,237,0.4)] transition-all duration-300"></div>

                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full transform group-hover:scale-110 transition duration-300"
                />
              </div>

              {/* Text */}
              <span className="text-gray-700 font-semibold text-lg group-hover:text-primary-purple transition-colors duration-300">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}