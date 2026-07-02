import PropTypes from "prop-types";
import { getStaffAvatarUrl } from "@/lib/staffAvatars";

const DEFAULT_AVATAR = `${import.meta.env.BASE_URL}img/staff-avatar.svg`;

export function StaffAvatar({ avatar, name, size = "md", className = "" }) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-base",
  };

  const src = getStaffAvatarUrl(avatar);
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

  if (src) {
    return (
      <img
        src={src}
        alt={name ? `${name} avatar` : "Staff avatar"}
        className={`${sizes[size] || sizes.md} shrink-0 rounded-full object-cover ring-2 ring-white shadow-sm ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size] || sizes.md} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white ring-2 ring-white shadow-sm ${className}`}
      aria-hidden={!name}
    >
      {initials}
    </div>
  );
}

StaffAvatar.propTypes = {
  avatar: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  className: PropTypes.string,
};

export function StaffAvatarPreview({ avatar, name, className = "" }) {
  const src = getStaffAvatarUrl(avatar) || (avatar?.startsWith("data:") ? avatar : null);

  if (src) {
    return (
      <img
        src={src}
        alt="Preview"
        className={`h-20 w-20 rounded-full object-cover ring-2 ring-slate-200 ${className}`}
      />
    );
  }

  return (
    <img
      src={DEFAULT_AVATAR}
      alt="Default avatar"
      className={`h-20 w-20 rounded-full object-cover ring-2 ring-slate-200 ${className}`}
    />
  );
}

StaffAvatarPreview.propTypes = {
  avatar: PropTypes.string,
  name: PropTypes.string,
  className: PropTypes.string,
};

export default StaffAvatar;
