import { Platform } from "react-native";
import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from "@react-navigation/bottom-tabs";
import { gluestackUIConfig } from "../../config/gluestack-ui.config";

import { House, PlusSquare, UserCircle } from "phosphor-react-native";

import Home from "@/screens/Home";
import Profile from "@/screens/Profile";

import NewOccurrence from "@/screens/NewOccurrence";
import Occurrence from "@/screens/Occurrence";
import { OccurrenceContextProvider } from "@/contexts/OccurrenceContext";
import { PhotoContextProvider } from "@/contexts/PhotoContext";

type AppRoutes = {
  home: undefined;
  newOccurrence: undefined;
  profile: undefined;
  occurrence: { occurrenceId: string };
};

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>;

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>();

export function AppRoutes() {
  const iconSize = 24;
  const { tokens } = gluestackUIConfig;

  return (
    <PhotoContextProvider>
      <OccurrenceContextProvider>
        <Navigator
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarActiveTintColor: tokens.colors.brandLight,
            tabBarInactiveTintColor: tokens.colors.gray400,
            tabBarStyle: {
              backgroundColor: tokens.colors.white,
              borderTopWidth: 0,
              height: Platform.OS === "android" ? "auto" : 96,
              paddingBottom: 40,
              paddingTop: 24,
            },
          }}
        >
          <Screen
            name="home"
            component={Home}
            options={{
              tabBarIcon: ({ color }) => (
                <House color={color} size={iconSize} />
              ),
            }}
          />

          <Screen
            name="newOccurrence"
            component={NewOccurrence}
            options={{
              tabBarIcon: ({ color }) => (
                <PlusSquare color={color} size={iconSize} />
              ),
            }}
          />

          <Screen
            name="profile"
            component={Profile}
            options={{
              tabBarIcon: ({ color }) => (
                <UserCircle color={color} size={iconSize} />
              ),
            }}
          />

          <Screen
            name="occurrence"
            component={Occurrence}
            options={{ tabBarButton: () => null }}
          />
        </Navigator>
      </OccurrenceContextProvider>
    </PhotoContextProvider>
  );
}
