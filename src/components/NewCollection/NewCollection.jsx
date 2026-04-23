

import  { useState } from 'react';
import { Heart } from 'lucide-react';


import product1Img from '../../assets/images/NewCollection/1.webp';
import product2Img from '../../assets/images/NewCollection/2.webp';
import product3Img from '../../assets/images/NewCollection/3.webp';
import product4Img from '../../assets/images/NewCollection/4.webp';
import product5Img from '../../assets/images/NewCollection/5.webp';
import product6Img from '../../assets/images/NewCollection/6.webp';
import product7Img from '../../assets/images/NewCollection/7.webp';
import product8Img from '../../assets/images/NewCollection/8.webp';



const allProducts = [
  { id: 1, name: 'Joust Duffle Bag', price: '$20.19', image: product1Img, category: 'all', tags: ['new'] },
  { id: 2, name: 'Endeavor Daytrip', price: '$33.00', image: product2Img, category: 'all', tags: ['best_sellers'] },
  { id: 3, name: 'Impulse Duffle', price: '$65.00', image: product3Img, category: 'all', tags: ['featured'] },
  { id: 4, name: 'Driven Backpack', price: '$25.00', image: product4Img, category: 'all', tags: ['on_sale'], oldPrice: '$35.00' },
  { id: 5, name: 'Fusion Backpack', price: '$45.00', image: product5Img, category: 'all', tags: ['new'] },
  { id: 6, name: 'Savvy Shoulder Tote', price: '$30.00', image: product6Img, category: 'all', tags: ['best_sellers'] },
  { id: 7, name: 'Voyage Yoga Bag', price: '$39.00', image: product7Img, category: 'all', tags: ['featured'] },
  { id: 8, name: 'Wayfarer Messenger Bag', price: '$50.00', image: product8Img, category: 'all', tags: ['on_sale'], oldPrice: '$60.00' },
];

const categories = [
  { name: 'ALL', filter: 'all' },
  { name: 'NEW', filter: 'new' },
  { name: 'BEST SELLERS', filter: 'best_sellers' },
  { name: 'FEATURED', filter: 'featured' },
  { name: 'ON SALE', filter: 'on_sale' },
];

export default function NewCollection() {

  const [activeCategory, setActiveCategory] = useState('all');
  const [wishlist, setWishlist] = useState({});

  const filteredProducts = allProducts.filter(product => 
    activeCategory === 'all' || product.tags.includes(activeCategory)
  );

  const toggleWishlist = (id) => {
    setWishlist(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section className="w-full py-16 bg-white flex justify-center px-4">
      <div className="max-w-7xl w-full">
        
     
        <div className="text-center mb-12 relative">
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-200 text-6xl select-none z-0">
             
            </span>
            <p className="text-purple-700 tracking-[0.2em] font-bold text-sm uppercase mb-1 relative z-10">
                Best Product
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 relative z-10">
                New Collection
            </h2>
        </div>

        <div className="flex justify-center flex-wrap gap-x-6 gap-y-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.filter}
              onClick={() => setActiveCategory(cat.filter)}
              className={`
                px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300
                ${activeCategory === cat.filter
                  ? 'bg-purple-700 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {cat.name}
            </button>
          ))}
        </div>

  
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg"
            >
            
              <div className="relative bg-gray-50 p-4 flex justify-center items-center h-40 sm:h-48 md:h-56 overflow-hidden">
         
                <button 
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:scale-110 transition z-10"
                >
                  <Heart 
                    size={20} 
                    className={wishlist[product.id] ? 'fill-red-500 text-red-500' : 'text-gray-600'}
                  />
                </button>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>

         
              <div className="p-4  flex flex-col justify-between">
                
           
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 text-left">
                  {product.name}
                </h3>
                
        
                <div className="flex items-end justify-end mt-auto">
                    <div className="flex flex-col items-end">
                      {product.oldPrice && (
                        <p className="text-sm text-gray-400 line-through">
                          {product.oldPrice}
                        </p>
                      )}
                      <p className="text-lg sm:text-xl font-bold text-gray-900">
                        {product.price}
                      </p>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}