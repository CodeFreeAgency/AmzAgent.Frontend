import PropTypes from "prop-types";
import { Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

export function TableColumnFilter({ label, value, onChange, options = [] }) {
  const isActive = Boolean(value);
  const activeLabel = options.find((opt) => opt.value === value)?.label;

  return (
    <Menu placement="bottom-start" allowHover={false}>
      <MenuHandler>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          title={isActive ? `Filtered: ${activeLabel}` : `Filter ${label}`}
          aria-label={isActive ? `Filtered: ${activeLabel}` : `Filter ${label}`}
          className={`flex w-full min-w-0 items-center gap-1 rounded-md py-0.5 text-left transition-colors hover:bg-slate-50 ${
            isActive ? "text-blue-700" : "text-slate-600"
          }`}
        >
          <span className="truncate text-xs font-medium">{label}</span>
          <ChevronDownIcon
            className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-blue-600" : "text-slate-400"}`}
            aria-hidden="true"
          />
        </button>
      </MenuHandler>
      <MenuList className="min-w-[148px] p-1">
        {options.map(({ value: optValue, label: optLabel }) => {
          const selected = value === optValue;
          return (
            <MenuItem
              key={optValue || "__all__"}
              onClick={() => onChange(optValue)}
              className={`flex items-center justify-between gap-3 rounded-md px-2.5 py-1.5 text-xs ${
                selected ? "bg-blue-50 font-medium text-blue-700" : "text-slate-700"
              }`}
            >
              <span>{optLabel}</span>
              {selected && <CheckIcon className="h-3.5 w-3.5 shrink-0 text-blue-600" />}
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}

TableColumnFilter.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
};

export default TableColumnFilter;
