import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Tabs } from 'expo-router'

const TabLayout = () => {
    return (
        <>
            <Tabs activeColor="#f8981d"
                inactiveColor="black"
                barStyle={{ backgroundColor: 'black' }}
                screenOptions={{
                    // headerShown: false,
                    tabBarShowLabel: false,
                    tabBarBackground: () => { },
                }}>
                <Tabs.Screen
                    name="input"
                    options={{
                        title: "Input",
                        // headerShown: false,
                        tabBarIcon: ({ focused, size }) => (
                            <View
                                style={[
                                    styles.mainView,
                                    { backgroundColor: focused ? '#f8981d' : 'white' },
                                ]}>
                                <MaterialCommunityIcons
                                    name="map-marker-plus"
                                    size={size}
                                    style={{ color: focused ? 'white' : 'black' }}
                                />
                                <Text
                                    style={{
                                        color: focused ? 'white' : 'black',
                                        fontSize: 10,
                                        fontWeight: 'bold',
                                    }}>
                                    Input
                                </Text>
                            </View>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="output"
                    options={{
                        title: "Output",
                        // headerShown: false,
                        tabBarIcon: ({ focused, size }) => (
                            <View
                                style={[
                                    styles.mainView,
                                    { backgroundColor: focused ? '#f8981d' : 'white' },
                                ]}>
                                <MaterialCommunityIcons
                                    name="map-marker-plus"
                                    size={size}
                                    style={{ color: focused ? 'white' : 'black' }}
                                />
                                <Text
                                    style={{
                                        color: focused ? 'white' : 'black',
                                        fontSize: 10,
                                        fontWeight: 'bold',
                                    }}>
                                    Output
                                </Text>
                            </View>
                        ),
                    }}
                />
            </Tabs>
        </>
    )
}

export default TabLayout

const styles = StyleSheet.create({
    mainView: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 47,
        height: 45,
        borderRadius: 25,
    },
})