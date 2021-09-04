import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PlayList from "../screen/PlayList";
import AudioList from "../screen/AudioList";
import Player from "../screen/Player";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import color from "../misc/color";

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: color.APP_BG,
  },
};

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer theme={MyTheme}>
      <Tab.Navigator>
        <Tab.Screen
          name="AudioList"
          component={AudioList}
          options={{
            tabBarIcon: ({ color, size }) => {
              return <MaterialIcons name="headset" size={size} color={color} />;
            },
          }}
        />
        <Tab.Screen
          name="Player"
          component={Player}
          options={{
            tabBarIcon: ({ color, size }) => {
              return (
                <FontAwesome5 name="compact-disc" size={size} color={color} />
              );
            },
          }}
        />
        <Tab.Screen
          name="PlayList"
          component={PlayList}
          options={{
            tabBarIcon: ({ color, size }) => {
              return (
                <MaterialIcons name="library-music" size={size} color={color} />
              );
            },
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
