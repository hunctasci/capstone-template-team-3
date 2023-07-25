"use client"

import { useState } from "react";
import Logo from "../Logo/Logo";
import Search from "../Search/Search";
import NavLink from "../NavLink/NavLink";
import Button from "../Button/Button";
import "./Navbar.css"
import { HiSearchCircle } from "react-icons/hi"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux";
import { auth } from "../../firebase/firebase";
import { userSignOut, returnToInitialState } from "@/app/lib/features/userSlice";
import { useAuthState } from 'react-firebase-hooks/auth';
import { openModal, closeModal } from "@/app/lib/features/kickOffModalSlice";

const Navbar = () => {
  const [user, loading] = useAuthState(auth)
  const [toggleDropdown, setToggleDropdown] = useState(false)
  const [toggleSearch, setToggleSearch] = useState(false)
  const [isHidden, setIsHidden] = useState("xl:hidden")
  const router = useRouter()
  const dispatch = useDispatch()

  const handleToggleDropdown = () => {
    setToggleDropdown((prevState) => !prevState)
  }

  const handleToggleSearch = () => {
    setToggleSearch((prevState) => !prevState)
  }

  const handleLogin = () => {
    router.push('/sign-in')
  }

  const handleLogout = () => {
    dispatch(userSignOut());
    dispatch(returnToInitialState());
    router.push('/')
  }

  const handleModalToggle = () => {
    router.push("/my-campaigns")
    dispatch(openModal())
  }

  return (
    <div className="bg-theme">
      <nav className="container mx-auto flex flex-row justify-between items-center py-5 px-5 whitespace-nowrap">
        <div className="flex justify-between items-center">
          <Logo />
        </div>
        <div className="relative">
          <HiSearchCircle className={isHidden} size={40} title="Search" onClick={() => {
            handleToggleSearch();
            setToggleDropdown(false);
          }} />
          {isHidden === "xl:hidden" && !toggleSearch ? (
            <Search style="bg-accent text-gray-900 rounded-lg focus:ring-0 w-[20rem] p-2.5 border-0 h-11 ms-8 hidden xl:block" />
          ) : (
            <Search style="bg-accent text-gray-900 text-sm lg:text-[1rem] rounded-lg focus:ring-0 w-[12.4rem] lg:w-[14rem] p-2.5 border-0 h-11 -left-20 lg:-left-24 inset-y-[3.2rem] sm:inset-y-10 absolute drop-shadow-2xl" />
          )}
        </div>
        <div className="lg:flex lg:justify-between lg:items-center hidden">
          <NavLink to="/campaigns" name="Home" style="lg:ms-0 xl:ms-8" />
          {user && (
            <>
              <NavLink to="/my-campaigns" name="My Campaigns" style="lg:ms-8" />
              <NavLink to="/profile" name="Profile" style="lg:ms-8" />
              <Button type="button" name="New project" style="lg:ms-8 navbar-button" clickAction={handleModalToggle} />
            </>
          )}
          <Button type="button" name={user ? "Sign out" : "Sign in"} style="ms-5 navbar-button" clickAction={!user ? () => handleLogin() : () => handleLogout()} />
        </div>
        <div className="lg:hidden relative">
          <Button type="button" style="relative group" clickAction={() => {
            setToggleSearch(false);
            handleToggleDropdown();
          }}>
            <div
              className="relative flex overflow-hidden items-center justify-center rounded-full w-[50px] h-[50px] transform transition-all bg-accent-black ring-0 ring-accent hover:ring-4 group-focus:ring-4 ring-opacity-100 duration-200 shadow-md">
              <div
                className="flex flex-col justify-between w-[20px] h-[20px] transform transition-all duration-300 origin-center overflow-hidden">
                <div
                  className="bg-theme h-[2px] w-7 transform transition-all duration-300 origin-left group-focus:translate-x-10">
                </div>
                <div
                  className="bg-theme h-[2px] w-7 rounded transform transition-all duration-300 group-focus:translate-x-10 delay-75">
                </div>
                <div
                  className="bg-theme h-[2px] w-7 transform transition-all duration-300 origin-left group-focus:translate-x-10 delay-150">
                </div>
                <div
                  className="absolute items-center justify-between transform transition-all duration-500 top-2.5 -translate-x-10 group-focus:translate-x-0 flex w-0 group-focus:w-12">
                  <div
                    className="absolute bg-theme h-[2px] w-5 transform transition-all duration-500 rotate-0 delay-300 group-focus:rotate-45">
                  </div>
                  <div
                    className="absolute bg-theme h-[2px] w-5 transform transition-all duration-500 -rotate-0 delay-300 group-focus:-rotate-45">
                  </div>
                </div>
              </div>
            </div>
          </Button>
          {toggleDropdown && (
            <div className="bg-accent rounded-lg min-w-max min-h-fit absolute inset-y-14 right-5 p-4 flex flex-col text-sm items-stretch justify-center text-center drop-shadow-2xl">
              <NavLink to="/campaigns" name="Home" style="mb-2" />
              {user && (
                <>
                  <NavLink to="/my-campaigns" name="My Campaigns" style="mb-2" />
                  <NavLink to="/profile" name="Profile" style="mb-2" />
                  <Button type="button" name="New project" style="navbar-button mb-2" clickAction={handleModalToggle} />
                </>
              )}
              <Button type="button" name={user ? "Sign out" : "Sign in"} style="navbar-button" clickAction={!user ? () => handleLogin() : () => handleLogout()} />
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
