// Play Audio
export const play = async (playbackObj, uri) => {
  try {
    return await playbackObj.loadAsync({ uri }, { shouldPlay: true });
  } catch (error) {
    console.log("Lagune Rak bisa diplay cok", error.message);
  }
};

// Pause Audio
export const pause = async (playbackObj) => {
  try {
    return await playbackObj.setStatusAsync({
      shouldPlay: false,
    });
  } catch (error) {
    console.log("Lagune Rak bisa dipuase cok", error.message);
  }
};

// Resume Audio
export const resume = async (playbackObj) => {
  try {
    return await playbackObj.playAsync();
  } catch (error) {
    console.log("Lagune Rak bisa diputer ulang  cok", error.message);
  }
};

// Select Another Audio
export const playNext = async (playbackObj, uri) => {
  try {
    await playbackObj.stopAsync();
    await playbackObj.unloadAsync();
    return await play(playbackObj, uri);
  } catch (error) {
    console.log("Rak Bisa dilanjut Lur LAgune", error.message);
  }
};
