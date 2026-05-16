import PetCategories from "../../components/PetCategories/PetCategories";
import ShopByCategory from "../../components/ShopByCategory/ShopByCategory";
import BestPetFood from "../../components/BestPetFood/BestPetFood";
import DiscountBanners from "../../components/DiscountBanners/DiscountBanners";


export default function Home() {
  return (
    <>
      <div className="w-full">
        
        <PetCategories />

        <ShopByCategory />

        <BestPetFood />

        <DiscountBanners />

    
      </div>
    </>
  );
}
