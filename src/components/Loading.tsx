import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import tw from "twrnc";

const Loading = ({ loading }: { loading: boolean }) => (
  <Modal isVisible={loading} backdropOpacity={0.5}>
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Loading;
