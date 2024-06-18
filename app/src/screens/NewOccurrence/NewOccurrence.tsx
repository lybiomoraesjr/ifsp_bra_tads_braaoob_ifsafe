import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Button from "@/components/Button";
import Input from "@/components/Input";
import PhotoPickerModal from "@/components/PhotoPickerModal";
import { usePhoto } from "@/hooks/usePhoto";
import { TouchableOpacity, View } from "react-native";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@/routes/app.routes";
import { useOccurrence } from "@/hooks/useOccurrence";
import { NewOccurrenceFormData } from "@/types";
import { AppError } from "@/utils/AppError";
import ScreenHeader from "@/components/ScreenHeader";
import {
  Box,
  Center,
  HStack,
  Image,
  ScrollView,
  Text,
  useToast,
  VStack,
} from "@gluestack-ui/themed";
import ToastMessage from "@/components/ToastMessage";
import Textarea from "@/components/Textarea/Textarea";
import ConfirmationModal from "@/components/ConfirmationModal";

const profileSchema = yup.object({
  title: yup
    .string()
    .required("Informe o título")
    .min(3, "A título deve ter pelo menos 3 dígitos.")
    .max(50, "O títilo deve ter no máximo 50 dígitos."),
  location: yup.string().required("Informe a localização"),
  description: yup.string().required("Informe a descrição"),
});

const NewOccurrence: React.FC = () => {
  const { navigate } = useNavigation<AppNavigatorRoutesProps>();

  const [isLoading, setIsLoading] = useState(false);

  const CALLER = "newOccurrence";

  const toast = useToast();

  const [isPhotoPickerModalVisible, setIsPhotoPickerModalVisible] =
    useState(false);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] =
    useState(false);

  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const { handleCreateOccurrence, setOccurrenceUpdated } = useOccurrence();

  const { selectedPhoto, setSelectedPhoto } = usePhoto();

  const {
    control,
    handleSubmit,
    reset,
    trigger,
    formState: { errors },
  } = useForm<NewOccurrenceFormData>({
    resolver: yupResolver(profileSchema),
  });

  const handleResetForm = (): void => {
    reset({
      title: "",
      description: "",
      location: "",
    });

    setPhotoUri(null);
    setSelectedPhoto({ uri: "", caller: "" });
    navigate("home");
  };

  const handlePublish = async (data: NewOccurrenceFormData) => {
    try {
      setIsLoading(true);
      await handleCreateOccurrence(data, photoUri);

      setOccurrenceUpdated(true);
      setIsConfirmationModalVisible(false);

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <ToastMessage
            id={id}
            title="Sucesso!"
            description="Ocorrência criada com sucesso."
            onClose={() => toast.close(id)}
          />
        ),
      });

      handleResetForm();
    } catch (error) {
      setIsConfirmationModalVisible(false);
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
                : "Não foi possível criar a ocorrência. Tente novamente mais tarde"
            }
            onClose={() => toast.close(id)}
          />
        ),
      });
    } finally {
      setIsLoading(false);
      setIsConfirmationModalVisible(false);
    }
  };

  useEffect(() => {
    if (selectedPhoto.caller === CALLER) {
      setPhotoUri(selectedPhoto.uri);
    }
  }, [selectedPhoto.uri]);

  const handleConfirm = async () => {
    const isValid = await trigger();
    if (isValid) {
      setIsConfirmationModalVisible(true);
    }
  };

  return (
    <VStack flex={1} backgroundColor="$white">
      <ScreenHeader title="Nova ocorrência" />

      <ScrollView>
        <VStack flex={1} px="$8" py="$4">
          <Center gap="$2" flex={1}>
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Título"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.title?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="location"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Localização"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.location?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, value } }) => (
                <Textarea
                  placeholder="Descrição"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.description?.message}
                />
              )}
            />

            {photoUri ? (
              <Image
                w="$full"
                h="$80"
                source={{ uri: photoUri }}
                alt="Imagem da ocorrência."
                resizeMode="cover"
                rounded="$lg"
              />
            ) : (
              <Box w="$full" h="$80" bg="$gray200" rounded="$lg" />
            )}

            <View style={{ alignItems: "center", marginBottom: 12 }}>
              <TouchableOpacity
                onPress={() => setIsPhotoPickerModalVisible(true)}
                style={{ marginTop: 2 }}
              >
                <Text color="$brandMid" fontSize="$sm" fontWeight="$bold">
                  Escolher foto
                </Text>
              </TouchableOpacity>
            </View>

            <HStack gap="$5">
              <Button
                title="Descartar"
                onPress={handleResetForm}
                disabled={isLoading}
                bg="$canceled"
                $active-backgroundColor="$red300"
                w="$7/15"
              />

              <Button title="Publicar" w="$7/15" onPress={handleConfirm} />
            </HStack>
          </Center>
        </VStack>
      </ScrollView>

      <PhotoPickerModal
        showModal={isPhotoPickerModalVisible}
        caller={CALLER}
        closeModal={() => setIsPhotoPickerModalVisible(false)}
      />

      <ConfirmationModal
        showModal={isConfirmationModalVisible}
        closeModal={() => setIsConfirmationModalVisible(false)}
        description="Deseja publicar a ocorrência? Essa ação não poderá ser desfeita."
        onConfirm={handleSubmit(handlePublish)}
      />
    </VStack>
  );
};

export default NewOccurrence;
