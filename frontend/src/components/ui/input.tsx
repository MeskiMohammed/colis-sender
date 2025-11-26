import clsx from "clsx";

export default function Input(props:any) {
  return (
    <input
      type={props.type}
      value={props.value}
      disabled={props.disabled}
      placeholder={props.placeholder}
      onChange={(e) => props.onChange && props.onChange(e)}
      className={clsx("border border-gray-300 focus:border-black w-full rounded px-3 py-2 focus:outline-none", props.className)}
    />
  );
}