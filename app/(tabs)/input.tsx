import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  PermissionsAndroid,
  Alert,
  ToastAndroid,
  TouchableOpacity,
  Image,
  Button,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as ImagePicker from "expo-image-picker";
import { Link, router } from "expo-router";
import TextButton from "../../components/textbutton";
import { db, storage } from "../../firebaseConfig";
import { ref as dbRef, push } from "firebase/database";
import { uuidv4 } from "@firebase/util";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import * as Location from "expo-location";

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

const NewDesign = () => {
  const [markerCoordinate, setMarkerCoordinate] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [currentRegion, setCurrentRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null);
  const ref: any = useRef();

  const [namaPengirim, setNamaPengirim] = useState("");
  const [tipeMMI, setTipeMMI] = useState("");
  const [image, setImage] = useState<any>("");

  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");

  const mmiValues = [
    "I MMI",
    "II MMI",
    "III MMI",
    "IV MMI",
    "V MMI",
    "VI MMI",
    "VII MMI",
    "VIII MMI",
    "IX MMI",
    "X MMI",
    "XI MMI",
    "XII MMI",
  ];

  const sendDatatoFirebase = async () => {
    if (!tipeMMI) {
      Alert.alert("Error", "Anda Belum Memilih Level MMI");
      return;
    }

    if (!markerCoordinate) {
      Alert.alert("Error", "Tekan Button Click Me Untuk Memberitahu Lokasi Spesifik Anda");
      return;
    }
    if (tipeMMI && markerCoordinate && city && province) {
      try {
        const timestamp = Date.now();
        const formattedTimestamp = formatTimestamp(timestamp);
        let imageURL = "(Tidak Diisi User)";

        if (image && image.assets && image.assets.length > 0) {
          const response = await fetch(image.assets[0].uri);
          const blob = await response.blob();
          const imageName = `${uuidv4()}.jpg`;
          const storageReference = storageRef(
            storage,
            `data/images/${imageName}`
          );
          await uploadBytes(storageReference, blob);
          imageURL = await getDownloadURL(storageReference);
        }

        await push(dbRef(db, "users"), {
          tipeMMI,
          namaPengirim: namaPengirim || "(Tidak Diisi User)",
          image: imageURL,
          coordinate: markerCoordinate,
          timestamp: formattedTimestamp,
          city,
          province,
        });
        ToastAndroid.show("Data Terkirim", ToastAndroid.SHORT);

        resetForm();
      } catch (error) {
        console.error("Error sending data to firebase: ", error);
        ToastAndroid.show("Gagal mengirim data", ToastAndroid.SHORT);
      }
    } else {
      console.error("Harap isi Data terlebih dahulu");
      ToastAndroid.show("Harap isi Data terlebih dahulu", ToastAndroid.SHORT);
    }
  };


  const resetForm = () => {
    setNamaPengirim("");
    setTipeMMI("");
    setImage(null);
    setMarkerCoordinate(null);
    setCurrentRegion(null);
    // Reset city and province if they should be cleared as well
    //    setCity("");
    //    setProvince("");
  };

  useEffect(() => {
    const checkPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Location permission not granted");
        return;
      }
      await getCurrentLocation();
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
      setCity(data.city);
      setProvince(data.regionName);
      return data;
    } catch (error) {
      console.error("Error fetching IP data:", error);
    }
  };

  const handleMapPress = (event: any) => {
    const { coordinate } = event.nativeEvent;
    setMarkerCoordinate(coordinate);
  };

  const handleMMIPress = (value: any) => {
    setTipeMMI(value);
  };

  const handlePhotoPress = async () => {
    Alert.alert(
      "Select Image",
      "Choose an option",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Camera",
          onPress: async () => {
            const { status } =
              await ImagePicker.requestCameraPermissionsAsync();
            if (status === "granted") {
              const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
              });
              if (!result.canceled) {
                setImage(result);
              }
            } else {
              Alert.alert("Camera permission denied");
            }
          },
        },
        {
          text: "Gallery",
          onPress: async () => {
            const { status } =
              await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status === "granted") {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
              });
              if (!result.canceled) {
                setImage(result);
              }
            } else {
              Alert.alert("Gallery permission denied");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleDeletePhoto = () => {
    setImage(null);
    ToastAndroid.show("Foto dihapus", ToastAndroid.SHORT);
  };

  const handleNamaPengirim = (text: any) => {
    setNamaPengirim(text);
  };

  const handleGetCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setMarkerCoordinate({ latitude, longitude });
      setCurrentRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      console.log("User location:", { latitude, longitude });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.textHeader}>Input Gempa Yang Anda Rasakan</Text>
        </View>
        <View style={styles.body}>
          {/* CARD SKALA MMI */}
          <View style={styles.containerMMI}>
            <Text style={styles.textTitle}>
              Pilih level MMI yang anda rasakan (Wajib)
            </Text>
            <Text style={styles.textNote}>
              *Sangat disarankan untuk membaca detail keterangan level mmi
            </Text>
            <View style={styles.cardLevelMMI}>
              {mmiValues.map((value, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.cardMMI,
                    {
                      backgroundColor: tipeMMI === value ? "#3354A5" : "white",
                    },
                  ]}
                  onPress={() => handleMMIPress(value)}
                >
                  <Text
                    style={[
                      styles.textCard,
                      { color: tipeMMI === value ? "#fff" : "#000" },
                    ]}
                  >
                    {value}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              onPress={() => router.push("/screens/mmi")}
              style={styles.button}
            >
              <Text style={styles.textBtn}>
                Lihat Detail Level MMI
              </Text>
            </TouchableOpacity>
          </View>
          {/* NAMA USER */}
          <View style={styles.containerMMI}>
            <Text style={styles.textTitle}>
              Masukkan Nama Anda (Opsional)
            </Text>
            <View style={styles.containerInput}>
              <TextInput
                placeholder="Masukkan Nama"
                value={namaPengirim}
                onChangeText={handleNamaPengirim}
                style={{
                  backgroundColor: "white",
                  borderRadius: 10,
                  padding: 10,
                }}
              />
            </View>
          </View>

          {/* AUTOMATE LOCATION */}
          <View style={styles.containerMMI}>
            <Text style={styles.textTitle}>
              Lokasi Anda (Otomatis Terisi)
            </Text>
            <View style={[styles.containerInput,{height: 50, justifyContent: "center",}]}>
              <Text style={[styles.deadText, {marginLeft:10}]}>
                {city}, {province}
              </Text>
            </View>
          </View>

          {/* PILIH FOTO */}
          <View style={styles.containerMMI}>
            <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 13 }}>
              Masukkan Foto Kejadian (Opsional)
            </Text>
            {actions.map(({ title, type, options }) => {
              if (title === "Select Image") {
                return (
                  <TextButton
                    key={title}
                    text="Pilih Foto Disini"
                    onPress={() => handlePhotoPress()}
                  />
                );
              }
              return null;
            })}

            {image?.assets ? (
              image.assets.map(({ uri }: { uri: string }) => (
                <View key={uri}>
                  <Image
                    source={{ uri: uri }}
                    style={styles.image}
                  />
                  <Button title="hapus" onPress={handleDeletePhoto} />
                </View>
              ))
            ) : (
              <View style={styles.addImage}>
                <Text style={styles.deadText}>
                  Tidak Ada Gambar Yang Dipilih
                </Text>
              </View>
            )}
          </View>

          {/* MAP VIEW */}
          <View
            style={styles.containerMMI}
          >
            <Text style={styles.textTitle}>
              Masukkan Lokasi Terkini Anda (Wajib)
            </Text>
            <Text style={styles.textNote}>
              *Tekan Tombol (Click Me) Dibawah Untuk Menuju Lokasi Anda
            </Text>
            <TouchableOpacity
              onPress={handleGetCurrentLocation}
              style={[styles.button, {marginTop:'2%', width:'30%'}]}
            >
              <Text style={styles.textBtn}>
                Click Me
              </Text>
            </TouchableOpacity>
            <MapView
              style={{ marginTop: 10, height: 300 }}
              // onPress={handleMapPress}
              provider={PROVIDER_GOOGLE}
              showsUserLocation={true}
              showsMyLocationButton={true}
              initialRegion={{
                latitude: -7.6760598,
                longitude: 110.7080488,
                latitudeDelta: 4.521,
                longitudeDelta: 4.231,
              }}
              region={currentRegion || undefined}
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

          {/* BUTTON SEND DATA TO FIREBASE */}
          <TouchableOpacity
            onPress={sendDatatoFirebase}
            style={styles.btnSubmit}
          >
            <Text style={{ color: "white", fontFamily: "Poppins-SemiBold" }}>
              Kirim Data
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewDesign;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    backgroundColor: "#3354A5",
    height: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  textHeader: {
    color: "white",
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    marginTop: "-10%",
  },

  body: {
    marginTop: "-15%",
    backgroundColor: "white",
    marginHorizontal: "2.5%",
    borderRadius: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: 1600,
  },
  // STYLE CARD MMI
  containerMMI: {
    marginTop: "5%",
    marginLeft: "5%",
    marginRight: "5%",
  },
  textTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 13,
  },
  textNote: {
    fontFamily: "Poppins-Medium",
    fontSize: 12,
  },
  cardLevelMMI: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardMMI: {
    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: "30%",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textCard: {
    fontFamily: "Poppins-Medium",
    fontSize: 12,
  },
  button: {
    marginTop: "5%",
    backgroundColor: "#3354A5",
    padding: 10,
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  textBtn: {
    color: "white",
    textAlign: "center",
    fontFamily: "Poppins-Medium",
    fontSize: 12,
  },
  containerInput: {
    borderRadius: 5,
    padding: 5,
    marginTop: "2%",
    borderColor: "#e8e8e8",
    borderWidth: 1,
  },
  image: {
    width: "100%",
    height: 200,
    marginTop: 20,
  },
  addImage: {
    width: "100%",
    height: 230,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  deadText: {
    fontFamily: "Poppins-Medium",
    fontSize: 13,
    color: "gray",
  },
  btnSubmit: {
    backgroundColor: "#3354A5",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: "5%",
    marginTop: "5%",
  },
});

const actions = [
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
