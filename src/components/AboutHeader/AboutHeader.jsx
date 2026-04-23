import aboutDogs from "../../assets/images/AboutHeader/bg1.webp";

export default function AboutHeader() {
  return (
    <div className="w-full bg-[#d9eaf3] relative overflow-hidden pt-40 py-10">
      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          About Us
        </h1>

        <p className="mt-3 text-gray-700 text-sm md:text-base">
          <span className="font-semibold">HOME</span>
          <span className="text-purple-600 font-semibold ml-1">ABOUT US</span>
        </p>
      </div>

      <div className="absolute bottom-0 right-0 w-[800px] sm:w-[1000px] md:w-[1200px] lg:w-[1400px] xl:w-[1800px]">
        <img
          src={aboutDogs}
          alt="Dogs"
          className="w-full h-full object-contain pointer-events-none select-none"
        />
      </div>
    </div>
  );
}
