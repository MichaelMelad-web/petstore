

import { CiLocationOn } from "react-icons/ci";
import { FaFacebookF, FaYoutube, FaPinterestP, FaTwitter } from "react-icons/fa";
import { IoPhonePortraitOutline } from "react-icons/io5";

const socialLinks = [
  { href: "https://www.facebook.com",  Icon: FaFacebookF },
  { href: "https://www.youtube.com",   Icon: FaYoutube },
  { href: "https://www.pinterest.com", Icon: FaPinterestP },
  { href: "https://x.com/",            Icon: FaTwitter },
];

const socialCls =
  "size-10 bg-white dark:bg-gray-700 text-primary-purple dark:text-purple-400 rounded-lg flex items-center justify-center shadow-md hover:bg-primary-gold dark:hover:bg-yellow-400 hover:shadow-lg transition-all duration-300 ease-in-out";

export default function Footer() {
  return (
    <footer className="bg-[#494857] dark:bg-[#0f0d1a] text-white py-12 px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-15">

        {/* About */}
        <div className="space-y-10">
          <h3 className="text-2xl font-semibold mb-4">About Us</h3>
          <p className="text-gray-300 dark:text-gray-400 leading-relaxed">
            My pet is an online store for all pet supplies, which is why
            everything we do at My Pet Store is designed to help your pets
            live a healthy and happy life.
          </p>
          <div className="flex space-x-3 mt-5">
            {socialLinks.map(({ href, Icon }) => (
              <a key={href} href={href} target="_self" rel="noopener noreferrer" className={socialCls}>
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Information */}
        <div>
          <h3 className="text-2xl font-semibold mb-4">Information</h3>
          <ul className="space-y-3 text-gray-300 dark:text-gray-400">
            {["About Us", "Delivery Information", "Privacy Policy", "Terms & Conditions", "Contact Us", "Log in Info"].map((item) => (
              <li key={item} className="hover:text-yellow-300 cursor-pointer transition-colors duration-200">{item}</li>
            ))}
          </ul>
        </div>

        {/* Our Policy */}
        <div>
          <h3 className="text-2xl font-semibold mb-4">Our Policy</h3>
          <ul className="space-y-3 text-gray-300 dark:text-gray-400">
            {["Gallery", "Brands", "Gift Certificates", "Specials", "My Account", "About Us"].map((item) => (
              <li key={item} className="hover:text-yellow-300 cursor-pointer transition-colors duration-200">{item}</li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-2xl font-semibold mb-4">Contact Info</h3>
          <p className="text-gray-300 dark:text-gray-400">
            If you have any questions, contact us at:{" "}
            <a className="ps-1 text-[#ffdd88] hover:text-yellow-300 transition-colors" href="mailto:my-pet-store@email.com">
              my-pet-store@email.com
            </a>
          </p>

          {/* Location */}
          <div className="mt-6 flex items-center space-x-3 text-gray-200 dark:text-gray-300">
            <a href="https://www.facebook.com" target="_self" rel="noopener noreferrer"
              className="size-12 bg-yellow-300/85 dark:bg-yellow-400/80 text-primary-purple rounded-lg flex items-center justify-center shadow-md hover:bg-white dark:hover:bg-white hover:shadow-lg transition-all duration-300 ease-in-out shrink-0">
              <CiLocationOn className="text-2xl" />
            </a>
            <p className="text-gray-300 dark:text-gray-400">
              Alexandria, Egypt.<br />Smouha, Fawzy Moaz St.
            </p>
          </div>

          {/* Phone */}
          <div className="mt-6 flex items-center space-x-3 text-gray-200 dark:text-gray-300">
            <a href="https://www.facebook.com" target="_self" rel="noopener noreferrer"
              className="size-12 bg-yellow-300/85 dark:bg-yellow-400/80 text-primary-purple rounded-lg flex items-center justify-center shadow-md hover:bg-white dark:hover:bg-white hover:shadow-lg transition-all duration-300 ease-in-out shrink-0">
              <IoPhonePortraitOutline className="text-2xl" />
            </a>
            <div>
              <p className="text-[#ffdd88] font-semibold">Have any Question</p>
              <p className="text-gray-300 dark:text-gray-400">+20 100 869 1505</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-10 pt-6 border-t border-white/20 dark:border-white/10 text-center text-gray-300 dark:text-gray-500">
        Copyright © 2026 All rights reserved. Michael Melad
      </div>
    </footer>
  );
}