import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { AudioContext } from "../context/AudioProvider";
import PlayListInputModal from "../components/PlayListInputModal";
import color from "../misc/color";
import PlayListDetail from "../components/PlayListDetail";

let selectedPlayList = {};
const PlayList = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [showPlayList, setShowPlayList] = useState(false);

  const context = useContext(AudioContext);
  const { playList, addToPlayList, updateState } = context;

  const createPlayList = async (playListName) => {
    const result = await AsyncStorage.getItem("playlist");
    if (result !== null) {
      const audios = [];
      if (addToPlayList) {
        audios.push(addToPlayList);
      }
      const newList = {
        id: Date.now(),
        title: playListName,
        audios: audios,
      };
      const updateList = [...playList, newList];

      updateState(context, { addToPlayList: null, playList: updateList });
      await AsyncStorage.setItem("playlist", JSON.stringify(updateList));
    }
    setModalVisible(false);
  };

  const renderPlayList = async () => {
    const result = await AsyncStorage.getItem("playlist");
    if (result === null) {
      const defaultPlatList = {
        id: Date.now(),
        title: "My Favorite",
        audios: [],
      };
      const newPlayList = [...playList, defaultPlatList];
      updateState(context, { playList: [...newPlayList] });
      return await AsyncStorage.setItem(
        "playlist",
        JSON.stringify([...newPlayList])
      );
    }
    updateState(context, { playList: JSON.parse(result) });
  };

  useEffect(() => {
    if (!playList.length) {
      renderPlayList();
    }
  }, []);

  const handleBannerPress = async (playList) => {
    if (addToPlayList) {
      const result = await AsyncStorage.getItem("playlist");

      let oldList = [];
      let updateList = [];
      let sameAudio = false;

      if (result !== null) {
        oldList = JSON.parse(result);
        updateList = oldList.filter((list) => {
          if (list.id === playList.id) {
            for (let audio of list.audios) {
              if (audio.id === addToPlayList.id) {
                sameAudio = true;
                return;
              }
            }
            // update PlayList / menambahkan Audio Ke Playlist
            list.audios = [...list.audios, addToPlayList];
          }
          return list;
        });
      }
      if (sameAudio) {
        Alert.alert(
          "Lagu Tersebut sudah ada DiplayList ini",
          `${addToPlayList.filename} silakan pilih lagu lain`
        );
        sameAudio = false;
        return updateState(context, { addToPlayList: null });
      }
      updateState(context, { addToPlayList: null, playList: [...updateList] });
      return AsyncStorage.setItem("playlist", JSON.stringify([...updateList]));
    }

    selectedPlayList = playList;
    setShowPlayList(true);
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        {playList.length
          ? playList.map((item) => {
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.playListBanner}
                  onPress={() => handleBannerPress(item)}
                >
                  <Text>{item.title}</Text>
                  <Text style={styles.audioCount}>
                    {item.audios.length > 1
                      ? // lagu lebih dari satu
                        `${item.audios.length} lagu`
                      : `${item.audios.length} lagu`}
                  </Text>
                </TouchableOpacity>
              );
            })
          : null}
        <TouchableOpacity
          style={{ marginTop: 15 }}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.playListBtn}>+ Add New PlayList</Text>
        </TouchableOpacity>
        <PlayListInputModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSubmit={createPlayList}
        />
      </ScrollView>
      <PlayListDetail
        visible={showPlayList}
        playList={selectedPlayList}
        onClose={() => setShowPlayList(false)}
      />
    </>
  );
};

export default PlayList;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  playListBanner: {
    padding: 5,
    backgroundColor: "rgba(204,204,204, 0.3)",
    borderRadius: 5,
    marginBottom: 15,
  },
  audioCount: {
    marginTop: 3,
    opacity: 0.5,
    fontSize: 14,
  },
  playListBtn: {
    color: color.ACTIVE_BG,
    letterSpacing: 1,
    fontWeight: "bold",
    fontSize: 14,
    padding: 5,
  },
});
