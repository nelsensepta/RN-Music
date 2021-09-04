import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  StatusBar,
  TouchableWithoutFeedback,
} from "react-native";
import color from "../misc/color";

const OptionModal = ({
  visible,
  onClose,
  currentItem,
  onPlayPress,
  onPlatListPress,
}) => {
  const { filename } = currentItem;
  return (
    <>
      <StatusBar hidden={true} />
      <Modal
        animationType="slide"
        transparent
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modal}>
          <Text style={styles.title} numberOfLines={2}>
            {filename}
          </Text>
          <View style={styles.optionContainer}>
            <TouchableWithoutFeedback onPress={onPlayPress}>
              <Text style={styles.option}>Play</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={onPlatListPress}>
              <Text style={styles.option}>Add to PlayList</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.modalBG} />
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default OptionModal;

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: color.APP_BG,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    zIndex: 1000,
  },
  optionContainer: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 20,
    paddingBottom: 0,
    color: color.FONT_MEDIUM,
  },
  option: {
    fontSize: 16,
    fontWeight: "bold",
    color: color.FONT,
    paddingVertical: 10,
    letterSpacing: 1,
  },
  modalBG: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: color.MODAL_BG,
    zIndex: -1,
  },
});
