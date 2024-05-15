import React from "react";
import { Center, Spinner } from "@gluestack-ui/themed";

type LoadingProps = {
  bgColor?: string;
  color?: string;
};

const Loading: React.FC<LoadingProps> = ({ bgColor = "$white", color="$brandLight" }) => {
  return (
    <Center flex={1} bg={bgColor}>
      <Spinner color={color} />
    </Center>
  );
};

export default Loading;
