import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts, addToCart } from "../redux/productSlice";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { IoBasketOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const goToDetail = (item) => {
    navigate(`/product/${item._id}`);
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, quantity: 1 }));
    toast.success(`${product.name} ${t("addCart")}`, {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <>
      <h1 className="text-center text-2xl mt-5">{t("populerProduct")}</h1>
      <div className="px-2">
        {loading ? (
          <p>{t("loading")}</p>
        ) : (
          <Swiper
            slidesPerView={6}
            spaceBetween={30}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            modules={[Pagination]}
            breakpoints={{
              1024: { slidesPerView: 6 },
              768: { slidesPerView: 3 },
              640: { slidesPerView: 2 },
              320: { slidesPerView: 1 },
            }}
          >
            {products?.products?.map((product) => (
              <SwiperSlide key={product._id} className="shadow-md rounded-lg ">
                <Swiper
                  className="w-full h-40"
                  slidesPerView={1}
                  spaceBetween={30}
                  pagination={{
                    clickable: true,
                    dynamicBullets: true,
                  }}
                  modules={[Pagination]}

             
                >
                  {product.images?.map((image, index) => (
                    <SwiperSlide key={index}>
                      <img
                        onClick={() => goToDetail(product)}
                        src={image.url}
                        alt={product.name}
                        className="object-contain cursor-pointer w-full h-40 "
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                <div
                  onClick={() => goToDetail(product)}
                  className="text-center cursor-pointer font-semibold mt-2"
                >
                  {product.name}
                </div>
                <div
                  onClick={() => goToDetail(product)}
                  className="text-center cursor-pointer text-gray-600"
                >
                  {product.price} TL
                </div>

                <div className="text-center mt-2">
                  <button
                    className="btn-primary flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                    onClick={() => handleAddToCart(product)}
                  >
                    <IoBasketOutline size={20} />
                  </button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </>
  );
};

export default Dashboard;
