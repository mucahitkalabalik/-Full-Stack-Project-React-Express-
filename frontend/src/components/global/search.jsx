import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaSearch } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { getProducts } from "../../redux/productSlice"; 

export const Search = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      dispatch(getProducts(searchQuery));
    } else if (searchQuery.trim().length === 0) {
      dispatch(getProducts("")); 
    }
  }, [searchQuery, dispatch]);

  const searchProduct = () => {
    if (searchQuery.trim().length >= 2) {
      dispatch(getProducts(searchQuery)); 
    }
  };

  return (
    <>
      <input
        type="search"
        id="default-search"
        className="block w-full p-4 text-sm text-gray-900 outline-0 focus:ring-blue-500 dark:text-white"
        placeholder={t("search")}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        required
      />
      <FaSearch
        size={20}
        className="cursor-pointer"
        onClick={searchProduct}
      />
    </>
  );
};

export default Search;
