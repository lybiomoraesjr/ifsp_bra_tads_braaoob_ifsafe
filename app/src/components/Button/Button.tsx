import React, { ComponentProps } from "react";

import {
  Button as GluestackButton,
  Text,
  ButtonSpinner,
} from "@gluestack-ui/themed";

type ButtonProps = ComponentProps<typeof GluestackButton> & {
  title: string;
  isLoading?: boolean;
  variant?: "solid" | "outline";
};

const Button: React.FC<ButtonProps> = ({
  title,
  isLoading = false,
  variant,
  style,
  ...rest
}) => {
  return (
    <GluestackButton
      w="$full"
      h="$14"
      bg={variant === "outline" ? "transparent" : "$brandMid"}
      borderWidth={variant === "outline" ? "$1" : "$0"}
      borderColor="$brandLight"
      rounded="$sm"
      $active-backgroundColor={
        variant === "outline" ? "$green50" : "$brandLight"
      }
      disabled={isLoading}
      {...rest}
    >
      {isLoading ? (
        <ButtonSpinner color="$white" />
      ) : (
        <Text
          color={variant === "outline" ? "$brandLight" : "$white"}
          fontFamily="$heading"
          fontSize="$sm"
        >
          {title}
        </Text>
      )}
    </GluestackButton>
  );
};

export default Button;
