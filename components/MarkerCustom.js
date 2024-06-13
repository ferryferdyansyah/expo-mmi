import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Marker } from "react-native-maps";

const MMIMarker = ({ coordinate, mmi }) => {
    return (
        <Marker coordinate={coordinate}>
            <View style={styles.marker}>
                <Text style={styles.markerText}>{mmi}</Text>
            </View>
        </Marker>
    );
};

const styles = StyleSheet.create({
    marker: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(0, 122, 255, 0.8)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "white",
    },
    markerText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 10,
    },
});

export default MMIMarker;
