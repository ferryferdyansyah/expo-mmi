import React, { useEffect, useState } from "react";
import { View, StyleSheet, PermissionsAndroid, Alert } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

const API_URL =
  "https://react-native-mmi-app-default-rtdb.asia-southeast1.firebasedatabase.app/data.json?auth=IOf8J6OJbDvEv90XK0LLfscCfaAaFJPNcBRp8PPX";

const Maps = () => {
  const [markers, setMarkers] = useState([]);
  const [initialRegion, setInitialRegion] = useState({
    latitude: -7.6760598,
    longitude: 110.7080488,
    latitudeDelta: 4,
    longitudeDelta: 4,
  });

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);

      return (
        granted["android.permission.ACCESS_FINE_LOCATION"] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted["android.permission.ACCESS_COARSE_LOCATION"] ===
          PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const fetchMarkers = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      const markersArray = Object.entries(data).map(([key, value]) => ({
        id: key,
        coordinate: value.coordinate,
        tipeMMI: value.tipeMMI,
        namaPengirim: value.namaPengirim,
        location: value.location,
        imageURL: value.image,
      }));

      setMarkers(markersArray);
    } catch (error) {
      console.error("Error fetching marker data: ", error);
      Alert.alert("Error", "Failed to fetch marker data");
    }
  };

  useEffect(() => {
    const initialize = async () => {
      const permissionGranted = await requestLocationPermission();
      if (permissionGranted) {
        fetchMarkers();
      } else {
        Alert.alert(
          "Permission denied",
          "Location permission is required to show markers."
        );
      }
    };

    initialize();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={true}
        initialRegion={initialRegion}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.coordinate.latitude,
              longitude: marker.coordinate.longitude,
            }}
            title={marker.tipeMMI}
            description={marker.namaPengirim}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default Maps;
