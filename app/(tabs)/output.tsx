import React, { useEffect, useState } from "react";

import {
  View,
  StyleSheet,
  PermissionsAndroid,
  SafeAreaView,
  Text,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { db } from "../../firebaseConfig";
import { ref, onValue } from "firebase/database";
import MarkerCustom from "../../components/MarkerCustom";

interface MarkerData {
  id: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  tipeMMI: string;
  namaPengirim: string;
  location: string;
  imageURL: string;
}

const Maps = () => {
  const [markers, setMarkers] = useState < MarkerData[] > ([]);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      ]);

      if (
        granted["android.permission.ACCESS_FINE_LOCATION"] ===
        PermissionsAndroid.RESULTS.GRANTED &&
        granted["android.permission.ACCESS_COARSE_LOCATION"] ===
        PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log("Location permission granted");
        return true;
      } else {
        console.log("Location permission denied");
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const getLocation = async () => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyChTv4I5oaxL-wnJl5FqFP5kJVah5XDoxs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      await response.json();
    } catch (error) {
      console.error("Error getting current location: ", error);
    }
  };

  useEffect(() => {
    const dataRef = ref(db, "users");
    const unsubscribe = onValue(dataRef, (snapshot) => {
      try {
        const data = snapshot.val();
        const markersArray = Object.entries(data).map(
          ([key, value]: [string, any]) => ({
            id: key,
            coordinate: value.coordinate,
            tipeMMI: value.tipeMMI,
            namaPengirim: value.namaPengirim,
            location: value.location,
            imageURL: value.imageURL,
          })
        );
        setMarkers(markersArray);
      } catch (error) {
        console.error("Error fetching marker data:", error);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkPermission = async () => {
      const permissionGranted = await requestLocationPermission();
      if (permissionGranted) {
        getLocation();
      } else {
        console.log("request permission not granted");
      }
    };
    checkPermission();
  }, []);

  return (
    <View style={styles.container}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          initialRegion={{
            latitude: -7.7753128,
            longitude: 110.370384,
            latitudeDelta: 4.521,
            longitudeDelta: 4.521,
          }}
        >
          {markers.map((marker) => (
            <MarkerCustom
              key={marker.id}
              coordinate={{
                latitude: marker.coordinate.latitude,
                longitude: marker.coordinate.longitude,
              }}
              mmi={marker.tipeMMI}
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
