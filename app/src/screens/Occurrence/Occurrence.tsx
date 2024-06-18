import React, { useEffect, useState } from "react";
import { ChatCircle, Check, Warning, X } from "phosphor-react-native";

import { useRoute } from "@react-navigation/native";
import { AppError } from "@/utils/AppError";
import Loading from "@/components/Loading";

import Button from "@/components/Button";

import { useOccurrence } from "@/hooks/useOccurrence";
import { useAuth } from "@/hooks/useAuth";
import { OccurrenceStatusEnum } from "@/types";
import { formattedDate } from "@/utils/dateUtils";
import ScreenHeader from "@/components/ScreenHeader";
import CommentListModal from "@/components/CommentListModal";
import CommentModal from "@/components/CommentModal";
import ToastMessage from "@/components/ToastMessage";
import {
  Badge,
  BadgeText,
  Center,
  Heading,
  HStack,
  Image,
  ScrollView,
  Text,
  useToast,
} from "@gluestack-ui/themed";
import { VStack } from "@gluestack-ui/themed";
import IconButton from "@/components/IconButton";
import StatusBadge from "@/components/StatusBadge";

type RouteParamsProps = {
  occurrenceId: string;
};

const Occurrence: React.FC = () => {
  const toast = useToast();

  const { user } = useAuth();

  const {
    occurrence,
    setOccurrence,
    fetchOccurrence,
    handleLikeOccurrence,
    positionOfTheOccurrenceInTheArray,
    occurrenceCards,
    setOccurrenceCards,
    handleStatusChange,
    handleMakeAComment,
    setOccurrenceUpdated,
  } = useOccurrence();
  const [isLoading, setIsLoading] = useState(true);

  const [chosenFunction, setChosenFunction] = useState<ChooseFunctionEnum>(
    {} as ChooseFunctionEnum
  );

  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);

  const [isCommentListModalVisible, setIsCommentListModalVisible] =
    useState(false);

  const [isLikeLoading, setIsLikeLoading] = useState(false);

  const route = useRoute();
  const { occurrenceId } = route.params as RouteParamsProps;

  const handleLikeWithLoading = async () => {
    try {
      setIsLikeLoading(true);
      await handleLikeOccurrence(occurrenceId);

      setOccurrenceCards(
        occurrenceCards.map((occurrenceCard, index) => {
          if (index === positionOfTheOccurrenceInTheArray) {
            return {
              ...occurrenceCard,
              likes: occurrenceCard.likes + 1,
            };
          }

          return occurrenceCard;
        })
      );
      setOccurrence({
        ...occurrence,
        likes: occurrence.likes + 1,
      });
    } catch (error) {
      const isAppError = error instanceof AppError;

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <ToastMessage
            id={id}
            action="error"
            title="Erro!"
            description={
              isAppError ? error.data : "Não foi possível alertar a ocorrência."
            }
            onClose={() => toast.close(id)}
          />
        ),
      });
      setIsLikeLoading(false);
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleStatusChangeWithLoading = async (
    status: OccurrenceStatusEnum,
    comment: string
  ) => {
    try {
      await handleStatusChange(occurrenceId, status, comment);

      setOccurrenceCards(
        occurrenceCards.map((occurrenceCard, index) => {
          if (index === positionOfTheOccurrenceInTheArray) {
            return {
              ...occurrenceCard,
              status,
            };
          }

          return occurrenceCard;
        })
      );
      setOccurrence({
        ...occurrence,
        status,
      });

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <ToastMessage
            id={id}
            title="Sucesso"
            description="Status alterado com sucesso."
            onClose={() => toast.close(id)}
          />
        ),
      });
    } catch (error) {
      const isAppError = error instanceof AppError;

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <ToastMessage
            id={id}
            action="error"
            title="Erro!"
            description={
              isAppError
                ? error.data
                : "Não foi possível alterar o status da ocorrência."
            }
            onClose={() => toast.close(id)}
          />
        ),
      });
    }
  };

  const handleMakeACommentWithLoading = async (comment: string) => {
    try {
      await handleMakeAComment(occurrenceId, comment);

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <ToastMessage
            id={id}
            title="Sucesso"
            description="Comentário feito com sucesso."
            onClose={() => toast.close(id)}
          />
        ),
      });

      setOccurrenceUpdated(true);
    } catch (error) {
      const isAppError = error instanceof AppError;

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <ToastMessage
            id={id}
            action="error"
            title="Erro!"
            description={
              isAppError
                ? error.data
                : "Não foi possível comentar a ocorrência."
            }
            onClose={() => toast.close(id)}
          />
        ),
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (occurrenceId) {
        try {
          setIsLoading(true);
          await fetchOccurrence(occurrenceId);
        } catch (error) {
          const isAppError = error instanceof AppError;

          toast.show({
            placement: "top",
            render: ({ id }) => (
              <ToastMessage
                id={id}
                action="error"
                title="Erro!"
                description={
                  isAppError
                    ? error.data
                    : "Não foi possível carregar os detalhes da ocorrência."
                }
                onClose={() => toast.close(id)}
              />
            ),
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [occurrenceId]);

  const displayDate = formattedDate(occurrence.date);

  enum ChooseFunctionEnum {
    HANDLE_COMMENT = "handleComment",
    HANDLE_CANCEL = "handleCancel",
    HANDLE_RESOLVE = "handleResolve",
  }

  const ChooseFunction = {
    [ChooseFunctionEnum.HANDLE_COMMENT]: (params: { comment: string }) =>
      handleMakeACommentWithLoading(params.comment),
    [ChooseFunctionEnum.HANDLE_CANCEL]: (params: { comment: string }) =>
      handleStatusChangeWithLoading(
        OccurrenceStatusEnum.CANCELLED,
        params.comment
      ),
    [ChooseFunctionEnum.HANDLE_RESOLVE]: (params: { comment: string }) =>
      handleStatusChangeWithLoading(
        OccurrenceStatusEnum.SOLVED,
        params.comment
      ),
  };

  return (
    <VStack flex={1} bgColor="$white">
      <ScreenHeader title="Detalhes da Ocorrência" showBackButton />

      {isLoading ? (
        <VStack flex={1} justifyContent="center" alignItems="center">
          <Loading />
        </VStack>
      ) : (
        <ScrollView>
          <VStack px="$6" py="$4">
            <HStack justifyContent="space-between">
              <Text>{occurrence.authorName}</Text>
              <Text>{displayDate}</Text>
            </HStack>

            <Center>
              <Image
                source={{ uri: occurrence.image }}
                alt="Imagem da Ocorrência."
                w="$full"
                h="$80"
                resizeMode="cover"
                rounded="$lg"
                my="$3"
              />
            </Center>
            <Heading>{occurrence.title}</Heading>

            <StatusBadge status={occurrence.status} />

            <HStack>
              <Text>Localização: </Text>
              <Text>{occurrence.location}</Text>
            </HStack>

            <Text>{occurrence.description}</Text>

            <HStack gap="$3" mb="$4">
              <IconButton
                icon={Warning}
                onPress={handleLikeWithLoading}
                isLoading={isLikeLoading}
                bgColor="$warning300"
                activeBgColor="$warning200"
                text={occurrence.likes.toString()}
              />

              <IconButton
                icon={ChatCircle}
                onPress={() => {
                  setIsCommentListModalVisible(true);
                }}
                text={occurrence.comments.length.toString()}
              />
              {user.admin && (
                <>
                  <IconButton
                    icon={Check}
                    onPress={() => {
                      setChosenFunction(ChooseFunctionEnum.HANDLE_RESOLVE);
                      setIsCommentModalVisible(true);
                    }}
                  />
                  <IconButton
                    icon={X}
                    onPress={() => {
                      setChosenFunction(ChooseFunctionEnum.HANDLE_CANCEL);
                      setIsCommentModalVisible(true);
                    }}
                    bgColor="$canceled"
                    activeBgColor="$red300"
                  />
                </>
              )}
            </HStack>

            <Button
              title="Adicionar Comentário"
              onPress={() => {
                setChosenFunction(ChooseFunctionEnum.HANDLE_COMMENT);
                setIsCommentModalVisible(true);
              }}
            />
          </VStack>
        </ScrollView>
      )}
      <CommentListModal
        comments={occurrence.comments}
        showModal={isCommentListModalVisible}
        closeModal={() => setIsCommentListModalVisible(false)}
      />
      <CommentModal
        occurrenceId={occurrenceId}
        showModal={isCommentModalVisible}
        closeModal={() => setIsCommentModalVisible(false)}
        onInteraction={async (comment) => {
          await ChooseFunction[chosenFunction]({ comment });
        }}
      />
    </VStack>
  );
};
export default Occurrence;
