import { OccurrenceCardDTO } from "@/dtos/OccurrenceCardDTO";
import { OccurrenceDTO } from "@/dtos/OccurrenceDTO";
import { occurrenceService } from "@/services";
import { NewOccurrenceFormData, OccurrenceStatusEnum } from "@/types";
import { createContext, ReactNode, useState } from "react";

export type OccurrenceContextDataProps = {
  fetchOccurrenceCards: () => Promise<void>;
  occurrenceCards: OccurrenceCardDTO[];
  setOccurrenceCards: (occurrenceCards: OccurrenceCardDTO[]) => void;
  fetchOccurrence: (occurrenceId: string) => Promise<void>;
  occurrence: OccurrenceDTO;
  setOccurrence: (occurrence: OccurrenceDTO) => void;
  handleCreateOccurrence: (
    data: NewOccurrenceFormData,
    encodedUserPhoto: string | null
  ) => Promise<void>;
  handleLikeOccurrence: (occurrenceId: string) => Promise<void>;
  positionOfTheOccurrenceInTheArray: number;
  setPositionOfTheOccurrenceInTheArray: (
    positionOfTheOccurrenceInTheArray: number
  ) => void;
  occurrenceUpdated: boolean;
  setOccurrenceUpdated: (occurrenceUpdated: boolean) => void;
  handleStatusChange: (
    occurrenceId: string,
    status: OccurrenceStatusEnum,
    comment: string
  ) => Promise<void>;
  handleMakeAComment: (occurrenceId: string, comment: string) => Promise<void>;
};

export const OccurrenceContext = createContext<OccurrenceContextDataProps>(
  {} as OccurrenceContextDataProps
);

type OccurrenceContextProviderProps = {
  children: ReactNode;
};

export const OccurrenceContextProvider = ({
  children,
}: OccurrenceContextProviderProps) => {
  const [occurrenceCards, setOccurrenceCards] = useState<OccurrenceCardDTO[]>(
    []
  );
  const [occurrence, setOccurrence] = useState<OccurrenceDTO>(
    {} as OccurrenceDTO
  );

  const [occurrenceUpdated, setOccurrenceUpdated] = useState<boolean>(false);

  const [
    positionOfTheOccurrenceInTheArray,
    setPositionOfTheOccurrenceInTheArray,
  ] = useState<number>(-1);

  const fetchOccurrenceCards = async () => {
    const data = await occurrenceService.list();
    setOccurrenceCards(data.reverse());
  };

  const fetchOccurrence = async (occurrenceId: string) => {
    const data = await occurrenceService.getById(occurrenceId);
    setOccurrence(data);
  };

  const handleCreateOccurrence = async (
    data: NewOccurrenceFormData,
    encodedUserPhoto: string | null
  ) => {
    await occurrenceService.create({
      title: data.title,
      description: data.description,
      location: data.location,
      image: encodedUserPhoto,
    });
  };

  const handleLikeOccurrence = async (occurrenceId: string) => {
    await occurrenceService.toggleLike(occurrenceId);
  };

  const handleMakeAComment = async (occurrenceId: string, comment: string) => {
    await occurrenceService.addComment(occurrenceId, comment);
  };

  const handleStatusChange = async (
    occurrenceId: string,
    status: OccurrenceStatusEnum,
    comment: string
  ) => {
    await occurrenceService.changeStatus(occurrenceId, status, comment);
  };

  return (
    <OccurrenceContext.Provider
      value={{
        fetchOccurrenceCards,
        occurrenceCards,
        setOccurrenceCards,
        fetchOccurrence,
        occurrence,
        setOccurrence,
        handleCreateOccurrence,
        handleLikeOccurrence,
        positionOfTheOccurrenceInTheArray,
        setPositionOfTheOccurrenceInTheArray,
        occurrenceUpdated,
        setOccurrenceUpdated,
        handleStatusChange,
        handleMakeAComment,
      }}
    >
      {children}
    </OccurrenceContext.Provider>
  );
};
