import React from "react";
import { SafeAreaView, StyleSheet, TextInput, View } from "react-native";

class EditText extends React.Component<{
  placeholder: any;
  onChangeText: any;
}> {
  render() {
    let { placeholder, onChangeText } = this.props;
    return (
      <SafeAreaView>
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#888"
            onChangeText={onChangeText}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
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

export default EditText;
