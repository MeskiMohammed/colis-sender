import { BookAlert } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col h-[calc(100%-4rem)] justify-center items-center">
      <BookAlert size={200} />
      <div className="font-black text-4xl">404 Not Found</div>
    </div>
  );
}
