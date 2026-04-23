import petsBanner from "../../assets/images/AboutBestPetFood/2.webp";

import { Button } from "@heroui/react";

export default function BestPetFood() {
  return (
    <section className="w-full bg-[#faf8f4] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
        
        <div className="w-full md:w-1/2 flex justify-center md:justify-start">
          <img
            src={petsBanner}
            alt="Pet Food Banner"
            className="w-[280px] sm:w-[340px] md:w-[430px] lg:w-[520px] xl:w-[580px] object-contain select-none"
          />
        </div>

        <div className="w-full md:w-1/2 text-center md:text-left">
          <p className="uppercase tracking-[3px] text-[#7e3791] font-semibold">
            Best Product
          </p>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-2 text-[#2d2e2e]">
            Best Pet Food
          </h1>

          <p className="text-gray-600 my-12 leading-relaxed text-[15px] ">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>

          <p className="text-[#7e3791] mt-4 font-medium text-[15px] leading-relaxed">
            Velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
            occaecat cupidatat non proident, sunt in culpa qui officia deserunt.
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
