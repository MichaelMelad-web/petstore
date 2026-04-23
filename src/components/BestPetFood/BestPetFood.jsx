import SectionImg from "../../assets/images/BestPetFood/1.webp";

export default function BestPetFood() {
  return (
    <section className="w-full py-16 bg-white flex justify-center px-4">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        <div className="flex flex-col items-start text-left order-2 md:order-1">
          <p className="text-purple-700 tracking-[0.2em] font-bold text-sm uppercase mb-4">
            Best Product
          </p>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-black leading-tight mb-6">
            Best Pet Food
          </h2>

          <div className="space-y-4 text-gray-700 text-base leading-relaxed font-medium mb-8 max-w-lg">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam.
            </p>

            <p className="hidden md:block">
              Velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
              occaecat cupidatat non proident, sunt in culpa qui officia
              deserunt mollit anim id est laborum.
            </p>
          </div>

          <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-10 py-4 rounded-full font-bold shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1">
            SHOP NOW
          </button>
        </div>

        <div className="relative h-full w-full order-1 md:order-2">
          <img
            src={SectionImg}
            alt="Best Pet Food product"
            className="w-full h-auto md:h-[550px] object-cover rounded-3xl shadow-2xl"
          />

          <div className="absolute -z-10 top-10 -right-10 w-full h-full bg-purple-100 rounded-3xl hidden md:block"></div>
        </div>

      </div>
    </section>
  );
}
