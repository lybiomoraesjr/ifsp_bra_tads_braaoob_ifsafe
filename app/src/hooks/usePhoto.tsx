import { useContext } from "react";
import { PhotoContext } from "@/contexts/PhotoContext";

export const usePhoto = () => {
  const context = useContext(PhotoContext);

  return context;
};
