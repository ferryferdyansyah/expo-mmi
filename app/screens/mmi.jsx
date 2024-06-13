import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, Pressable } from 'react-native';
import Swiper from 'react-native-swiper';
import { Link, router } from 'expo-router';

const data = [
    {
        id: '1',
        image: require('../../assets/images/mmi1.png'),
        color: '#ECECEC',
        text: 'black',
        description: 'I MMI',
        description2:
            'Getaran tidak dirasakan kecuali dalam keadaan luarbiasa oleh beberapa orang',
        dirasakan: "Tidak Dirasakan",
    },
    {
        id: '2',
        image: require('../../assets/images/mmi2.png'),
        color: '#DDDDD7',
        text: 'black',
        description: 'II MMI',
        description2:
            'Getaran dirasakan oleh beberapa orang, benda-benda ringan yang digantung bergoyang.',
        dirasakan: "Tidak Dirasakan",
    },
    {
        id: '3',
        image: require('../../assets/images/mmi3.png'),
        color: '#4BAE4C',
        text: 'white',
        description: 'III MMI',
        description2:
            'Getaran dirasakan nyata dalam rumah. Terasa getaran seakan-akan ada truk berlalu.',
        dirasakan: "Sedikit Dirasakan",
    },
    {
        id: '4',
        image: require('../../assets/images/mmi4.png'),
        color: '#4BAE4C',
        text: 'white',
        description: 'IV MMI',
        description2:
            'Pada siang hari dirasakan oleh orang banyak dalam rumah, di luar oleh beberapa orang, gerabah pecah, jendela/pintu berderik dan dinding berbunyi.',
        dirasakan: "Sedikit Dirasakan",
    },
    {
        id: '5',
        image: require('../../assets/images/mmi5.png'),
        color: '#4BAE4C',
        text: 'white',
        description: 'V MMI',
        description2:
            'Getaran dirasakan oleh hampir semua penduduk, orang banyak terbangun, gerabah pecah, barang-barang terpelanting, tiang-tiang dan barang besar tampak bergoyang, bandul lonceng dapat berhenti.',
        dirasakan: "Sedikit Dirasakan",
    },
    {
        id: '6',
        image: require('../../assets/images/mmi6.png'),
        color: '#FEEA3B',
        text: 'black',
        description: 'VI MMI',
        description2:
            'Getaran dirasakan oleh semua penduduk. Kebanyakan semua terkejut dan lari keluar, plester dinding jatuh dan cerobong asap pada pabrik rusak, kerusakan ringan.',
        dirasakan: "Kerusakan Ringan",
    },
    {
        id: '7',
        image: require('../../assets/images/mmi7.png'),
        color: '#F8971D',
        text: 'white',
        description: 'VII MMI',
        description2:
            'Tiap-tiap orang keluar rumah. Kerusakan ringan pada rumah-rumah dengan bangunan dan konstruksi yang baik. Sedangkan pada bangunan yang konstruksinya kurang baik terjadi retak-retak bahkan hancur, cerobong asap pecah. Terasa oleh orang yang naik kendaraan.',
        dirasakan: "Kerusakan Sedang",
    },
    {
        id: '8',
        image: require('../../assets/images/mmi8.png'),
        color: '#F8971D',
        text: 'white',
        description: 'VIII MMI',
        description2:
            'Kerusakan ringan pada bangunan dengan konstruksi yang kuat. Retak-retak pada bangunan degan konstruksi kurang baik, dinding dapat lepas dari rangka rumah, cerobong asap pabrik dan monumen-monumen roboh, air menjadi keruh.',
        dirasakan: "Kerusakan Sedang",
    },
    {
        id: '9',
        image: require('../../assets/images/mmi9.png'),
        color: '#EF4338',
        text: 'white',
        description: 'IX MMI',
        description2:
            'Kerusakan pada bangunan yang kuat, rangka-rangka rumah menjadi tidak lurus, banyak retak. Rumah tampak agak berpindah dari pondamennya. Pipa-pipa dalam rumah putus.',
        dirasakan: "Kerusakan Berat",
    },
    {
        id: '10',
        image: require('../../assets/images/mmi10.png'),
        color: '#EF4338',
        text: 'white',
        description: 'X MMI',
        description2:
            'Bangunan dari kayu yang kuat rusak,rangka rumah lepas dari pondamennya, tanah terbelah rel melengkung, tanah longsor di tiap-tiap sungai dan di tanah-tanah yang curam.',
        dirasakan: "Kerusakan Berat",
    },
    {
        id: '11',
        image: require('../../assets/images/mmi11.png'),
        color: '#EF4338',
        text: 'white',
        description: 'XI MMI',
        description2:
            'Bangunan-bangunan hanya sedikit yang tetap berdiri. Jembatan rusak, terjadi lembah. Pipa dalam tanah tidak dapat dipakai sama sekali, tanah terbelah, rel melengkung sekali',
        dirasakan: "Kerusakan Berat",
    },
    {
        id: '12',
        image: require('../../assets/images/mmi12.png'),
        color: '#EF4338',
        text: 'white',
        description: 'XII MMI',
        description2:
            'Hancur sama sekali, Gelombang tampak pada permukaan tanah. Pemandangan menjadi gelap. Benda-benda terlempar ke udara.',
        dirasakan: "Kerusakan Berat",
    },
];

const ImageList = () => {
    return (
        <View style={styles.container}>
            <Swiper showsPagination={true} style={styles.wrapper} showsButtons={true}>
                {data.map(item => (
                    <View key={item.id} style={styles.slide}>
                        <View style={styles.card}>
                            <Text style={styles.title}>{item.description}</Text>
                            <View style={styles.topCard}>
                                <Image source={item.image} style={styles.image} />
                            </View>
                            <View style={[styles.bottomCard, { backgroundColor: `${item.color}` }]}>
                                <View style={{ marginTop: 20, marginLeft: 15 }}>
                                    <Text style={[styles.text1, { color: `${item.text}` }]}>{item.dirasakan}</Text>
                                    <Text style={[styles.text2, { color: `${item.text}` }]}>{item.description2}</Text>
                                </View>
                            </View>
                        </View>
                        {/* <View style={{ alignItems: 'center', backgroundColor:'red', justifyContent: 'center'}}>
                        <Link href={"/input"} style={[styles.btnSubmit, { backgroundColor: `${item.color}` }]}>
                            <Text style={{ color: `${item.text}`, fontSize: 16, fontWeight: 'bold' }}>Laporkan Gempa</Text>
                        </Link>
                        </View> */}
                        <Pressable onPress={() => router.push("/input")} activeOpacity={0.8} style={[styles.btnSubmit, { backgroundColor: `${item.color}` }]}>
                            <Text style={[styles.linkText, { color: `${item.text}` }]}>Laporkan Gempa</Text>
                        </Pressable>
                    </View>
                ))}
            </Swiper>
        </View>
    );
}
// }

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        color: 'black',
        textAlign: 'center',
        marginTop: 10,
        fontFamily: "Poppins-Bold"
    },
    text1: {
        fontSize: 20,
        fontFamily: "Poppins-SemiBold"
    },
    text2: {
        fontSize: 16,
        fontFamily: "Poppins-Regular",
        marginTop: 5
    },
    wrapper: {
        // color:'black'
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor:'red'
    },
    navbar: {
        backgroundColor: '#f8981d',
        flexDirection: 'row',
        height: 60,
        alignItems: 'center',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15
    },
    buttonNav: {
        marginRight: '15%',
        marginLeft: '5%'
    },
    textNav: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    card: {
        backgroundColor: 'white',
        width: '75%',
        borderRadius: 20,
        height: '70%',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        elevation: 5
    },
    topCard: {
        alignItems: 'center',
        height: '40%',
        justifyContent: 'center'
    },
    image: {
        width: '70%',
        height: '80%'
    },
    bottomCard: {
        height: '51%',
        marginTop: 10,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20
    },
    btnSubmit: {
        width: '55%',
        borderRadius: 10,
        height: 50,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        elevation: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30
    },
    link: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        // backgroundColor: 'red'
    },
    linkText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        textAlign: 'center'
    },
});

export default ImageList;