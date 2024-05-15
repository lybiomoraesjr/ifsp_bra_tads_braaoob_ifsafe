import { OccurrenceStatusEnum } from "@/types";
import { Badge, BadgeText } from "@gluestack-ui/themed";

type StatusBadge = {
  status: OccurrenceStatusEnum;
};

const StatusBadge: React.FC<StatusBadge> = ({ status }) => {
  return (
    <Badge
      justifyContent="center"
      borderRadius="$sm"
      variant="outline"
      action={
        status === OccurrenceStatusEnum.SOLVED
          ? "success"
          : status === OccurrenceStatusEnum.CANCELLED
          ? "error"
          : "warning"
      }
    maxWidth={120}
    >
      <BadgeText>{status}</BadgeText>
    </Badge>
  );
};

export default StatusBadge;
