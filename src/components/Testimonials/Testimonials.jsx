


import { Star } from "lucide-react";
import DIANNAImg from "../../assets/images/Testimonials/1.webp";
import DORIANImg from "../../assets/images/Testimonials/2.webp";
import JARENImg  from "../../assets/images/Testimonials/3.webp";

const testimonials = [
  {
    id: 1, name: "DIANNA SMILEY", role: "Client", image: DIANNAImg, rating: 5,
    text: "Finally, a food my picky dog actually loves! Her coat has never been shinier and her energy levels are amazing.",
  },
  {
    id: 2, name: "DORIAN CORDOVA", role: "Client", image: DORIANImg, rating: 5,
    text: "The quality of the ingredients is visible. It's a relief knowing I'm giving my pet the best nutrition possible.",
  },
  {
    id: 3, name: "JAREN HAMMER", role: "Client", image: JARENImg, rating: 5,
    text: "Fast delivery and excellent customer service. But most importantly, my cat is happy and healthy. Highly recommended!",
  },
];

export default function Testimonials() {
  return (
    <section className="w-full py-20 px-6 bg-gray-50 dark:bg-[#13111C] transition-colors duration-300">
      <div className="max-w-7xl mx-auto">

        <header className="text-center mb-16">
          <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 tracking-widest uppercase mb-1">
            Testimonial
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            What Client Says
          </h2>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <article
              key={t.id}
              className="bg-white dark:bg-[#1e1a2e] rounded-2xl p-8 shadow-md border border-gray-100 dark:border-purple-900/30 flex flex-col hover:shadow-lg dark:hover:shadow-purple-900/20 hover:border-purple-100 dark:hover:border-purple-700 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <img src={t.image} alt={t.name} className="w-16 h-16 rounded-full object-cover shadow" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t.role}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed mb-6">{t.text}</p>

              <div className="text-5xl text-purple-300 dark:text-purple-700 font-serif text-right -mt-4 select-none">
                &ldquo;
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

