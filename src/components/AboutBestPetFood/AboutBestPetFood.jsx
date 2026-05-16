import petsBanner from "../../assets/images/AboutBestPetFood/2.webp";
import { Button } from "@heroui/react";

export default function AboutBestPetFood() {
  return (
    <section className="w-full bg-[#faf8f4] dark:bg-[#13111C] py-16 md:py-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">

         {/* Image  */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-start">
          <img
            src={petsBanner}
            alt="Pet Food Banner"
            className="w-[280px] sm:w-[340px] md:w-[430px] lg:w-[520px] xl:w-[580px] object-contain select-none dark:opacity-90"
          />
        </div>

        {/* Text */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <p className="uppercase tracking-[3px] text-[#7e3791] dark:text-purple-400 font-semibold">
            Best Product
          </p>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-2 text-[#2d2e2e] dark:text-white">
            Fuel Their Adventure
          </h1>

          <p className="text-gray-600 dark:text-gray-300 my-12 leading-relaxed text-[15px]">
            From shiny coats to strong muscles, our balanced formula provides complete nutrition
            for dogs of all breeds and sizes. Give your best friend the energy to play all day long.
          </p>

          <p className="text-[#7e3791] dark:text-purple-400 mt-4 font-medium text-[15px] leading-relaxed">
            They give you their best every day, so why not give them the best in return?
            Our premium recipes are crafted with love and packed with the essential nutrients they need to thrive.
          </p>

          <Button
            radius="lg"
            className="mt-10 bg-[#fbd34d] text-[#7e3791] font-semibold px-10 py-6 text-lg shadow-[4px_6px_0px_#e2b83f] hover:brightness-95"
          >
            SHOP NOW
          </Button>
        </div>
      </div>
    </section>
  );
}