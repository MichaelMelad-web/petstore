import {
  FaFacebookF,
  FaPinterestP,
  FaXTwitter,
  FaDribbble,
} from "react-icons/fa6";

import DiannaImg from "../../assets/images/TeamMember/1.webp";
import FerdinandImg from "../../assets/images/TeamMember/2.webp";
import RachelImg from "../../assets/images/TeamMember/3.webp";
import DorianImg from "../../assets/images/TeamMember/4.webp";

export default function TeamMember() {
  const team = [
    {
      id: 1,
      name: "Dianna Smiley",
      role: "Team Member",
      img: ` ${DiannaImg}`,
    },
    {
      id: 2,
      name: "Ferdinand Karl",
      role: "Team Member",
      img: `${FerdinandImg}`,
    },
    {
      id: 3,
      name: "Rachel Leonard",
      role: "Team Member",
      img: `${RachelImg}`,
    },
    {
      id: 4,
      name: "Dorian Cordova",
      role: "Team Member",
      img: `${DorianImg}`,
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="text-center mb-12">
        <p className="uppercase tracking-[4px] text-[#8a3ea0] font-semibold">
          Our Team
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2">
          Team Member
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {team.map((member) => (
          <div key={member.id} className="group">
            <div className="relative overflow-hidden rounded-md">
              <img
                src={member.img}
                alt={member.name}
                className="w-full h-[330px] object-cover rounded-md duration-300 group-hover:scale-105"
              />

              <div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 
                opacity-0 group-hover:opacity-100
                duration-500 ease-out"
              >
                <div
                  className="bg-white px-6 py-3 rounded-full shadow-lg flex items-center gap-5
                  transform translate-x-full group-hover:translate-x-0 
                  duration-700 ease-out"
                >
                  <FaFacebookF className="text-purple-700 hover:text-purple-500 cursor-pointer" />
                  <FaDribbble className="text-purple-700 hover:text-purple-500 cursor-pointer" />
                  <FaPinterestP className="text-purple-700 hover:text-purple-500 cursor-pointer" />
                  <FaXTwitter className="text-purple-700 hover:text-purple-500 cursor-pointer" />
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-center mt-4">
              {member.name}
            </h3>
            <p className="text-gray-600 text-center">{member.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
