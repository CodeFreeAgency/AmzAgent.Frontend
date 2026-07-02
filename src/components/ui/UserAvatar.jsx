import PropTypes from "prop-types";

const DEFAULT_AVATAR = `${import.meta.env.BASE_URL}img/staff-avatar.svg`;

export function UserAvatar({ src, name, size = "sm", className = "" }) {
  const sizes = {
    xs: "h-7 w-7",
    sm: "h-9 w-9",
    md: "h-11 w-11",
  };

  return (
    <img
      src={src || DEFAULT_AVATAR}
      alt={name ? `${name} avatar` : "User avatar"}
      className={`${sizes[size] || sizes.sm} shrink-0 rounded-xl object-cover ring-2 ring-white shadow-sm ${className}`}
    />
  );
}

UserAvatar.propTypes = {
  src: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.oneOf(["xs", "sm", "md"]),
  className: PropTypes.string,
};

export default UserAvatar;
