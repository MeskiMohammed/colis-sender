import clsx from "clsx";

type ButtonProps = {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

export default function Button(props: ButtonProps) {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      className={clsx(
        "px-4 py-2 rounded transition bg-blue-800 text-white disabled:opacity-50 disabled:cursor-not-allowed",
        props.className
      )}
    >
      {props.children}
    </button>
  );
}
