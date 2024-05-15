import {
  HStack,
  Pressable,
  ToastDescription,
  ToastTitle,
  VStack,
} from "@gluestack-ui/themed";
import { Icon, Toast } from "@gluestack-ui/themed";
import { X } from "phosphor-react-native";

type ToastMessageProps = {
  id: string;
  title: string;
  description: string;
  action?: "error" | "success";
  onClose: () => void;
};

const ToastMessage: React.FC<ToastMessageProps> = ({
  id,
  title,
  description,
  action = "success",
  onClose,
}) => {
  return (
    <Toast
      nativeID={`toast-${id}`}
      action={action}
      bgColor={action === "success" ? "$green500" : "$red500"}
      mt="$10"
    >
      <VStack space="xs" w="$full">
        <HStack justifyContent="space-between" reversed={false}>
          <ToastTitle color="$white" fontFamily="$heading">
            {title}
          </ToastTitle>
          <Pressable onPress={onClose}>
            <Icon as={X} color="$coolGray50" size="md" />
          </Pressable>
        </HStack>

        <ToastDescription color="$white" fontFamily="$body">
          {description}
        </ToastDescription>
      </VStack>
    </Toast>
  );
};

export default ToastMessage;
