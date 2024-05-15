import React from "react";
import { Button, Text } from "@gluestack-ui/themed";

type StatusProps = {
  name: string;
  isActive?: boolean;
  onPress?: () => void;
};

const FilterButton: React.FC<StatusProps> = ({
  name,
  isActive,
  onPress,
  ...rest
}) => {
  return (
    <Button
      mr="$3"
      minWidth="$24"
      h="$10"
      bg="$white"
      rounded="$md"
      justifyContent="center"
      alignItems="center"
      borderColor={"$brandLight"}
      borderWidth={isActive ? 1: 0}
      bgColor={isActive ? "$white" : "$gray200"}
      onPress={onPress}
      {...rest}
    >
      <Text
        color={isActive ? "$brandLight" : "$gray700"}
        textTransform="uppercase"
        fontSize="$xs"
        fontFamily="$heading"
      >
        {name}
      </Text>
    </Button>
  );
};

export default FilterButton;
