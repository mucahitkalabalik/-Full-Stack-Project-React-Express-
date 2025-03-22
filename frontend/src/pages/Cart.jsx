import React from "react";
import { useSelector,useDispatch } from "react-redux";
import { MdOutlineClear } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { removeFromCart} from "../redux/productSlice";
import { toast } from "react-toastify";

export const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { cartItems } = useSelector((state) => state.products);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  console.log(cartItems);
  const goToDetail = (item) => {
    navigate(`/product/${item._id}`);
  };

  const removeCart=(item) => {
    dispatch(removeFromCart(item._id))
     toast.success(`${item.name} ${t('removeCart')}`, {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
  }
  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">{t("carts")}</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Sepetiniz boş.</p>
      ) : (
        <div>
          {cartItems.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 border-b"
            >
              <img
                onClick={() => goToDetail(item)}
                src={item.images[0].url}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-md cursor-pointer"
              />
              <div className="flex-1 ml-4">
                <h2
                  onClick={() => goToDetail(item)}
                  className="font-semibold cursor-pointer"
                >
                  {item.name}
                </h2>
                <p>{item.price} TL</p>
              </div>
              <span className="font-bold mr-3">x{item.quantity}</span>
              <button className="btn-primary" onClick={()=> removeCart(item)}>
                <MdOutlineClear size={20} />
              </button>
            </div>
          ))}

          <div className="mt-4 text-xl font-bold">
            {t("Total")}: {totalPrice.toLocaleString("tr-TR")} TL
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
