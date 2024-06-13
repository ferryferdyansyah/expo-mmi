import { View, Text, TouchableOpacity, StyleSheet, Image, Pressable } from 'react-native'
import React from 'react'
import { Link, router } from 'expo-router'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const App = () => {
    return (
        <View style={styles.container}>
            <View style={{ alignItems: 'center', justifyContent: 'center', height: '80%', marginHorizontal: 20, marginTop: "12%" }}>
                <View style={{ marginHorizontal: 20, marginBottom: 30 }}>
                    <Text style={[styles.title]}>Apakah Anda Merasakan Gempa?</Text>
                    <Text style={[styles.header]}>Segera Laporkan Disini</Text>
                </View>
                <View style={{ width: "100%", height: "60%", marginHorizontal: 20, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../assets/images/fist.png')} style={{ width: "95%", height: "95%" }} />
                    <Text style={{ textAlign: 'center', fontSize: 13, fontFamily: "Poppins-Medium" }}>Ayo ikut berkontribusi bersama kami dalam pelaporan gempa yang anda rasakan</Text>
                </View>
            </View>
            <View style={{ alignItems: 'center', marginHorizontal: 40 }}>
                <TouchableOpacity onPress={() => router.push("/home")} activeOpacity={0.8} style={{ width: 60, backgroundColor: '#3354A5', alignItems: 'center', justifyContent: 'center', height: 60, borderRadius: 50 }}>
                    {/* <Link href="/home"> */}
                        <MaterialCommunityIcons
                            name="arrow-right-thin"
                            size={40}
                            color="white"
                        />
                    {/* </Link> */}
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default App

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    title: {
        fontFamily: "Poppins-Bold",
        color: "black",
        fontSize: 24,
        textAlign: 'center'
    },
    header: {
        fontFamily: "Poppins-SemiBold",
        color: "black",
        fontSize: 18,
        textAlign: 'center'
    },
});