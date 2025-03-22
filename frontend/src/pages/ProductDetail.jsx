import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getProduct, addToCart } from "../redux/productSlice";
import { Swiper, SwiperSlide } from "swiper/react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import "swiper/css";
import "swiper/css/scrollbar";
import { Scrollbar } from "swiper/modules";

export const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { product, loading, error } = useSelector((state) => state.products);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      dispatch(getProduct(id));
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product?.product?.countInStock > 0) {
      console.log(
        `Ürün sepete eklendi: ${product?.product?.name}, Adet: ${quantity}`
      );
      dispatch(addToCart({ ...product.product, quantity }));
      toast.success(`${product.name} ${t("addCart")}`, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p>Hata: {error}</p>;
  if (!product) return <p>Ürün bulunamadı</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-3 gap-x-4 text-center p-5 lg:mt-5 md:-mt-5 mt-2">
      <div className=" col-span-1">
        {product?.product?.images?.length > 1 && (
          <Swiper scrollbar={{ hide: false }} modules={[Scrollbar]}>
            {product?.product.images.map((img, index) => (
              <SwiperSlide key={index} className="p-5">
                <img
                  src={img.url}
                  alt={`Ürün Resmi ${index + 1}`}
                  className="!w-[100%] !object-contain"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      <div className="flex justify-center items-center flex-col col-span-2">
        <h2 className="text-2xl font-bold uppercase mb-5">
          {product?.product?.name}
        </h2>
        <p className="text-lg mb-5">{product?.product?.description}</p>
        <p className="text-xl font-semibold">
          Fiyat: {product?.product?.price}₺
        </p>
        <p className="text-gray-500">
          Stok: {product?.product?.countInStock} Adet
        </p>
        <p className="text-yellow-500">Puan: {product?.product?.rating}⭐</p>

        {product?.product?.countInStock > 0 && (
          <div className="mt-3">
            <label className="mr-2">Adet:</label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border p-1"
            >
              {[...Array(product?.product?.countInStock).keys()].map((x) => (
                <option key={x + 1} value={x + 1}>
                  {x + 1}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={handleAddToCart}
          disabled={product?.product?.countInStock === 0}
          className={`mt-4 px-6 py-2 text-white font-semibold rounded ${
            product?.product?.countInStock === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "btn-primary"
          }`}
        >
          {product?.product?.countInStock === 0 ? "Stokta Yok" : "Sepete Ekle"}
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
