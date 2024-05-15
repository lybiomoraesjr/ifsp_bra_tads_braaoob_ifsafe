import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/hooks/useAuth";

import defaultUserPhotoImg from "@/assets/userPhotoDefault.png";
import { SignOut } from "phosphor-react-native";
import UserPhoto from "../UserPhoto";
import { Heading, HStack, Text, useToken } from "@gluestack-ui/themed";
import { VStack } from "@gluestack-ui/themed";
import ConfirmationModal from "../ConfirmationModal";

const HomeHeader: React.FC = () => {
  const { user, signOut } = useAuth();

  const white = useToken("colors", "white");
  const greenGradientStart = useToken("colors", "greenGradientStart");
  const greenGradientEnd = useToken("colors", "greenGradientEnd");
  const insets = useSafeAreaInsets();

  const paddingTop = insets.top + 32;

  const firstName = user.name.split(" ")[0];

  const [isVisible, setIsVisible] = useState(false);

  return (
    <LinearGradient colors={[greenGradientStart, greenGradientEnd]}>
      <HStack pt={paddingTop} pb={32} px={32} alignItems="center">
        <UserPhoto
          source={user.avatar ? { uri: user.avatar } : defaultUserPhotoImg}
          size="md"
          alt="Foto do usuário"
        />
        <VStack flex={1} ml={8}>
          <Text color="$white" fontSize={16}>
            Olá,
          </Text>
          <Heading color="$white" fontSize={18} fontFamily="$heading">
            {firstName}
          </Heading>
        </VStack>
        <TouchableOpacity onPress={() => setIsVisible(true)}>
          <SignOut size={32} color={white} />
        </TouchableOpacity>
      </HStack>

      <ConfirmationModal
        showModal={isVisible}
        closeModal={() => setIsVisible(false)}
        description="Deseja sair da sua conta?"
        onConfirm={async () => await signOut()}
      />
    </LinearGradient>
  );
};

export default HomeHeader;
