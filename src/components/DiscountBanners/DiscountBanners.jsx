import dogFoodBanner from "../../assets/images/DiscountBanners/1.webp";
import catFoodBanner from "../../assets/images/DiscountBanners/2.webp";

export default function DiscountBannersFinal() {

  const bannersData = [
  {
    id: 1,
    image: dogFoodBanner,
    alt: "Dog Food Banner with Dog and Food Bag",
    discount: "50% Off",
    title: "DOG FOOD",
    buttonText: "SHOP NOW",
    bgColor: "bg-[#FEE5B0]",
    titleColor: "text-[#5A2C85]",
  },
  {
    id: 2,
    image: catFoodBanner,
    alt: "Cat Food Banner with Cat and Food Bag",
    discount: "50% Off",
    title: "CAT FOOD",
    buttonText: "SHOP NOW",
    bgColor: "bg-[#FEE5B0]",
    titleColor: "text-[#5A2C85]",
  },
];
  return (
    <section className="w-full py-16 bg-white flex justify-center px-4">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10">
        {bannersData.map((banner) => (
          <div
            key={banner.id}
            className={`relative rounded-3xl overflow-hidden shadow-xl border border-gray-200 group cursor-pointer h-[250px] md:h-[300px] lg:h-[350px] ${banner.bgColor}`}
          >
            <img
              src={banner.image}
              alt={banner.alt}
              className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
            />

            <div className="absolute inset-0 flex flex-col justify-center items-end text-right px-8 md:px-12 lg:px-16 z-10">
              <p className="text-gray-800 text-lg md:text-xl font-bold mb-1">
                {banner.discount}
              </p>

              <h2
                className={`text-3xl md:text-4xl font-extrabold mt-1 mb-6 ${banner.titleColor}`}
              >
                {banner.title}
              </h2>

              <button className="bg-[#5A2C85] hover:bg-[#7a3ea5] text-white px-8 py-3 rounded-full font-semibold text-lg shadow-xl transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                {banner.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
