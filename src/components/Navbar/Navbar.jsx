
import { useState } from "react";
import {
  Navbar, NavbarBrand, NavbarContent, NavbarItem,
  DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Badge, Button,
} from "@heroui/react";
import { MdFavoriteBorder, MdLogin, MdLogout, MdPersonAddAlt1 } from "react-icons/md";
import { CiShoppingCart } from "react-icons/ci";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/images/HomeImg/MyPetLogos.png";
import { useCartWishlist } from "../../context/CartWishlistContext";

export default function Navbarui() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("userToken"));
  const { cartCount, wishlistCount } = useCartWishlist();

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  const navLinks = [
    { name: "Home",     path: "/home" },
    { name: "About",    path: "/about" },
    { name: "Products", path: "/products" },
    { name: "Shop",     path: "/shop" },
    { name: "Contact",  path: "/contact" },
  ];

  return (
    <Navbar maxWidth="full" className="bg-primary-purple text-white px-10 py-8 fixed top-0 left-0 w-full z-50">
      <NavbarBrand>
        <img src={logo} alt="Logo" width={150} className="cursor-pointer" onClick={() => navigate("/home")} />
      </NavbarBrand>

      {/* Desktop Links */}
      <NavbarContent className="hidden sm:flex gap-6 p-4" justify="center">
        {navLinks.map((link) => (
          <NavbarItem key={link.path}>
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                `uppercase font-semibold transition ${isActive ? "text-amber-300" : "hover:text-amber-200"}`
              }
            >
              {link.name}
            </NavLink>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Icons + Dropdown */}
      <NavbarContent as="div" justify="end" className="flex gap-3 items-center">

        {/* Wishlist */}
        <NavbarItem>
          <button onClick={() => navigate("/wishlist")} className="hover:opacity-80 transition">
            <Badge color="warning" content={wishlistCount} showOutline={false}>
              <MdFavoriteBorder className="text-3xl text-white" />
            </Badge>
          </button>
        </NavbarItem>

        {/* Cart */}
        <NavbarItem>
          <button onClick={() => navigate("/cart")} className="hover:opacity-80 transition">
            <Badge color="warning" content={cartCount} showOutline={false}>
              <CiShoppingCart className="text-3xl text-white" />
            </Badge>
          </button>
        </NavbarItem>

        {/* User Dropdown */}
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <button className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white hover:bg-purple-700 transition">
              <FaUserCircle className="text-3xl text-white" />
            </button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            {!isLoggedIn ? (
              <>
                <DropdownItem key="signup" textValue="Sign up">
                  <NavLink to="/register" className="flex items-center gap-2 font-semibold">
                    <MdPersonAddAlt1 className="text-xl text-purple-600" /> Sign up
                  </NavLink>
                </DropdownItem>
                <DropdownItem key="signin" textValue="Sign in">
                  <NavLink to="/login" className="flex items-center gap-2 font-semibold">
                    <MdLogin className="text-xl text-purple-600" /> Sign in
                  </NavLink>
                </DropdownItem>
              </>
            ) : (
              <>
                <DropdownItem key="profile" textValue="My Profile">
                  <NavLink to="/profile" className="flex items-center gap-2 font-semibold">
                    <FaUserCircle className="text-xl text-purple-600" /> My Profile
                  </NavLink>
                </DropdownItem>
                <DropdownItem key="orders" textValue="My Orders">
                  <NavLink to="/orders" className="flex items-center gap-2 font-semibold">
                    <CiShoppingCart className="text-xl text-purple-600" /> My Orders
                  </NavLink>
                </DropdownItem>
                <DropdownItem key="address" textValue="My Addresses">
                  <NavLink to="/address" className="flex items-center gap-2 font-semibold">
                    <MdPersonAddAlt1 className="text-xl text-purple-600" /> My Addresses
                  </NavLink>
                </DropdownItem>
                <DropdownItem key="logout" color="danger" textValue="Log Out" onClick={handleLogout}>
                  <span className="flex items-center gap-2 font-semibold text-red-500">
                    <MdLogout className="text-xl" /> Log Out
                  </span>
                </DropdownItem>
              </>
            )}
          </DropdownMenu>
        </Dropdown>

        {/* Hamburger */}
        <Button className="sm:hidden ml-2 p-2" variant="ghost" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <HiX className="text-3xl text-white" /> : <HiOutlineMenu className="text-3xl text-white" />}
        </Button>
      </NavbarContent>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="sm:hidden absolute top-full left-0 w-full bg-primary-purple text-white flex flex-col gap-2 p-4 z-50 shadow-md">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `uppercase font-semibold py-2 ${isActive ? "text-amber-300" : "hover:text-amber-200"}`
              }
              onClick={() => setMobileOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}
          {isLoggedIn ? (
            <>
              <NavLink to="/profile"  className="uppercase font-semibold py-2 hover:text-amber-200" onClick={() => setMobileOpen(false)}>My Profile</NavLink>
              <NavLink to="/orders"   className="uppercase font-semibold py-2 hover:text-amber-200" onClick={() => setMobileOpen(false)}>My Orders</NavLink>
              <NavLink to="/wishlist" className="uppercase font-semibold py-2 hover:text-amber-200" onClick={() => setMobileOpen(false)}>
                Wishlist {wishlistCount > 0 && <span className="ml-1 bg-amber-400 text-black text-xs font-bold px-1.5 py-0.5 rounded-full">{wishlistCount}</span>}
              </NavLink>
              <NavLink to="/cart"     className="uppercase font-semibold py-2 hover:text-amber-200" onClick={() => setMobileOpen(false)}>
                Cart {cartCount > 0 && <span className="ml-1 bg-amber-400 text-black text-xs font-bold px-1.5 py-0.5 rounded-full">{cartCount}</span>}
              </NavLink>
              <NavLink to="/address"  className="uppercase font-semibold py-2 hover:text-amber-200" onClick={() => setMobileOpen(false)}>Addresses</NavLink>
              <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="text-left uppercase font-semibold py-2 text-red-300 hover:text-red-200">
                Log Out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login"    className="uppercase font-semibold py-2 hover:text-amber-200" onClick={() => setMobileOpen(false)}>Sign In</NavLink>
              <NavLink to="/register" className="uppercase font-semibold py-2 hover:text-amber-200" onClick={() => setMobileOpen(false)}>Register</NavLink>
            </>
          )}
        </div>
      )}
    </Navbar>
  );
}