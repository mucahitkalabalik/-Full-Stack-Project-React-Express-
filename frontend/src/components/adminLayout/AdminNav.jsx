import React, { useState } from "react";
import { MdOutlineDashboard } from "react-icons/md";
import {
  HiOutlineChevronDoubleRight,
  HiOutlineChevronDoubleLeft,
} from "react-icons/hi2";

function AdminNav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-14"
      } transition-all duration-300 dark:bg-zinc-900 bg-gray-300 h-auto relative flex flex-col`}
    >
      <div className="flex flex-col items-center justify-center p-4">
        {isOpen ? (
          <>
            <h3 className="text-xl font-semibold">Admin Name</h3>
            <p className="text-sm text-gray-500">admin@example.com</p>
          </>
        ) : (
          <h3 className="text-xl font-semibold">A</h3>
        )}
      </div>

      <ul className="mt-6 flex-1">
        <li className="hover:bg-gray-700 dark:hover:bg-gray-800 p-4 cursor-pointer transition-all">
          <a href="/admin/dashboard" className="flex items-center gap-2">
            <MdOutlineDashboard className="text-xl" />
            {isOpen && <span>Dashboard</span>}
          </a>
        </li>
      </ul>

      <button
        onClick={toggleNav}
        className="absolute top-5 -right-4 bg-gray-300 dark:bg-zinc-800 p-2 rounded-full transition-all cursor-pointer"
      >
        {isOpen ? (
          <HiOutlineChevronDoubleLeft />
        ) : (
          <HiOutlineChevronDoubleRight />
        )}
      </button>
    </div>
  );
}

export default AdminNav;
