import React, { useEffect, useState } from "react";

import HomeHeader from "../../components/HomeHeader";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "../../routes/app.routes";
import { FlatList, RefreshControl } from "react-native";
import { FilterEnum, OccurrenceStatusEnum } from "@/types";
import OccurrenceCard from "@/components/OccurrenceCard";
import Loading from "@/components/Loading";
import { useAuth } from "@/hooks/useAuth";
import { useOccurrence } from "@/hooks/useOccurrence";
import { AppError } from "@/utils/AppError";
import {
  Heading,
  Text,
  useToast,
  useToken,
  VStack,
} from "@gluestack-ui/themed";
import FilterButton from "../../components/FilterButton";
import ToastMessage from "@/components/ToastMessage";
import { OccurrenceCardDTO } from "@/dtos/OccurrenceCardDTO";

const Home: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterEnum>(FilterEnum.ALL);
  const [filteredOccurrenceCards, setFilteredOccurrenceCards] = useState<
    OccurrenceCardDTO[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { navigate } = useNavigation<AppNavigatorRoutesProps>();

  const toast = useToast();

  const resolvedBrandLight = useToken("colors", "brandLight");

  const { user } = useAuth();

  const {
    fetchOccurrenceCards,
    occurrenceCards,
    setPositionOfTheOccurrenceInTheArray,
    occurrenceUpdated,
    setOccurrenceUpdated,
  } = useOccurrence();

  const handleNavigateToOccurrence = (id: string, index: number) => {
    setPositionOfTheOccurrenceInTheArray(index);

    navigate("occurrence", { occurrenceId: id });
  };

  const OccurrenceFilter: Record<FilterEnum, string> = {
    [FilterEnum.ALL]: "Todas",
    [FilterEnum.MINE]: "Minhas",
    [FilterEnum.PENDING]: OccurrenceStatusEnum.PENDING,
    [FilterEnum.SOLVED]: OccurrenceStatusEnum.SOLVED,
    [FilterEnum.CANCELLED]: OccurrenceStatusEnum.CANCELLED,
  };

  const occurrenceKeys = Object.keys(OccurrenceFilter);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      await fetchOccurrenceCards();
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
                : "Não foi possível carregar as ocorrências. Tente novamente mais tarde."
            }
            onClose={() => toast.close(id)}
          />
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
    setOccurrenceUpdated(false);
  }, [occurrenceUpdated]);

  const chooseFilter = {
    [FilterEnum.ALL]: (occurrences: OccurrenceCardDTO[]) => {
      setFilteredOccurrenceCards(occurrences);
    },
    [FilterEnum.MINE]: (occurrences: OccurrenceCardDTO[]) => {
      const filteredOccurrences = occurrences.filter(
        (occurrence) => occurrence.authorId === user.id
      );
      setFilteredOccurrenceCards(filteredOccurrences);
    },
    [FilterEnum.PENDING]: (occurrences: OccurrenceCardDTO[]) => {
      const filteredOccurrences = occurrences.filter(
        (occurrence) => occurrence.status === OccurrenceStatusEnum.PENDING
      );
      setFilteredOccurrenceCards(filteredOccurrences);
    },
    [FilterEnum.SOLVED]: (occurrences: OccurrenceCardDTO[]) => {
      const filteredOccurrences = occurrences.filter(
        (occurrence) => occurrence.status === OccurrenceStatusEnum.SOLVED
      );
      setFilteredOccurrenceCards(filteredOccurrences);
    },
    [FilterEnum.CANCELLED]: (occurrences: OccurrenceCardDTO[]) => {
      const filteredOccurrences = occurrences.filter(
        (occurrence) => occurrence.status === OccurrenceStatusEnum.CANCELLED
      );
      setFilteredOccurrenceCards(filteredOccurrences);
    },
  };
  
  useEffect(() => {
    if (chooseFilter[activeFilter]) {
      chooseFilter[activeFilter](occurrenceCards);
    }
  }, [activeFilter, occurrenceCards]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchOccurrenceCards();
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
                : "Não foi possível carregar as ocorrências. Tente novamente mais tarde."
            }
            onClose={() => toast.close(id)}
          />
        ),
      });
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <VStack flex={1} backgroundColor="$white">
      <HomeHeader />

      <FlatList
        data={occurrenceKeys.filter(
          (item) => user.admin || item !== FilterEnum.CANCELLED
        )}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <FilterButton
            name={OccurrenceFilter[item as FilterEnum]}
            isActive={activeFilter === item}
            onPress={() => setActiveFilter(item as FilterEnum)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24 }}
        style={{ marginVertical: 30, maxHeight: 44, minHeight: 44 }}
      />

      <Heading color="$gray700" fontSize="$lg" ml="$8" mb="$2">
        Ocorrências:
      </Heading>

      <VStack flex={1} mx="$6">
        {isLoading ? (
          <Loading />
        ) : (
          <FlatList
            data={filteredOccurrenceCards.filter(
              (item) =>
                user.admin || item.status !== OccurrenceStatusEnum.CANCELLED
            )}
            renderItem={({ item, index }) => (
              <OccurrenceCard
                image={item.image}
                alert={item.likes}
                status={item.status}
                title={item.title}
                date={item.date}
                commentsNumber={item.comments.length}
                onInteract={() => handleNavigateToOccurrence(item._id, index)}
              />
            )}
            ListEmptyComponent={() => (
              <VStack>
                <Text>Não há ocorrências disponíveis no momento.</Text>
              </VStack>
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[resolvedBrandLight]}
              />
            }
          />
        )}
      </VStack>
    </VStack>
  );
};

export default Home;
