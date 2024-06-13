import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { db } from "../../firebaseConfig";
import { ref, onValue, off } from "firebase/database";

// Define the type for the data structure
interface Coordinate {
  latitude: number;
  longitude: number;
}

interface LatestData {
  dirasakan: string;
  coordinate: Coordinate;
  foto: string;
  deskripsi: string;
}

const Peta: React.FC = () => {
  const [latestData, setLatestData] = useState<LatestData | null>(null);

  useEffect(() => {
    const reference = ref(db, "/admin");
    const unsubscribe = onValue(reference, (snapshot) => {
      const rawData = snapshot.val();
      if (rawData) {
        const latestKey = Object.keys(rawData).sort().reverse()[0];
        const latestEntry = rawData[latestKey];
        setLatestData(latestEntry);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      off(reference); // Correct way to remove the listener
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Peta</Text> */}
      {latestData ? (
        <View>
          {latestData.foto ? (
            <Image style={styles.image} source={{ uri: latestData.foto }} />
          ) : (
            <View style={{justifyContent: "center", height:'40%', alignItems: "center", backgroundColor: "#fff", borderColor: "#ccc", borderWidth: 1 }}>
              <Text style={styles.noImageText}>
                Belum ada gambar yang diinput
              </Text>
            </View>
          )}
          <Text style={styles.text}>{latestData.deskripsi}</Text>
        </View>
      ) : (
        <Text style={styles.loadingText}>Memuat data...</Text>
      )}
    </View>
  );
};

export default Peta;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontFamily: "Poppins-SemiBold",
  },
  noImageText: {
    fontSize: 16,
    marginTop: 10,
    fontFamily: "Poppins-Medium",
    textAlign: "center",
    color: "gray",
  },
  image: {
    height: 200,
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    marginTop: 10,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "gray",
    fontFamily: "Poppins-Medium",
  },
});
