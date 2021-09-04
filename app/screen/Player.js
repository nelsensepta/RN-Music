import React, { useContext, useEffect } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import color from "../misc/color";
import Screen from "../components/Screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import PlayerButton from "../components/PlayerButton";
import { AudioContext } from "../context/AudioProvider";
import { play, pause, resume, playNext } from "../misc/AudioController";
import { storeAudioForNextOpening } from "../misc/helper";

const { width } = Dimensions.get("window");
const Player = () => {
  // context function component
  const context = useContext(AudioContext);
  const { playbackPosition, playbackDuration } = context;
  const calculateSeebBar = () => {
    if (playbackPosition !== null && playbackPosition !== null) {
      return playbackPosition / playbackDuration;
    }
    return 0;
  };

  // handle jika tidak ada lagu yang di Play
  useEffect(() => {
    context.loadPreviousAudio();
  }, []);
  if (!context.currentAudio) return null;

  // handle Play Pause button
  const handlePlayPause = async () => {
    // play
    if (context.soundObj === null) {
      const audio = context.currentAudio;
      const status = await play(context.playbackObj, audio.uri);
      context.playbackObj.setOnPlaybackStatusUpdate(
        context.onPlaybackStatusUpdate
      );
      return context.updateState(context, {
        soundObj: status,
        currentAudio: audio,
        isPlaying: true,
        currentAudioIndex: context.currentAudioIndex,
      });
    }

    // pause
    if (context.soundObj && context.soundObj.isPlaying) {
      const status = await pause(context.playbackObj);
      return context.updateState(context, {
        soundObj: status,
        isPlaying: false,
      });
    }

    //resume
    if (context.soundObj && !context.soundObj.isPlaying) {
      const status = await resume(context.playbackObj);
      return context.updateState(context, {
        soundObj: status,
        isPlaying: true,
      });
    }
  };

  // handle next audio
  const handleNext = async () => {
    const { isLoaded } = await context.playbackObj.getStatusAsync();
    const isLastAudio =
      context.currentAudioIndex + 1 === context.totalAudioCount;
    let audio = context.audioFiles[context.currentAudioIndex + 1];

    let index;
    let status;

    // play
    if (!isLoaded && !isLastAudio) {
      index = context.currentAudioIndex + 1;
      status = await play(context.playbackObj, audio.uri);
    }
    // Next
    if (isLoaded && !isLastAudio) {
      index = context.currentAudioIndex + 1;
      status = await playNext(context.playbackObj, audio.uri);
    }

    // isLast Audio
    if (isLastAudio) {
      (index = 0), (audio = context.audioFiles[index]);

      if (isLoaded) {
        status = await playNext(context.playbackObj, audio.uri);
      } else {
        status = await play(context.playbackObj, audio.uri);
      }
    }

    context.updateState(context, {
      currentAudio: audio,
      playbackObj: context.playbackObj,
      soundObj: status,
      isPlaying: true,
      currentAudioIndex: index,
      playbackPosition: null,
      playbackDuration: null,
    });
    return storeAudioForNextOpening(audio, index);
  };

  // handle Previous
  const handlePrevious = async () => {
    const { isLoaded } = await context.playbackObj.getStatusAsync();
    const isFirstAudio = context.currentAudioIndex <= 0;
    let audio = context.audioFiles[context.currentAudioIndex - 1];

    let index;
    let status;

    // play
    if (!isLoaded && !isFirstAudio) {
      index = context.currentAudioIndex - 1;
      status = await play(context.playbackObj, audio.uri);
    }
    // Next
    if (isLoaded && !isFirstAudio) {
      index = context.currentAudioIndex - 1;
      status = await playNext(context.playbackObj, audio.uri);
    }

    // isFirst Audio
    if (isFirstAudio) {
      (index = context.totalAudioCount - 1), // index mulai dari 0
        (audio = context.audioFiles[index]);

      if (isLoaded) {
        status = await playNext(context.playbackObj, audio.uri);
      } else {
        status = await play(context.playbackObj, audio.uri);
      }
    }

    context.updateState(context, {
      currentAudio: audio,
      playbackObj: context.playbackObj,
      soundObj: status,
      isPlaying: true,
      currentAudioIndex: index,
      playbackPosition: null,
      playbackDuration: null,
    });
    return storeAudioForNextOpening(audio, index);
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.audioCount}>{`${context.currentAudioIndex + 1}/ ${
          context.totalAudioCount
        }`}</Text>
        <View style={styles.midBannerContainer}>
          <MaterialCommunityIcons
            name="music-circle"
            size={300}
            color={context.isPlaying ? color.ACTIVE_BG : color.FONT_MEDIUM}
          />
        </View>
        <View style={styles.audioPlayerContainer}>
          <Text numberOfLines={1} style={styles.audioTitle}>
            {context.currentAudio.filename}
          </Text>
          <Slider
            style={{ width: width, height: 40 }}
            minimumValue={0}
            maximumValue={1}
            value={calculateSeebBar()}
            minimumTrackTintColor={color.FONT_MEDIUM}
            maximumTrackTintColor={color.ACTIVE_BG}
          />
          <View style={styles.audioControllers}>
            <PlayerButton iconType="PREV" onPress={handlePrevious} />
            <PlayerButton
              style={{ marginHorizontal: 25 }}
              iconType={context.isPlaying ? "PLAY" : "PAUSE"}
              onPress={handlePlayPause}
            />
            <PlayerButton iconType="NEXT" onPress={handleNext} />
          </View>
        </View>
      </View>
    </Screen>
  );
};

export default Player;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  audioCount: {
    textAlign: "right",
    padding: 15,
    color: color.FONT_LIGHT,
    fontSize: 14,
  },
  midBannerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  audioTitle: {
    fontSize: 16,
    color: color.FONT,
    padding: 15,
  },
  audioControllers: {
    width,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
});
