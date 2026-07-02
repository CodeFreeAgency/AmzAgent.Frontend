import PropTypes from "prop-types";
import { Input, Typography } from "@material-tailwind/react";

export const inputClassName =
  "!border-blue-gray-200 focus:!border-blue-500 focus:!border-t-blue-500";
export const labelProps = { className: "before:content-none after:content-none" };

export function AuthField({ label, error, required: _required, ...inputProps }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Typography variant="small" className="font-medium text-slate-600">
        {label}
      </Typography>
      <Input
        size="lg"
        className={inputClassName}
        labelProps={labelProps}
        crossOrigin=""
        {...inputProps}
      />
      {error && (
        <Typography variant="small" className="text-xs text-red-500">
          {error}
        </Typography>
      )}
    </div>
  );
}

AuthField.propTypes = {
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
  required: PropTypes.bool,
};

export default AuthField;
