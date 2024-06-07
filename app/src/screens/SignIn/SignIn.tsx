import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorRoutesProps } from "@/routes/auth.routes";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import { AppError } from "@/utils/AppError";
import { Image, ScrollView, useToast, VStack } from "@gluestack-ui/themed";
import { Center } from "@gluestack-ui/themed";
import { Heading } from "@gluestack-ui/themed";
import { StatusBar } from "@gluestack-ui/themed";
import { Text } from "@gluestack-ui/themed";
import ToastMessage from "@/components/ToastMessage";

type FormDataProps = {
  email: string;
  password: string;
};

const signInSchema = yup.object({
  email: yup.string().required("Informe o e-mail").email("E-mail inválido."),
  password: yup
    .string()
    .required("Informe a senha")
    .min(6, "A senha deve ter pelo menos 6 dígitos."),
});

const SignIn: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { signIn } = useAuth();

  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(signInSchema),
  });

  const { navigate } = useNavigation<AuthNavigatorRoutesProps>();

  const handleNewAccount = () => {
    navigate("signUp");
  };

  const handleSignIn = async ({ email, password }: FormDataProps) => {
    try {
      setIsLoading(true);
      await signIn(email, password);
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <ToastMessage
            id={id}
            title="Sucesso!"
            description="Entrou com sucesso."
            onClose={() => toast.close(id)}
          />
        ),
      });
    } catch (error) {
      const isAppError = error instanceof AppError;

      setIsLoading(false);

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
                : "Não foi possível entrar. Tente novamente mais tarde."
            }
            onClose={() => toast.close(id)}
          />
        ),
      });
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      backgroundColor="$white"
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <VStack pt={96}>
        <Image
          w="$full"
          h={120}
          source={require("@/assets/ifsafe-logo.png")}
          defaultSource={require("@/assets/ifsafe-logo.png")}
          alt="Logo IfSafe"
        />

        <VStack px="$8" pt={24}>
          <Center gap="$2" mb={24}>
            <Heading color="$gray700">Acesse a conta</Heading>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="E-mail"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.email?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Senha"
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry
                  errorMessage={errors.password?.message}
                  returnKeyType="send"
                  onSubmitEditing={handleSubmit(handleSignIn)}
                />
              )}
            />

            <Button
              title="Acessar"
              isLoading={isLoading}
              onPress={handleSubmit(handleSignIn)}
            />
          </Center>
          <Center mt={96}>
            <Text color="$black" fontSize="$sm" mb="$3" fontFamily="$body">
              Ainda não tem acesso?
            </Text>

            <Button
              variant="outline"
              title="Criar Conta"
              onPress={handleNewAccount}
            />
          </Center>
        </VStack>
      </VStack>
    </ScrollView>
  );
};

export default SignIn;
