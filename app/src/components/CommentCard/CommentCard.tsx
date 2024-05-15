import React from "react";
import { formattedDate } from "@/utils/dateUtils";
import { Box, HStack, Text, VStack } from "@gluestack-ui/themed";

type CommentCardProps = {
  name: string;
  text: string;
  date: Date;
};

const CommentCard: React.FC<CommentCardProps> = ({ date, name, text }) => {
  const displayDate = formattedDate(date);
  return (
    <Box
      borderBottomWidth="$1"
      borderColor="$trueGray800"
      py="$2"
    >
      <VStack>
        <HStack justifyContent="space-between">
          <Text fontSize="$md" color="$gray800" fontWeight="$bold">
            Por {name}
          </Text>
          <Text fontSize="$md" color="$gray800" fontWeight="$bold">
            {displayDate}
          </Text>
        </HStack>

        <Text fontSize="$md" color="$gray800">
          {text}
        </Text>
      </VStack>
    </Box>
  );
};

export default CommentCard;
