import { CiLocationOn } from "react-icons/ci";
import {
  FaFacebookF,
  FaYoutube,
  FaPinterestP,
  FaTwitter,
} from "react-icons/fa";

import { IoPhonePortraitOutline } from "react-icons/io5";
export default function Footer() {
  return (
    <>
      <footer className="bg-[#494857] text-white py-12 px-6 ">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-15">
         
          <div className="space-y-10">
            <h3 className="text-2xl font-semibold mb-4">About Us</h3>
            <p className="text-gray-300 leading-relaxed">
              My pet is an online store for all pet supplies, which is why
              everything we do at My Pet Store is designed to help your pets
              live a healthy and happy life.
            </p>

            <div className="flex space-x-3 mt-5">
              <a
                href="https://www.facebook.com"
                target="_self"
                rel="noopener noreferrer"
                className="  size-10
    bg-white
    text-primary-purple
    rounded-lg
    flex items-center justify-center
    shadow-md
    hover:bg-primary-gold
    hover:shadow-lg
    transition-all duration-300 ease-in-out"
              >
                <FaFacebookF />
              </a>

              <a
                href="https://www.youtube.com"
                target="_self"
                rel="noopener noreferrer"
                className="  size-10
    bg-white
    text-primary-purple
    rounded-lg
    flex items-center justify-center
    shadow-md
    hover:bg-primary-gold
    hover:shadow-lg
    transition-all duration-300 ease-in-out"
              >
                <FaYoutube />
              </a>
              <a
                href="https://www.pinterest.com"
                target="_self"
                rel="noopener noreferrer"
                className=" size-10
    bg-white
    text-primary-purple
    rounded-lg
    flex items-center justify-center
    shadow-md
    hover:bg-primary-gold
    hover:shadow-lg
    transition-all duration-300 ease-in-out"
              >
                <FaPinterestP />
              </a>
              <a
                href="https://x.com/"
                target="_self"
                rel="noopener noreferrer"
                className="  size-10
    bg-white
    text-primary-purple
    rounded-lg
    flex items-center justify-center
    shadow-md
    hover:bg-primary-gold
    hover:shadow-lg
    transition-all duration-300 ease-in-out"
              >
                <FaTwitter />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-4">Information</h3>
            <ul className="space-y-3 text-gray-300">
              <li>About Us</li>
              <li>Delivery Information</li>
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
              <li>Contact Us</li>
              <li>Log in Info</li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-4">Our Policy</h3>
            <ul className="space-y-3 text-gray-300">
              <li>Gallery</li>
              <li>Brands</li>
              <li>Gift Certificates</li>
              <li>Specials</li>
              <li>My Account</li>
              <li>About Us</li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-4">Contact Info</h3>
            <p className="text-gray-300">
              If you have any questions,contact us at:
              <a
                className=" ps-2 text-[#ffdd88] "
                href="mailto:my-pet-store@email.com"
                target="_self"
                rel="noopener noreferrer"
              >
                my-pet-store@email.com
              </a>
            </p>

            <div className="mt-6 flex items-center  space-x-3 text-gray-200">
              <div>
                <a
                  href="https://www.facebook.com"
                  target="_self"
                  rel="noopener noreferrer"
                  className="  size-12
     bg-yellow-300/85
    text-primary-purple
    rounded-lg
    flex items-center justify-center
    shadow-md
    hover:bg-white
    hover:shadow-lg
    transition-all duration-300 ease-in-out"
                >
                  <CiLocationOn className="text-2xl" />
                </a>
              </div>

              <p>
                Maadi-Cairo-Egypt.
                <br />
                123,9 ST.
              </p>
            </div>
            <div className="mt-6 flex items-center  space-x-3 text-gray-200">
              <div>
                <a
                  href="https://www.facebook.com"
                  target="_self"
                  rel="noopener noreferrer"
                  className="  size-12
    bg-yellow-300/85
    text-primary-purple
    rounded-lg
    flex items-center justify-center
    shadow-md
    hover:bg-white
    hover:shadow-lg
    transition-all duration-300 ease-in-out"
                >
                  <IoPhonePortraitOutline className="text-2xl" />
                </a>
              </div>

              <div>
                <p className="text-[#ffdd88] font-semibold">
                  Have any Question
                </p>
                <p>+0 100 869 1505</p>
              </div>
            </div>
          </div>
        </div>

        
        <div className="mt-10 pt-6 border-t border-white/20 text-center text-gray-300">
          Copyright © 2026 All rights reserved. Team BHI47
        </div>
      </footer>
    </>
  );
}
