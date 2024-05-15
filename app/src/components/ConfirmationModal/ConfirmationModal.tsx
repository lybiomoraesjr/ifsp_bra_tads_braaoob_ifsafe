import Button from "../Button";
import React, { useRef, useState } from "react";
import {
  Center,
  HStack,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  Text,
} from "@gluestack-ui/themed";
import { ModalContent } from "@gluestack-ui/themed";
import { ModalHeader } from "@gluestack-ui/themed";
import { Heading } from "@gluestack-ui/themed";
import { Icon } from "@gluestack-ui/themed";
import { X } from "phosphor-react-native";
import { ModalFooter } from "@gluestack-ui/themed";

type ConfirmationModalProps = {
  showModal: boolean;
  description: string;
  closeModal: () => void;
  onConfirm: () => Promise<void>;
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  showModal,
  closeModal,
  onConfirm,
  description,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef(null);

  return (
    <Modal isOpen={showModal} onClose={closeModal} finalFocusRef={ref}>
      <ModalBackdrop />

      <ModalContent>
        <ModalHeader>
          <Heading>Confirmar Ação </Heading>

          <ModalCloseButton>
            <Icon as={X} />
          </ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          <Text>{description}</Text>
        </ModalBody>
        <ModalFooter>
          <HStack gap="$4">
            <Button
              title="Cancelar"
              onPress={closeModal}
              bg="$canceled"
              $active-backgroundColor="$red300"
              w="$7/15"
            />
            <Button
              title="Confirmar"
              onPress={async () => {
                setIsLoading(true);
                await onConfirm();
              }}
              isLoading={isLoading}
              w="$7/15"
            />
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;
