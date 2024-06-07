import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableHighlight, Animated } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Link } from 'expo-router';

const App = () => {
    const [dataGempa, setDataGempa] = useState([]);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const scaleValue = useRef(new Animated.Value(1)).current;
    const opacityValue = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://react-native-mmi-app-default-rtdb.asia-southeast1.firebasedatabase.app/user-input.json?auth=IOf8J6OJbDvEv90XK0LLfscCfaAaFJPNcBRp8PPX');
                if (!response.ok) {
                    throw new Error('Gagal mengambil data');
                }
                const json = await response.json();
                const dataArray = Object.entries(json).map(([id, data]) => ({ id, ...data }));
                const latestData = dataArray.length > 0 ? dataArray[dataArray.length - 1] : null;
                const newDataGempa = latestData ? [{
                    id: latestData.id,
                    waktu: latestData.waktu,
                    magnitude: extractMagnitude(latestData.deskripsi),
                    kedalaman: extractKedalaman(latestData.deskripsi),
                    dirasakan: latestData.dirasakan,
                    lokasi: extractLokasi(latestData.deskripsi),
                    wilayah: extractWilayah(latestData.deskripsi)
                }] : [];
                setDataGempa(newDataGempa);

                if (latestData) {
                    const lokasi = extractLokasi(latestData.deskripsi);
                    const [latitude, longitude] = lokasi.split(', ');
                    setLatitude(parseFloat(latitude));
                    setLongitude(parseFloat(longitude));
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();

        const startAnimation = () => {
            scaleValue.setValue(0);
            opacityValue.setValue(1);
            Animated.loop(
                Animated.parallel([
                    Animated.timing(scaleValue, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacityValue, {
                        toValue: 0,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ]),
                {
                    iterations: -1
                }
            ).start();
        };

        startAnimation();
    }, [scaleValue, opacityValue]);

    const extractMagnitude = (deskripsi) => {
        const regex = /Mag:(.*?)(?= SR)/;
        const match = deskripsi.match(regex);
        return match ? match[1].trim() : '';
    };

    const extractKedalaman = (deskripsi) => {
        const regex = /Kedalaman:(.*?)(?= Km)/;
        const match = deskripsi.match(regex);
        return match ? match[1].trim() : '';
    };

    const extractLokasi = (deskripsi) => {
        const regex = /Lok:(-?\d+\.\d+)\s+LS,\s*(\d+\.\d+)\s+BT/;
        const match = deskripsi.match(regex);
        if (match && match.length === 3) {
            const lintang = match[1].trim();
            const bujur = match[2].trim();
            return `${lintang}, ${bujur}`;
        } else {
            return 'N/A';
        }
    };

    const extractWilayah = (deskripsi) => {
        const regex = /\(([^)]+)\)/;
        const match = deskripsi.match(regex);
        return match ? match[1] : 'N/A';
    };

    return (
        <View style={styles.container}>
            {latitude !== null && longitude !== null && (
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: latitude,
                        longitude: longitude,
                        latitudeDelta: 10,
                        longitudeDelta: 10,
                    }}
                    provider={PROVIDER_GOOGLE}
                    showsUserLocation={true}
                    showsCompass={true}
                >
                    <Marker coordinate={{ latitude: latitude, longitude: longitude }}>
                        <View style={styles.markerContainer}>
                            <Animated.View
                                style={[
                                    styles.pulsingDot,
                                    {
                                        transform: [{ scale: scaleValue }],
                                        opacity: opacityValue,
                                    },
                                ]}
                            />
                            <View style={styles.dot} />
                        </View>
                    </Marker>
                </MapView>
            )}

            <View style={styles.overlay}>
                <ScrollView>
                    <View style={styles.card}>
                        <View>
                            <Text style={styles.title}>Gempabumi M ≤ 5</Text>
                        </View>
                        <View style={styles.content}>
                            <View style={{ alignItems: 'center' }}>
                                <View style={styles.wrapIconTop}>
                                    <MaterialCommunityIcons name="pulse" style={[styles.iconTop, { color: 'red' }]} />
                                    <Text style={[styles.textIconTop]}>{dataGempa.length > 0 ? dataGempa[0].magnitude : ''}</Text>
                                </View>
                                <Text style={{ marginTop: -5, color: 'black', fontFamily: "Poppins-SemiBold" }}>Magnitudo</Text>
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                <View style={styles.wrapIconTop}>
                                    <MaterialCommunityIcons name="waveform" style={[styles.iconTop, { color: 'green' }]} />
                                    <Text style={[styles.textIconTop]}>{dataGempa.length > 0 ? dataGempa[0].kedalaman : ''}</Text>
                                </View>
                                <Text style={{ marginTop: -5, color: 'black', fontFamily: "Poppins-SemiBold" }}>Kedalaman</Text>
                            </View>
                            <View style={{ alignItems: 'center', }}>
                                <View style={styles.wrapIconTop}>
                                    <MaterialCommunityIcons name="map-marker-radius" style={[styles.iconTop, { color: '#f8981d', fontSize: 30 }]} />
                                    <Text style={[styles.textIconTop, { fontSize: 14 }]}>{dataGempa.length > 0 ? dataGempa[0].lokasi : ''},</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.tidakBerpotensi}>
                            <Text style={{ color: 'black', fontWeight: 'bold', textAlign: 'center', fontSize: 12 }}>Potensi</Text>
                        </View>
                    </View>

                    <View style={styles.containerBotCard}>
                        <View style={styles.subContainerBotCard}>
                            <View style={{ flexDirection: 'row' }}>
                                <MaterialCommunityIcons name="calendar-clock" style={styles.iconBot} />
                                <View style={{ marginLeft: 10 }}>
                                    <Text style={{ fontFamily: "Poppins-Regular" }}>Waktu :</Text>
                                    <Text style={styles.textIconBot}>{dataGempa.length > 0 ? dataGempa[0].waktu : 'Load Data...'}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.subContainerBotCard}>
                            <View style={{ flexDirection: 'row' }}>
                                <MaterialCommunityIcons name="target" style={styles.iconBot} />
                                <View style={{ marginLeft: 10 }}>
                                    <Text style={{ fontFamily: "Poppins-Regular" }}>Lokasi Gempa :</Text>
                                    <Text style={[styles.textIconBot, { marginRight: 10 }]}>{dataGempa.length > 0 ? dataGempa[0].wilayah : 'Load Data...'}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.subContainerBotCard}>
                            <View style={{ flexDirection: 'row' }}>
                                <MaterialCommunityIcons name="map-marker-distance" style={styles.iconBot} />
                                <View style={{ marginLeft: 10 }}>
                                    <Text style={{ fontFamily: "Poppins-Regular" }}>Koordinat :</Text>
                                    <Text style={styles.textIconBot}>{dataGempa.length > 0 ? dataGempa[0].lokasi : 'Load Data...'}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={{ alignItems: 'center', marginTop: 0, backgroundColor: 'white', justifyContent: 'center', padding: 10, marginHorizontal: 0, marginVertical: 5, borderRadius: 25 }}>
                        <TouchableHighlight style={{ backgroundColor: '#2ccbef', width: 230, height: 40, borderRadius: 15 }}>
                            <Link href='/screens/peta' style={{ lineHeight: 40, textAlign: 'center', color: 'white', fontWeight: 'bold' }}>Lihat</Link>
                        </TouchableHighlight>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    card: {
        alignItems: 'center',
        marginTop: 7,
        justifyContent: 'center',
        flexDirection: 'column',
        padding: 10,
        borderRadius: 25,
        backgroundColor: 'white',
        borderColor: 'black',
        marginHorizontal: 0,
        marginVertical: 5
    },
    title: {
        alignItems: 'center',
        fontSize: 16,
        color: 'black',
        fontFamily: 'Poppins-Bold'
    },
    wrapIconTop: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 60,
        flexDirection: 'row'
    },
    iconTop: {
        fontSize: 40,
        marginTop: 20
    },
    textIconTop: {
        color: '#000',
        fontSize: 16,
        marginTop: 20,
        fontFamily: 'Poppins-SemiBold'
    },
    tidakBerpotensi: {
        backgroundColor: '#beeabf',
        marginBottom: 5,
        marginTop: 15,
        borderRadius: 15,
        width: 230,
        height: 40,
        flex: 1,
        justifyContent: 'center'
    },
    containerBotCard: {
        marginTop: 0,
        backgroundColor: 'white',
        justifyContent: 'center',
        padding: 10,
        marginVertical: 5,
        borderRadius: 25
    },
    subContainerBotCard: {
        marginRight: 10,
        marginLeft: 10,
        marginTop: 10
    },
    iconBot: {
        color: '#2ccbef',
        fontSize: 25
    },
    textIconBot: {
        fontSize: 15,
        color: '#000',
        fontFamily: 'Poppins-SemiBold'
    },
    content: {
        display: 'flex',
        flexDirection: 'row',
        width: 310,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: -10
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        marginTop: -300,
    },
    overlay: {
        backgroundColor: 'transparent',
        position: 'absolute',
        width: '90%',
        bottom: 5,
    },
    pulsingDot: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 0, 0, 0.5)',
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 0, 0, 0.8)',
        position: 'absolute',
    },
    markerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default App;
