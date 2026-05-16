

import dogFoodBanner from "../../assets/images/DiscountBanners/1.webp";
import catFoodBanner from "../../assets/images/DiscountBanners/2.webp";

const bannersData = [
  {
    id: 1, image: dogFoodBanner, alt: "Dog Food Banner",
    discount: "50% Off", title: "DOG FOOD", buttonText: "SHOP NOW",
    bgColor: "bg-[#FEE5B0] dark:bg-[#2a1f0e]", titleColor: "text-[#5A2C85] dark:text-purple-300",
  },
  {
    id: 2, image: catFoodBanner, alt: "Cat Food Banner",
    discount: "50% Off", title: "CAT FOOD", buttonText: "SHOP NOW",
    bgColor: "bg-[#FEE5B0] dark:bg-[#2a1f0e]", titleColor: "text-[#5A2C85] dark:text-purple-300",
  },
];

export default function DiscountBannersFinal() {
  return (
    <section className="w-full py-16 bg-white dark:bg-[#13111C] flex justify-center px-4 transition-colors duration-300">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10">
        {bannersData.map((banner) => (
          <div
            key={banner.id}
            className={`relative rounded-3xl overflow-hidden shadow-xl border border-gray-200 dark:border-purple-900/30 group cursor-pointer h-[250px] md:h-[300px] lg:h-[350px] ${banner.bgColor}`}
          >
            <img
              src={banner.image}
              alt={banner.alt}
              className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-end text-right px-8 md:px-12 lg:px-16 z-10">
              <p className="text-gray-800 dark:text-gray-200 text-lg md:text-xl font-bold mb-1">{banner.discount}</p>
              <h2 className={`text-3xl md:text-4xl font-extrabold mt-1 mb-6 ${banner.titleColor}`}>{banner.title}</h2>
              <button className="bg-[#5A2C85] hover:bg-[#7a3ea5] dark:bg-purple-700 dark:hover:bg-purple-600 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-xl transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                {banner.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}