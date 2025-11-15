export default function Input({ value,type="text",disabled, onChange }: { value: string;type?:string;disabled:boolean; onChange: (val: string) => void }) {
  return (
    <input
      type={type}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 w-full rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}