import React from "react";
import { CaretRight, ChatCircle, Warning } from "phosphor-react-native";
import { TouchableOpacity, TouchableOpacityProps, View } from "react-native";

import { formattedDate } from "@/utils/dateUtils";
import { Heading, HStack, Image, Text, VStack } from "@gluestack-ui/themed";
import { Icon } from "@gluestack-ui/themed";
import StatusBadge from "../StatusBadge/StatusBadge";
import { OccurrenceStatusEnum } from "@/types";

interface OccurrenceCardProps extends TouchableOpacityProps {
  image: string;
  alert: number;
  status: string;
  title: string;
  date: Date;
  commentsNumber: number;
  onInteract: () => void;
}

const OccurrenceCard: React.FC<OccurrenceCardProps> = ({
  image,
  alert,
  status,
  title,
  date,
  commentsNumber,
  onInteract,
  ...rest
}) => {
  const displayDate = formattedDate(date);

  return (
    <TouchableOpacity onPress={onInteract} {...rest}>
      <HStack
        bg="$gray100"
        alignItems="center"
        p="$2"
        pr="$4"
        rounded="$md"
        mb="$3"
      >
        <Image
          source={{ uri: image }}
          alt="Imagem da ocorrência"
          size="lg"
          borderRadius={8}
          mr="$2"
          resizeMode="cover"
        />
        <VStack flex={1} rowGap="$1">
          <Heading fontSize="$md" color="$gray700">
            {title}
          </Heading>

          <Text fontSize="$sm">{displayDate}</Text>

          <StatusBadge status={status as OccurrenceStatusEnum} />

          <HStack>
            <HStack pr="$2" alignItems="center">
              <Icon as={Warning} color="$gray500" />
              <Text>{alert}</Text>
            </HStack>

            <HStack alignItems="center" pr="$2">
              <Icon as={ChatCircle} color="#gray500" />
              <Text>{commentsNumber}</Text>
            </HStack>
          </HStack>
        </VStack>

        <Icon as={CaretRight} color="#gray500" />
      </HStack>
    </TouchableOpacity>
  );
};

export default OccurrenceCard;
