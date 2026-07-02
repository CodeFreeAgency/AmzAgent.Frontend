import PropTypes from "prop-types";
import { Typography } from "@material-tailwind/react";

export function OrderItemCell({ item, extraItems = 0 }) {
  return (
    <Typography className="truncate text-sm text-slate-700">
      {item.name}
      {extraItems > 0 && (
        <span className="ml-1 text-slate-400">+{extraItems}</span>
      )}
    </Typography>
  );
}

OrderItemCell.propTypes = {
  item: PropTypes.shape({
    brand: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  extraItems: PropTypes.number,
};

export default OrderItemCell;
