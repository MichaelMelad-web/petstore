

import SectionImg from "../../assets/images/BestPetFood/1.webp";

export default function BestPetFood() {
  return (
    <section className="w-full py-16 bg-white dark:bg-[#13111C] flex justify-center px-4 transition-colors duration-300">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* Text */}
        <div className="flex flex-col items-start text-left order-2 md:order-1">
          <p className="text-purple-700 dark:text-purple-400 tracking-[0.2em] font-bold text-sm uppercase mb-4">
            Best Product
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-black dark:text-white leading-tight mb-6">
            Best Pet Food
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300 text-base leading-relaxed font-medium mb-8 max-w-lg">
            <p>
              "Give your dog the best of nature with our 100% organic Lamb & Rice formula.
              Specially crafted for both adults and juniors, it's the healthy choice for a happy, wagging tail."
            </p>
            <p className="hidden md:block">
              "Elevate your dog's diet with a premium mix of grass-fed lamb and wholesome rice.
              Our 100% organic formula is designed to be gentle on the stomach while providing maximum energy for dogs of all sizes."
            </p>
          </div>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-10 py-4 rounded-full font-bold shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1">
            SHOP NOW
          </button>
        </div>

        {/* Image */}
        <div className="relative h-full w-full order-1 md:order-2">
          <img
            src={SectionImg}
            alt="Best Pet Food product"
            className="w-full h-auto md:h-[550px] object-cover rounded-3xl shadow-2xl"
          />
          <div className="absolute -z-10 top-10 -right-10 w-full h-full bg-purple-100 dark:bg-purple-900/20 rounded-3xl hidden md:block" />
        </div>
      </div>
    </section>
  );
}