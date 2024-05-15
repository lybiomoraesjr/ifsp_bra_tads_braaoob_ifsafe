import React, { useState, useRef } from "react";
import IconButton from "../IconButton";
import { Camera, Image, X } from "phosphor-react-native";
import { usePhoto } from "@/hooks/usePhoto";
import { ChooseImageEnum } from "@/types/enums";
import Loading from "../Loading";
import {
  HStack,
  Icon,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
  Heading,
  ModalContent,
  ModalFooter,
  VStack,
} from "@gluestack-ui/themed";
import { Text } from "@gluestack-ui/themed";

type PhotoPickerModalProps = {
  showModal: boolean;
  caller: string;
  closeModal: () => void;
};

const PhotoPickerModal: React.FC<PhotoPickerModalProps> = ({
  showModal,
  caller,
  closeModal,
}) => {
  const { chooseImage } = usePhoto();
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef(null);

  return (
    <Modal isOpen={showModal} onClose={closeModal} finalFocusRef={ref}>
      <ModalBackdrop />
      <ModalContent h="$48" justifyContent="center">
        {isLoading ? (
          <VStack flex={1} justifyContent="center" alignItems="center">
            <Loading bgColor="transparent" />
          </VStack>
        ) : (
          <>
            <ModalHeader>
              <Heading size="lg">Selecione uma Foto</Heading>
              <ModalCloseButton>
                <Icon as={X} />
              </ModalCloseButton>
            </ModalHeader>

            <ModalBody>
              <Text>Escolha uma opção para adicionar uma foto.</Text>
            </ModalBody>

            <ModalFooter justifyContent="center">
              <HStack gap="$4" >
                <IconButton
                  icon={Camera}
                  onPress={async () => {
                    setIsLoading(true);
                    await chooseImage(ChooseImageEnum.OPEN_CAMERA, caller);
                    closeModal();
                    setIsLoading(false);
                  }}
                />
                <IconButton
                  icon={Image}
                  onPress={async () => {
                    setIsLoading(true);
                    await chooseImage(ChooseImageEnum.OPEN_GALLERY, caller);
                    closeModal();
                    setIsLoading(false);
                  }}
                />
              </HStack>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default PhotoPickerModal;
