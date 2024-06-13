import React from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

interface TextButtonProps {
  text: string;
  onPress: () => void;
}

class TextButton extends React.Component<TextButtonProps> {
  render() {
    const { text, onPress } = this.props;
    return (
      <SafeAreaView>
        <TouchableOpacity style={styles.container} onPress={onPress}>
          <Text style={styles.input}>{text}</Text>
          <MaterialCommunityIcons
            name="menu-right"
            style={styles.endDrawable}
          />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: '2%',
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 5,
  },
  input: {
    color: "#000000",
    flex: 1,
    padding: 15,
  },
  endDrawable: {
    marginRight: 15,
    fontSize: 20,
    color: "#888",
  },
});

export default TextButton;
