import React, { createContext, ReactNode, useState } from "react";
import { Alert } from "react-native";
import { ChooseImageEnum } from "@/types/enums";
import { PhotoInfo } from "@/types";
import { useToast } from "@gluestack-ui/themed";
import ToastMessage from "@/components/ToastMessage";
import {
  photoService,
  PhotoPermissionError,
  PhotoTooLargeError,
} from "@/services";

export type PhotoContextDataProps = {
  chooseImage: (
    source: ChooseImageEnum,
    caller: string
  ) => Promise<void | string>;
  selectedPhoto: PhotoInfo;
  setSelectedPhoto: (photo: PhotoInfo) => void;
};

export const PhotoContext = createContext<PhotoContextDataProps>(
  {} as PhotoContextDataProps
);

type PhotoContextProviderProps = {
  children: ReactNode;
};

export const PhotoContextProvider = ({
  children,
}: PhotoContextProviderProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoInfo>(
    {} as PhotoInfo
  );

  const toast = useToast();

  const showErrorToast = (description: string) => {
    toast.show({
      placement: "top",
      render: ({ id }) => (
        <ToastMessage
          id={id}
          action="error"
          title="Erro!"
          description={description}
          onClose={() => toast.close(id)}
        />
      ),
    });
  };

  const chooseImage = async (source: ChooseImageEnum, caller: string) => {
    try {
      const encodedPhoto = await photoService.pick(source);
      if (encodedPhoto) {
        setSelectedPhoto({ uri: encodedPhoto, caller });
      }
    } catch (error) {
      // Permissão de câmera negada usa Alert; demais casos usam toast.
      if (
        error instanceof PhotoPermissionError &&
        source === ChooseImageEnum.OPEN_CAMERA
      ) {
        Alert.alert("Erro!", error.message);
        return;
      }
      if (
        error instanceof PhotoPermissionError ||
        error instanceof PhotoTooLargeError
      ) {
        showErrorToast(error.message);
        return;
      }
      throw error;
    }
  };

  return (
    <PhotoContext.Provider
      value={{
        chooseImage,
        selectedPhoto,
        setSelectedPhoto,
      }}
    >
      {children}
    </PhotoContext.Provider>
  );
};
