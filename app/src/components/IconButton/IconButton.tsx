import { IconProps } from "phosphor-react-native";
import React, { ComponentProps, ElementType } from "react";
import Loading from "../Loading";
import { Button, ButtonIcon, ButtonText } from "@gluestack-ui/themed";

type IconButtonProps = ComponentProps<typeof ButtonIcon> & {
  icon: ElementType<IconProps>;
  isLoading?: boolean;
  onPress?: () => Promise<void> | void;
  bgColor?: string;
  activeBgColor?: string;
  text?: string;
};

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  isLoading,
  onPress,
  bgColor = "$brandMid",
  activeBgColor = "$brandLight",
  text,
  ...rest
}) => {
  return (
    <Button
      onPress={onPress}
      bgColor={bgColor}
      isDisabled={isLoading}
      $active-backgroundColor={activeBgColor}
      h="$14"
      minWidth="$14"
      gap={isLoading ? "$4" : "$1"}
    >
      <ButtonIcon as={icon} size="xl" {...rest} />

      {isLoading ? (
        <Loading bgColor="transparent" color="$white" />
      ) : (
        text && <ButtonText>{text}</ButtonText>
      )}
    </Button>
  );
};

export default IconButton;
