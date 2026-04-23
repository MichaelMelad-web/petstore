import { Star } from "lucide-react";
import DIANNAImg from "../../assets/images/Testimonials/1.webp"; 
import DORIANImg from "../../assets/images/Testimonials/2.webp"; 
import JARENImg from "../../assets/images/Testimonials/3.webp"; 

export default function  Testimonials(){
  const testimonials = [
    {
      id: 1,
      name: "DIANNA SMILEY",
      role: "Client",
      image:`${DIANNAImg}`,
      rating: 5,
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit, sed do eiusmod tempo incidi ut labore et dolore magna aliqua. Ut enim ad minim veniam,",
    },
    {
      id: 2,
      name: "DORIAN CORDOVA",
      role: "Client",
      image:`${DORIANImg}`,
      rating: 5,
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit, sed do eiusmod tempo incidi ut labore et dolore magna aliqua. Ut enim ad minim veniam,",
    },
    {
      id: 3,
      name: "JAREN HAMMER",
      role: "Client",
      image:`${JARENImg}`,
      rating: 5,
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit, sed do eiusmod tempo incidi ut labore et dolore magna aliqua. Ut enim ad minim veniam,",
    },
  ];


  return (
    <section className="w-full from-gray-50 to-gray-100 py-20 px-6">
      <div className="max-w-7xl mx-auto">

    
        <header className="text-center mb-16">
          <p className="text-sm font-semibold text-purple-600 tracking-widest uppercase mb-1">
            Testimonial
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            What Client Says
          </h2>
        </header>

    
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <article
              key={t.id}
              className="bg-white rounded-2xl p-8 shadow-md  border border-gray-100 flex flex-col"
            >
              
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-16 h-16 rounded-full object-cover shadow"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{t.name}</h3>
                  <p className="text-sm text-gray-600">{t.role}</p>
                </div>
              </div>

              
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

             
              <p className="text-gray-700 italic leading-relaxed mb-6 ">
                {t.text}
              </p>

          
              <div className="text-5xl text-purple-300 font-serif text-right -mt-4 select-none">
                &ldquo;
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};


