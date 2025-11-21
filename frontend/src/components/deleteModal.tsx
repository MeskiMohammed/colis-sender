import clsx from "clsx";
import Button from "./ui/button";
import { t } from "i18next";
import { useEffect, useState } from "react";

type props = {
  open: boolean;
  close: () => void;
  fn: () => void;
};

export default function DeleteModal({ open, close, fn }: props) {
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  useEffect(() => {
    setOpenDelete(open);
  }, [open]);

  function closeModal() {
    setOpenDelete(false);
    setTimeout(close, 300);
  }

  return (
    <>
      {open && (
        <div className={clsx("absolute inset-0 flex justify-center items-center duration-300", openDelete ? "bg-black/60" : "bg-black/0")}>
          <div className={clsx("py-4 w-5/6 max-h-[calc(100%/6*4)] bg-white rounded-xl shadow-xl flex flex-col duration-300", openDelete ? "scale-100 opacity-100" : "scale-90 opacity-0")}>
            <div className="px-4">{t("common.delete_confirm")}</div>
            <br />
            <div className="flex justify-end items-center gap-2 px-4">
              <Button onClick={closeModal} className="bg-gray-600 hover:bg-gray-500">
                {t("common.cancel")}
              </Button>
              <Button onClick={fn} className="bg-red-600 hover:bg-red-500">
                {t("common.delete")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
