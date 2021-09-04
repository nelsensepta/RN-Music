import { StatusBar } from "expo-status-bar";
import React from "react";
import AudioProvider from "./app/context/AudioProvider";
import AppNavigator from "./app/navigation/AppNavigator";

export default function App() {
  return (
    <AudioProvider>
      <AppNavigator />
    </AudioProvider>
  );
  // return (
  //   <View style={{ marginTop: 100 }}>
  //     <AudioListItem />
  //     <AudioListItem />
  //     <AudioListItem />
  //     <AudioListItem />
  //   </View>
  // );

  // Episode 16 Menit 06.29
}
