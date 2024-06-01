import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import StarRating from "./StarRating";
import images from "@/assets/data/images";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

interface CustomCalloutProps {
  name: string;
  rating?: number;
  image?: string;
}

const CustomCallout: React.FC<CustomCalloutProps> = ({
  name,
  rating,
  image,
}) => {
  return (
    <View style={styles.calloutContainer}>
      <Text style={styles.name}>{name}</Text>
      <View style={styles.ratingContainer}>
        {rating !== undefined && <StarRating rating={rating} />}
      </View>
      <WebView
        style={styles.webViewStyle}
        source={{
          html: `
          <div style="display: flex; justify-content: center; align-items: center; height: 100%; width: 100%;">
          <img src="${
            image || images.defaultRestaurantImage
          }" style="width: 100%; height: 100%; object-fit: cover; object-position: center center;"/>
          </div>
          `,
        }}
        automaticallyAdjustContentInsets={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  calloutContainer: {
    width: wp('50%'),
    padding: wp('3%'),
    borderRadius: wp('2%'),
    backgroundColor: "white",
  },
  name: {
    fontWeight: "bold",
    fontSize: wp('4%'),
    marginBottom: hp('1%'),
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp('1%'),
  },
  price: {
    marginLeft: wp('1%'),
  },
  webViewStyle: {
    width: wp('45%'),
    height: hp('15%'),
    borderRadius: wp('2%'),
    overflow: "hidden",
    marginTop: hp('1%'),
  },
});

export default CustomCallout;
