import React, { useEffect, useState } from "react";
import {
  WebView,
  Linking,
  Text,
  View,
  TouchableOpacity,
  Modal
} from "react-native";
import AnimatedEllipsis from "react-native-animated-ellipsis";
import WallPaperManager from "react-native-wallpaper-manager";

import Container from "../components/Container";
import LargeImage from "../components/LargeImage";
import Cover from "../components/Cover";
import Title from "../components/Title";
import Row from "../components/Row";
import SmallImageTitle from "../components/SmallImageTitle";
import ThumbnailView from "../components/ThumbnailView";
import Icon from "react-native-ionicons";

const Detail = ({ navigation }) => {
  const { item } = navigation.state.params;
  let webview;

  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [image, setImage] = useState("");
  const [settingWallpaper, setSettingWallpaper] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(-1);

  useEffect(() => {
    fetch(item.href).then(response =>
      response.json().then(links => {
        setImages(links);
        setLoading(false);
      })
    );
  }, []);

  return (
    <Container>
      <Cover>
        <LargeImage source={{ uri: item.links[0].href }} resizeMode="stretch" />
      </Cover>

      <Row>
        {loading && <AnimatedEllipsis />}
        {images.map((image, index) => {
          if (!image.includes("metadata")) {
            let title = image.split("~")[1].split(".")[0];
            title =
              title.charAt(0).toUpperCase() + title.slice(1, title.length);

            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedImageIndex(index);
                  setImage(image);
                  setShowModal(true);
                }}
              >
                <ThumbnailView>
                  <Image
                    source={{ uri: image }}
                    style={[
                      index === selectedImageIndex && {
                        borderColor: "#333",
                        borderWidth: 3
                      },
                      {
                        height: 50,
                        width: 50,
                        marginRight: 7.5
                      }
                    ]}
                  />
                  <SmallImageTitle>{title}</SmallImageTitle>
                </ThumbnailView>
              </TouchableOpacity>
            );
          }
        })}
      </Row>

      <Title>{item.data[0].title}</Title>
      <WebView
        ref={ref => {
          webview = ref;
        }}
        source={{ html: item.data[0].description }}
        onNavigationStateChange={({ url }) => {
          // Prevent Webview from opening link within
          if (url.startsWith("http") || url.startsWith("https://")) {
            webview.stopLoading();
          }

          Linking.canOpenURL(url)
            .then(supported => {
              if (supported) {
                return Linking.openURL(url);
              }
            })
            .catch(err => console.error("An error occurred", err));
        }}
      />
      <Modal animationType="slide" transparent={false} visible={showModal}>
        <Icon
          name="close-circle"
          color="#d5d5d5"
          size={24}
          style={{ position: "absolute", top: 10, right: 10, zIndex: 1 }}
          onPress={() => setShowModal(false)}
        />
        <View style={{ flex: 1 }}>
          <Image
            source={{
              uri: image
            }}
            style={{ flex: 1, width: undefined, height: undefined }}
          />
          <TouchableOpacity
            style={{
              position: "absolute",
              bottom: 20,
              right: 10,
              backgroundColor: "#999",
              padding: 10,
              borderRadius: 10
            }}
            onPress={() => {
              setSettingWallpaper(true);
              WallPaperManager.setWallpaper({ uri: image }, response => {
                setSettingWallpaper(false);
              });
            }}
          >
            <Text style={{ color: "#f5f5f5" }}>Set Wallpaper</Text>
          </TouchableOpacity>
          {settingWallpaper && (
            <View
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text style={{ fontSize: 18, color: "#f1f1f1" }}>
                Setting Wallpaper, Please Wait...
              </Text>
            </View>
          )}
        </View>
      </Modal>
    </Container>
  );
};

Detail.navigationOptions = ({ navigation }) => {
  const { item } = navigation.state.params;

  return {
    title: item.data[0].title
  };
};

export default Detail;
