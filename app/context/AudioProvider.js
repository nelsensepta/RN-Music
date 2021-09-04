import React, { Component, createContext } from "react";
import { Text, View, Alert } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { DataProvider } from "recyclerlistview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import { playNext } from "../misc/AudioController";
import { storeAudioForNextOpening } from "../misc/helper";

export const AudioContext = createContext();

export class AudioProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audioFiles: [],
      playList: [],
      addToPlayList: null,
      permissionError: false,
      dataProvider: new DataProvider((r1, r2) => r1 !== r2),
      playbackObj: null,
      soundObj: null,
      currentAudio: {},
      isPlaying: false,
      currentAudioIndex: null,
      playbackPosition: null,
      playbackDuration: null,
    };
    this.totalAudioCount = 0;
  }

  permissionAlert = () => {
    Alert.alert("Permission Required", "akses lh cok", [
      {
        text: "Mantap cok Lanjutkan",
        onPress: () => this.getPermission(),
      },
      {
        text: "Payah Nt Malah Cancle",
        onPress: () => this.permissionAlert(),
      },
    ]);
  };

  getAudioFiles = async () => {
    const { dataProvider, audioFiles } = this.state;
    let media = await MediaLibrary.getAssetsAsync({
      mediaType: "audio",
    });
    media = await MediaLibrary.getAssetsAsync({
      mediaType: "audio",
      first: media.totalCount,
    });
    this.totalAudioCount = media.totalCount;
    this.setState({
      ...this.state,
      dataProvider: dataProvider.cloneWithRows([
        ...audioFiles,
        ...media.assets,
      ]),
      audioFiles: [...audioFiles, ...media.assets],
    });
  };

  loadPreviousAudio = async () => {
    // load async Stroge
    let previousAudio = await AsyncStorage.getItem("previousAudio");
    let currentAudio;
    let currentAudioIndex;

    if (previousAudio === null) {
      currentAudio = this.state.audioFiles[0];
      currentAudioIndex = 0;
    } else {
      previousAudio = JSON.parse(previousAudio);
      currentAudio = previousAudio.audio;
      currentAudioIndex = previousAudio.index;
    }

    this.setState({ ...this.state, currentAudio, currentAudioIndex });
  };

  getPermission = async () => {
    // canAskAgain: true
    // expires: "never"
    // granted: false
    // status: "undetermined"
    const permission = await MediaLibrary.getPermissionsAsync();

    if (permission.granted) {
      this.getAudioFiles();
    }
    if (!permission.granted && permission.canAskAgain) {
      const {
        status,
        canAskAgain,
      } = await MediaLibrary.requestPermissionsAsync();
      if (status === "denied" && canAskAgain) {
        this.permissionAlert();
      }
      if (status === "granted") {
        this.getPermission();
      }
      if (status === "denied" && !canAskAgain) {
        // we want to Display some error to the user
        this.setState({ ...this.state, permissionError: true });
      }
    }
  };

  onPlaybackStatusUpdate = async (playbackStatus) => {
    if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
      this.updateState(this, {
        playbackPosition: playbackStatus.positionMillis,
        playbackDuration: playbackStatus.durationMillis,
      });
    }
    if (playbackStatus.didJustFinish) {
      const nextAudioIndex = this.state.currentAudioIndex + 1;

      // handle jika Audio sudah sampai index terakhir
      if (nextAudioIndex >= this.totalAudioCount) {
        this.state.playbackObj.unloadAsync();
        this.updateState(this, {
          soundObj: null,
          currentAudio: this.state.audioFiles[0],
          isPlaying: false,
          currentAudioIndex: 0,
          playbackPosition: null,
          playbackDuration: null,
        });
        return await storeAudioForNextOpening(this.state.audioFiles[0], 0);
      }
      const audio = this.state.audioFiles[nextAudioIndex];
      const status = await playNext(this.state.playbackObj, audio.uri);
      this.updateState(this, {
        soundObj: status,
        currentAudio: audio,
        isPlaying: true,
        currentAudioIndex: nextAudioIndex,
      });
      await storeAudioForNextOpening(audio, nextAudioIndex);
    }
  };

  componentDidMount() {
    this.getPermission();
    if (this.state.playbackObj === null) {
      this.setState({ ...this.state, playbackObj: new Audio.Sound() });
    }
  }

  // function
  updateState = (prevState, newState = {}) => {
    this.setState({ ...prevState, ...newState });
  };
  render() {
    const {
      audioFiles,
      playList,
      addToPlayList,
      dataProvider,
      permissionError,
      playbackObj,
      soundObj,
      isPlaying,
      currentAudio,
      currentAudioIndex,
      playbackPosition,
      playbackDuration,
    } = this.state;
    if (permissionError)
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 20, textAlign: "center" }}>
            Cok Accept lah eben aplikasine jalan
          </Text>
        </View>
      );
    return (
      <AudioContext.Provider
        value={{
          audioFiles,
          playList,
          addToPlayList,
          dataProvider,
          playbackObj,
          soundObj,
          isPlaying,
          currentAudio,
          currentAudioIndex,
          updateState: this.updateState,
          totalAudioCount: this.totalAudioCount,
          loadPreviousAudio: this.loadPreviousAudio,
          onPlaybackStatusUpdate: this.onPlaybackStatusUpdate,
          playbackPosition,
          playbackDuration,
        }}
      >
        {this.props.children}
      </AudioContext.Provider>
    );
  }
}

export default AudioProvider;
