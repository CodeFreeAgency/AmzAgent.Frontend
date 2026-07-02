import PropTypes from "prop-types";

export function Toggle({ checked = false, onChange, disabled = false, className = "" }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={checked ? "On" : "Off"}
      disabled={disabled}
      onClick={() => {
        if (!disabled) onChange?.();
      }}
      className={`flex h-6 w-14 shrink-0 items-center rounded-full border p-0.5 shadow-sm transition-colors ${
        checked
          ? "border-blue-500 bg-blue-100"
          : "border-slate-400 bg-slate-200"
      } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:brightness-95"} ${className}`}
    >
      <span
        className={`flex h-full w-1/2 items-center justify-center rounded-full text-[8px] font-bold uppercase leading-none transition-transform duration-200 ease-in-out ${
          checked
            ? "translate-x-full bg-blue-600 text-white shadow-sm"
            : "translate-x-0 bg-white text-slate-600 shadow-sm ring-1 ring-slate-300"
        }`}
      >
        {checked ? "ON" : "OFF"}
      </span>
    </button>
  );
}

Toggle.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default Toggle;
