import { IconMinus, IconPlus, IconShoppingCartPlus } from "@tabler/icons-react";
import { useState } from "react";
import PropTypes from 'prop-types'

export default function Cart({handleCart}) {
  const [cart, setCart] = useState(0);

  const handleAddCart = () => {
    let cartNow = cart
    setCart(++cartNow);
    handleCart(cartNow)
  };
  const handleSubtrCart = () => {
    if (cart === 0) return;
    let cartNow = cart
    setCart(--cartNow);
    handleCart(cartNow)
  };
  return (
    <>
      {cart === 0 ? (
        <button type="button" className="btn btn-info btn-sm text-white" onClick={handleAddCart}>
          <IconShoppingCartPlus />
        </button>
      ) : (
        <div className="d-flex justify-content-between align-items-center">
          <button type="button" className="btn btn-secondary btn-sm" onClick={handleSubtrCart}>
            <IconMinus />
          </button>
          <b className="ms-2 me-2">{cart}</b>
          <button onClick={handleAddCart} type="button" className="btn btn-secondary btn-sm">
            <IconPlus />
          </button>
        </div>
      )}
    </>
  );
}

Cart.propTypes = {
    handleCart: PropTypes.func
}