import { Restaurant } from "@/model/Restaurant";
import React from "react";
import { Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

type OpenTimesCardProps = {
    restaurant: Restaurant;
  };

export const OpenTimesCard: React.FC<OpenTimesCardProps> = ({restaurant}) => {
    if (restaurant.currentOpeningHours)
    {
        const labelContent = {
            text: restaurant.currentOpeningHours.openNow === true ? 'Open' : 'Closed',
            color: restaurant.currentOpeningHours.openNow === true ? '#319F43' : '#E33629',
        }

        return (
            <View style={styles.labelBackground} testID={labelContent.text}>
                <Text style={{ 
                    color: '#363232', 
                    fontWeight: 'bold',
                    marginRight: 5
                }}>
                {labelContent.text}
                </Text>
                <MaterialCommunityIcons name="clock" size={24} color={labelContent.color} />
            </View>
        )
    }
}

export const OpenTimesLabel: React.FC<OpenTimesCardProps> = ({restaurant}) => {

    if (restaurant.currentOpeningHours)
    {
        return (
            <View style={styles.labelNoBackground}>
                <MaterialCommunityIcons name="clock" size={21} color='#363232' />
                <Text style={{ 
                    color: '#363232', 
                    marginLeft: 6,
                    fontSize: 12.5,
                }}>
                {labelContent.text}
                </Text>
            </View>
        )
    }
  }

const styles = StyleSheet.create({
    labelBackground: {
        position: 'absolute', 
        right: "5%", 
        top: "12%", 
        backgroundColor: '#ffffff', 
        borderRadius: 5,
        paddingVertical: 1,
        paddingRight: 6, 
        paddingLeft: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 6,
    },

    labelNoBackground: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});