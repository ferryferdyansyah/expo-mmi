import React, { forwardRef, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";

interface BottomSheetProps {
  onClose: (
    data: { province: String; district: String; subDistrict: String } | null
  ) => void;
}

interface ListItem {
  id: string;
  name: string;
}

const BottomSheetDialog = forwardRef(
  ({ onClose }: BottomSheetProps, ref: any) => {
    const [selectedProvince, setSelectedProvince] = useState<ListItem | null>(
      null
    );
    const [selectedDistrict, setSelectedDistrict] = useState<ListItem | null>(
      null
    );
    const [selectedSubDistrict, setSelectedSubDistrict] =
      useState<ListItem | null>(null);
    const [provinces, setProvinces] = useState<ListItem[]>([]);
    const [districts, setDistricts] = useState<ListItem[]>([]);
    const [subDistricts, setSubDistricts] = useState<ListItem[]>([]);

    useEffect(() => {
      fetch(
        "https://api.binderbyte.com/wilayah/provinsi?api_key=8fed28dfcba7efbfc89a69d7c9d87c54afa2c40333401ddb85c3fcc9f08772dd"
      )
        .then((response) => response.json())
        .then((data) => {
          const filteredProvinces = data.value.filter((province: ListItem) =>
            ["33", "34", "35"].includes(province.id)
          );
          setProvinces(filteredProvinces);
        })
        .catch((error) => console.error("Error fetching provinces:", error));
    }, []);

    useEffect(() => {
      if (selectedProvince) {
        fetch(
          `https://api.binderbyte.com/wilayah/kabupaten?api_key=8fed28dfcba7efbfc89a69d7c9d87c54afa2c40333401ddb85c3fcc9f08772dd&id_provinsi=${selectedProvince.id}`
        )
          .then((response) => response.json())
          .then((data) => setDistricts(data.value))
          .catch((error) => console.error("Error fetching districts:", error));
      }
    }, [selectedProvince]);

    useEffect(() => {
      if (selectedDistrict) {
        fetch(
          `https://api.binderbyte.com/wilayah/kecamatan?api_key=8fed28dfcba7efbfc89a69d7c9d87c54afa2c40333401ddb85c3fcc9f08772dd&id_kabupaten=${selectedDistrict.id}`
        )
          .then((response) => response.json())
          .then((data) => setSubDistricts(data.value))
          .catch((error) =>
            console.error("Error fetching sub-districts:", error)
          );
      }
    }, [selectedDistrict]);

    const resetSelection = () => {
      setSelectedProvince(null);
      setSelectedDistrict(null);
      setSelectedSubDistrict(null);
      setDistricts([]);
      setSubDistricts([]);
    };
    const handleSubDistrictSelect = (subDistrict: ListItem) => {
      setSelectedSubDistrict(subDistrict);
      if (selectedProvince && selectedDistrict) {
        const data = {
          province: selectedProvince.name,
          district: selectedDistrict.name,
          subDistrict: subDistrict.name,
        };
        onClose(data);
        ref.current.close();

        resetSelection();
      }
    };

    const renderListItem = ({
      item,
      onPress,
    }: {
      item: ListItem;
      onPress: () => void;
    }) => (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.item}>
          <Text style={styles.textlist}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );

    return (
      <RBSheet ref={ref} draggable={true} height={600}>
        {!selectedProvince && (
          <View style={styles.container}>
            <Text style={styles.TitleText}>Pilih Provinsi.</Text>
            <FlatList
              data={provinces}
              renderItem={({ item }) =>
                renderListItem({
                  item,
                  onPress: () => setSelectedProvince(item),
                })
              }
              keyExtractor={(item) => item.id.toString()}
            />
          </View>
        )}

        {selectedProvince && !selectedDistrict && (
          <View style={styles.container}>
            <Text style={styles.TitleText}>Pilih Kabupaten.</Text>
            <FlatList
              data={districts}
              renderItem={({ item }) =>
                renderListItem({
                  item,
                  onPress: () => setSelectedDistrict(item),
                })
              }
              keyExtractor={(item) => item.id.toString()}
            />
          </View>
        )}

        {selectedDistrict && !selectedSubDistrict && (
          <View style={styles.container}>
            <Text style={styles.TitleText}>Pilih Kecamatan.</Text>
            <FlatList
              data={subDistricts}
              renderItem={({ item }) =>
                renderListItem({
                  item,
                  onPress: () => handleSubDistrictSelect(item),
                })
              }
              keyExtractor={(item) => item.id.toString()}
            />
          </View>
        )}
      </RBSheet>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  item: {
    color: "#000000",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  TitleText: {
    color: "#000000",
    fontWeight: "bold",
    margin: 20,
    fontSize: 20,
  },
  textlist: {
    color: "#000000",
  },
});

export default BottomSheetDialog;
