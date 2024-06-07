import React, { useEffect, useRef, useState } from "react";

import {
  Button,
  PermissionsAndroid,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  View,
  ToastAndroid,
  Alert,
  Platform,
  TouchableHighlight,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import BottomSheetDialog from "../../components/lokasi";
import db from "@react-native-firebase/database";
import { uuidv4 } from "@firebase/util";
import { dataMMI } from "../../components/dropdown";
import EditText from "../../components/edittext";
import TextButton from "../../components/textbutton";
import { SelectList } from "react-native-dropdown-select-list";
import { Dropdown } from "react-native-element-dropdown";
import storage from "@react-native-firebase/storage";

import * as ImagePicker from "react-native-image-picker";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const formatTimestamp = (timestamp: string | number | Date) => {
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const formattedDate = `${day < 10 ? "0" + day : day}-${
    month < 10 ? "0" + month : month
  }-${year}`;
  const formattedTime = `${hours < 10 ? "0" + hours : hours}:${
    minutes < 10 ? "0" + minutes : minutes
  }:${seconds < 10 ? "0" + seconds : seconds}`;

  return `${formattedDate}, ${formattedTime}`;
};

const Input = () => {
  const [markerCoordinate, setMarkerCoordinate] = useState(null);
  const [, setCurrentLocation] = useState(null);
  const ref: any = useRef();
  const [location, setLocationButtonText] = useState("Lokasi");
  const [namaPengirim, setNamaPengirim] = useState("");
  const [tipeMMI, setTipeMMI] = useState("");
  const [image, setImage] = useState<any>("");

  const sendDatatoFirebase = async () => {
    if (tipeMMI && namaPengirim && location && markerCoordinate) {
      try {
        const timestamp = Date.now();
        const formattedTimestamp = formatTimestamp(timestamp);

        let imageURL = null;
        if (image) {
          console.log(image);
          const response = await fetch(image.assets[0].uri);
          const blob = await response.blob();
          const imageName = `${uuidv4()}.jpg`;
          const storageRef = storage().ref().child(`data/images/${imageName}`);
          await storageRef.put(blob);
          imageURL = await storageRef.getDownloadURL();
        }

        const data = {
          tipeMMI,
          namaPengirim,
          location,
          imageURL,
          coordinate: markerCoordinate,
          timestamp: formattedTimestamp, // Tambahkan properti timestamp
        };

        const response = await fetch(
          "https://react-native-mmi-app-default-rtdb.asia-southeast1.firebasedatabase.app/data.json?auth=IOf8J6OJbDvEv90XK0LLfscCfaAaFJPNcBRp8PPX",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        if (response.ok) {
          setTipeMMI("");
          setNamaPengirim("");
          setLocationButtonText("Lokasi");
          setImage(null);
          setMarkerCoordinate(null);
          Alert.alert("Sukses", "Data Berhasil Terkirim");
        } else {
          throw new Error("Gagal mengirim data ke API");
        }
      } catch (error) {
        console.error("Error sending data to API: ", error);
        Alert.alert("Gagal", "Data Gagal Terkirim");
      }
    } else {
      Alert.alert("Error", "Harap isi Data terlebih dahulu");
    }
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);

      if (
        granted["android.permission.ACCESS_FINE_LOCATION"] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted["android.permission.ACCESS_COARSE_LOCATION"] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        // console.log('Location permission granted');
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

  useEffect(() => {
    const checkPermission = async () => {
      const permissionGranted = await requestLocationPermission();
      if (permissionGranted) {
        await getCurrentLocation();
      } else {
        console.log("request permission not granted");
      }
    };
    checkPermission();
  }, []);

  const getCurrentLocation = async () => {
    const url = "http://ip-api.com/json/";

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("IP Data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching IP data:", error);
    }
  };

  // Contoh penggunaan fungsi
  getCurrentLocation().then((data) => {
    if (data) {
      // Lakukan sesuatu dengan data
      console.log("Kota:", data.city);
      console.log("Provinsi:", data.regionName);
      console.log("Negara:", data.country);
      console.log("Latitude:", data.lat);
      console.log("Longitude:", data.lon);
    }
  });

  const handleLocationSelect = (data: any) => {
    setLocationButtonText(
      data.province + " \n" + data.district + " \n" + data.subDistrict
    );
    console.log(data);
  };

  const handleLocationPress = () => {
    ref.current.open();
  };

  const handleMapPress = (event: any) => {
    const { coordinate } = event.nativeEvent;
    setMarkerCoordinate(coordinate);
  };

  const handlePhotoPress = React.useCallback((type: any, options: any) => {
    Alert.alert("Pilih", "Pilih Media untuk Mengambil Foto", [
      { text: "Batal", style: "cancel" },
      {
        text: "Camera",
        onPress: () => {
          ImagePicker.launchCamera(options, setImage);
        },
      },
      {
        text: "Gallery",
        onPress: () => {
          ImagePicker.launchImageLibrary(options, setImage);
        },
      },
    ]);
  }, []);

  const handleDeletePhoto = () => {
    setImage(null);
    ToastAndroid.show("Foto dihapus", ToastAndroid.SHORT);
  };

  const formattedDataMMI = dataMMI.map((item) => ({
    key: item.key,
    value: (
      <View>
        <View>
          <Text style={{ fontWeight: "bold", marginTop: 3, color: "black" }}>
            {item.value.split("-")[0]}
          </Text>
          <Text style={{ fontSize: 12, marginTop: 5 }}>
            {item.value.split("-")[1]}
          </Text>
          <Text style={{ fontSize: 12 }}>{item.value.split("-")[2]}</Text>
          {/* <Text style={{fontSize: 12}}>{item.value.split('-')[3]}</Text>
          <Text style={{fontSize: 12}}>{item.value.split('-')[4]}</Text>
          <Text style={{fontSize: 12}}>{item.value.split('-')[5]}</Text> */}
        </View>
      </View>
    ),
  }));

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          {/*Tipe MMI*/}
          <View style={[styles.elevatedCard]}>
            <Text style={styles.cardTitle}>Skala MMI</Text>
            <Text style={styles.cardSubtitle}>
              Pilih skala MMI sesuai dengan gempa yang Anda rasakan
            </Text>
            <View style={[styles.editText, {}]}>
              <SelectList
                inputStyles={styles.cardSubtitle}
                dropdownTextStyles={styles.cardSubtitle}
                dropdownItemStyles={{ marginTop: -10, height: "auto" }}
                // boxStyles={{backgroundColor:'pink',}}
                // dropdownStyles={{backgroundColor:'red'}}
                searchPlaceholder="Cari"
                placeholder="Skala MMI"
                setSelected={(val: any) => setTipeMMI(val)}
                data={formattedDataMMI}
                save="key"
              />
            </View>
          </View>

          {/*Data*/}
          <View style={[styles.elevatedCard]}>
            <Text style={styles.cardTitle}>Data</Text>
            <Text style={styles.cardSubtitle}>
              Masukkan data diri Anda serta foto setelah kejadian
            </Text>
            <EditText
              placeholder="Nama Pengirim"
              onChangeText={setNamaPengirim}
            />
            <TextButton text={location} onPress={handleLocationPress} />
            {actions.map(({ title, type, options }) => {
              if (title === "Select Image") {
                return (
                  <TextButton
                    key={title}
                    text="Pilih Foto (Opsional)"
                    onPress={() => handlePhotoPress(type, options)}
                  />
                );
              }
              return null; // Render nothing for other actions
            })}

            {image?.assets &&
              image?.assets.map(({ uri }: { uri: string }) => (
                <View>
                  <Image source={{ uri: uri }} style={styles.photo} />
                  <Button title="hapus" onPress={handleDeletePhoto} />
                </View>
              ))}
          </View>

          {/*BottomSheetDialog*/}
          <BottomSheetDialog onClose={handleLocationSelect} ref={ref} />

          {/*Atur Titik Akurat Lokasi*/}
          <View style={[styles.elevatedCard]}>
            <Text style={styles.cardTitle}>Atur Titik Akurat Lokasi</Text>
            <Text style={styles.cardSubtitle}>
              Pencet sekali untuk memilih lokasi
            </Text>

            <MapView
              style={styles.map}
              onPress={handleMapPress}
              provider={PROVIDER_GOOGLE}
              showsUserLocation={true}
              showsMyLocationButton={true}
              initialRegion={{
                latitude: -7.6760598,
                longitude: 110.7080488,
                latitudeDelta: 4.521,
                longitudeDelta: 4.231,
              }}
            >
              {markerCoordinate && (
                <Marker
                  coordinate={markerCoordinate}
                  title="Lokasi"
                  description="Lokasi yang dipilih"
                />
              )}
            </MapView>
          </View>

          <TouchableHighlight
            onPress={sendDatatoFirebase}
            style={styles.button}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Kirim Data
            </Text>
          </TouchableHighlight>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginStart: 20,
    marginEnd: 20,
    marginBottom: 40,
  },
  elevatedCard: {
    padding: 20,
    width: "auto",
    elevation: 2,
    marginTop: 20,
    borderRadius: 20,
    shadowColor: "#000000",
    backgroundColor: "#FFFFFF",
  },
  cardTitle: {
    color: "#2ccbef",
    fontSize: 18,
    fontWeight: "bold",
  },
  cardSubtitle: {
    color: "#000000",
    fontSize: 14,
  },
  editText: {
    marginTop: 20,
    // justifyContent: 'flex-end',
  },
  map: {
    marginTop: 20,
    height: 400,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#2ccbef",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 20,
  },
  photo: {
    width: "auto",
    height: 200,
    marginTop: 20,
  },
  // DROPDOWN ELEMENT
  dropdown: {
    margin: 16,
    height: 50,
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  // imageStyle: {
  //   width: 24,
  //   height: 24,
  // },
});

interface Action {
  title: string;
  type: "capture" | "library";
  options: ImagePicker.CameraOptions | ImagePicker.ImageLibraryOptions;
}

const actions: Action[] = [
  {
    title: "Take Image",
    type: "capture",
    options: {
      saveToPhotos: true,
      mediaType: "photo",
      includeBase64: false,
    },
  },
  {
    title: "Select Image",
    type: "library",
    options: {
      selectionLimit: 1,
      mediaType: "photo",
      saveToPhotos: true,
      includeBase64: false,
    },
  },
];

if (Platform.OS === "ios") {
  actions.push({
    title: "Take Image",
    type: "capture",
    options: {
      saveToPhotos: true,
      mediaType: "photo",
      presentationStyle: "fullScreen",
    },
  });
}

export default Input;
