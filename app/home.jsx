import { View, Text, SafeAreaView, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useReducer } from 'react'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Link, router } from 'expo-router'
import { MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';
import { LinearGradient } from 'expo-linear-gradient';

const MainScreen = () => {

    const [dataGempa, setDataGempa] = useState([])
    const [loading, setLoading] = useState(true)  // State to indicate loading

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
                    waktu: new Date(latestData.waktu).toLocaleString(),
                    magnitude: extractMagnitude(latestData.deskripsi),
                    kedalaman: extractKedalaman(latestData.deskripsi),
                    dirasakan: latestData.dirasakan,
                    deskripsi: latestData.deskripsi,
                    lokasi: extractLokasi(latestData.deskripsi)
                }] : [];
                setDataGempa(newDataGempa);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);  // Set loading to false after data is fetched
            }
        };

        fetchData();
    }, []);

    const extractMagnitude = (deskripsi) => {
        // Mencari teks yang diawali dengan "Mag:" dan diakhiri dengan "SR,"
        const regex = /Mag:(.*?)(?= SR)/;
        const match = deskripsi.match(regex);
        return match ? match[1].trim() : '';
    };

    const extractKedalaman = (deskripsi) => {
        // Mencari teks yang diawali dengan "Kedalaman:" dan diakhiri dengan "Km"
        const regex = /Kedalaman:(.*?)(?= Km)/;
        const match = deskripsi.match(regex);
        return match ? match[1].trim() : '';
    };

    const extractLokasi = (deskripsi) => {
        // Mencari teks yang mengandung koordinat lintang dan bujur
        const regex = /Lok:(-?\d+\.\d+)\s+LS,\s*(\d+\.\d+)\s+BT/;
        const match = deskripsi.match(regex);
        // Jika ada kecocokan, ambil nilai lintang dan bujur
        if (match && match.length === 3) {
            const lintang = match[1].trim();
            const bujur = match[2].trim();
            return `${lintang}, ${bujur}`;
        } else {
            return 'N/A';
        }
    };

    const Spacer = ({ height = 16 }) => <View style={{ height }} />;
    const [dark, toggle] = useReducer((s) => !s, true);

    const colorMode = dark ? 'dark' : 'light';

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/* Komponen di atas Main Card tetap berada di luar ScrollView */}
            <View style={styles.header}>
                <View style={styles.containerHeader}>
                    <View style={styles.subContainer}>
                        <View>
                            <Text style={styles.title}>Selamat Datang User!</Text>
                        </View>
                        <View style={styles.subContainerHeader}>
                            <View>
                                <Text style={styles.subTitle}>Aplikasi MMI</Text>
                            </View>
                            <View style={{ backgroundColor: 'white', borderRadius: 60, marginRight: -15, marginTop: -30, padding: 5 }}>
                                <Image source={require('../assets/images/bmkg.png')} style={{ width: 60, height: 60 }} />
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => router.push('/screens/map')} style={[styles.subContainerHeader, { width: "100%", marginTop:"6%" }]}>
                            <Text style={[styles.subTitle, { fontSize: 13, fontFamily: 'Poppins-Bold' }]}>Informasi Gempa Saat ini</Text>
                            <MaterialCommunityIcons name='chevron-right' size={20} color='white' />
                    </TouchableOpacity>
                </View>
            </View>

            {/* 3 CARD ROW */}
            <View style={styles.cardOverlay}>
                <View style={styles.subCardOverlay1}>
                    {loading ? (
                        <MotiView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} transition={{ type: 'timing'}} from={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <Spacer height={'10%'} />
                            <Skeleton colorMode='light' width={"90%"} height={'90%'} />
                        </MotiView>
                    ) : (
                        <Text style={styles.text2}>{dataGempa.length > 0 ? dataGempa[0].deskripsi : 'No data available'}</Text>
                    )}
                </View>
                <View style={styles.subCardOverlay2}>
                    <MaterialCommunityIcons name='account-voice' size={45} color='black' />
                    <Text style={styles.text1}>Info Gempa Terkini</Text>
                </View>
            </View>
            {/* 3 CARD ROW END */}

            {/* Main Card di dalam ScrollView agar hanya konten di dalamnya yang dapat di-scroll */}
            <ScrollView style={{ flex: 1 }}>
                <View style={{ backgroundColor: 'white', marginBottom: 10 }}>
                    {/* Konten Main Card */}
                    <View style={{ marginHorizontal: 30 }}>
                        {/* CARD 1 START */}
                        <View style={styles.cardContent}>
                            <TouchableOpacity onPress={() => router.push('/screens/mmi')} style={styles.buttonCard}>
                                <Text style={styles.cardTitle}>MMI (Modified Mercalli Intensity)</Text>
                                <MaterialCommunityIcons name='chevron-right' size={20} color='#3354A5' />
                            </TouchableOpacity>
                            <View style={styles.textCard}>
                                <Image
                                    source={require('../assets/images/mmicenter.png')}
                                    style={styles.imageCard}
                                />
                                <Text style={[styles.textTitle, { textAlign: 'justify' }]}>Skala Mercalli adalah satuan untuk mengukur kekuatan gempa bumi
                                    yang terbagi menjadi 12 pecahan berdasarkan informasi dari
                                    orang-orang yang selamat dari gempa tersebut dan juga dengan
                                    melihat serta membandingkan tingkat kerusakan akibat gempa bumi
                                    tersebut.</Text>
                            </View>
                        </View>
                        {/* CARD 1 END */}

                        {/* CARD 2 START */}
                        <View style={styles.cardContent}>
                            <TouchableOpacity onPress={() => router.push('/input')} style={styles.buttonCard}>
                                <Text style={styles.cardTitle}>Laporkan Gempa</Text>
                                <MaterialCommunityIcons name='chevron-right' size={20} color='#3354A5' />
                            </TouchableOpacity>
                            <View style={styles.textCard}>
                                <View>
                                    <Text style={[styles.textTitle, { textAlign: 'justify', marginLeft: 30, marginRight: 5 }]}>Laporkan sekarang jika anda merasa gempa bumi atau
                                        sudah melihat dampak dari gempa bumi sesuai dengan MMI</Text>
                                    <TouchableOpacity onPress={() => router.push('/input')} activeOpacity={0.5} style={{ marginLeft: 30, backgroundColor: "#3354A5", width: 140, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                                            <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 13 }}>Laporkan Sekarang</Text>
                                    </TouchableOpacity>
                                </View>
                                <Image
                                    source={require('../assets/images/panic.png')}
                                    style={styles.imageCard}
                                />
                            </View>
                        </View>
                        {/* CARD 2 END */}

                        {/* CARD 3 START */}
                        <View style={styles.cardContent}>
                            <TouchableOpacity onPress={() => router.push('/screens/map')} style={styles.buttonCard}>
                                <Text style={styles.cardTitle}>Informasi Gempa Terkini</Text>
                                <MaterialCommunityIcons name='chevron-right' size={20} color='#3354A5' />
                            </TouchableOpacity>
                            <View style={styles.textCard}>
                                <Image
                                    source={require('../assets/images/think.png')}
                                    style={{ width: 120, height: 140, marginLeft: 0 }}
                                />
                                <Text style={[styles.textTitle, { textAlign: 'justify', marginRight: 5 }]}>Lihat lebih detail informasi gempa terkini yang
                                    meliputi kekuatan gempa, waktu terjadinya gempa, posisi gempa berada, wilayah mana yang terdampak, dan potensi dari gempa tersebut</Text>
                            </View>
                        </View>
                        {/* CARD 3 END */}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: 'white'
    },
    containerHeader: {
        backgroundColor: '#3354A5',
        padding: 35,
        height: 240,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    subContainer: {
        marginTop: 30
    },
    title: {
        fontSize: 21,
        fontFamily: 'Poppins-Bold',
        color: 'white'
    },
    subTitle: {
        color: 'white',
        fontFamily: 'Poppins-Regular',
        fontSize: 13
    },
    subContainerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    // CARD OVERLAY
    cardOverlay: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        backgroundColor: 'white',
        zIndex: 20,
    },
    subCardOverlay1: {
        width: "70%",
        height: 100,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        marginTop: -50,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 5,
    },
    subCardOverlay2: {
        width: "25%",
        height: 100,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        marginTop: -50,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 5
    },
    text1: {
        fontSize: 12,
        fontFamily: "Poppins-Medium",
        textAlign: 'center',
    },
    text2: {
        fontSize: 13,
        fontFamily: "Poppins-Medium",
        textAlign: 'justify',
        marginLeft: 9,
        marginRight: 9
    },
    text3: {
        fontSize: 14,
        fontFamily: "Poppins-SemiBold",
        textAlign: 'justify'
    },
    // CARD CONTENT
    cardContent: {
        padding: 25,
        backgroundColor: 'white',
        borderRadius: 20,
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 5
    },
    buttonCard: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    cardTitle: {
        fontFamily: 'Poppins-SemiBold',
        color: '#3354A5',
        fontSize: 14
    },
    textTitle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12
    },
    textCard: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 30,
        marginRight: 50,
        marginTop: 10,
    },
    imageCard: {
        width: 120,
        height: 140,
        resizeMode: 'contain'
    }
})

export default MainScreen
