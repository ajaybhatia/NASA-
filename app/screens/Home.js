import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, TouchableOpacity, Keyboard } from "react-native";
import Icon from "react-native-ionicons";

import Container from "../components/Container";
import Keywords from "../components/Keywords";
import Keyword from "../components/Keyword";
import Content from "../components/Content";
import Title from "../components/Title";
import Center from "../components/Center";
import SearchBar from "../components/SearchBar";
import TopBar from "../components/TopBar";
import SearchInput from "../components/SearchInput";
import Image from "../components/Image";

const keywords = [
  "Earth",
  "Moon",
  "Mars",
  "Jupiter",
  "Sun",
  "Neptune",
  "Blackhole",
  "Milky way",
  "Solar system",
  "Venus",
  "Pluto",
  "Mercury"
];

const Home = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState([]);
  const [activeKeywordIndex, setActiveKeywordIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData(keywords[0]);
  }, []);

  const getData = useCallback(search => {
    setLoading(true);

    fetch(`https://images-api.nasa.gov/search?q=${search}`)
      .then(response =>
        response.json().then(({ collection: { items } }) => {
          setItems(items);
          setLoading(false);
        })
      )
      .catch(error => {
        setLoading(false);
        console.log(error.message);
      });
  }, []);

  return (
    <Container>
      <TopBar>
        <SearchBar>
          <Icon name="search" size={24} />
          <SearchInput
            value={searchTerm}
            onChangeText={text => setSearchTerm(text)}
            onSubmitEditing={() => getData(searchTerm)}
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity
              style={{ position: "absolute", right: 10 }}
              onPress={() => {
                setSearchTerm("");
                Keyboard.dismiss();
              }}
            >
              <Icon name="close-circle" size={24} />
            </TouchableOpacity>
          )}
        </SearchBar>

        <Keywords horizontal showsHorizontalScrollIndicator={false}>
          {keywords.sort().map((keyword, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                getData(keyword);
                setActiveKeywordIndex(index);
              }}
            >
              <Keyword active={activeKeywordIndex === index}>{keyword}</Keyword>
            </TouchableOpacity>
          ))}
        </Keywords>
      </TopBar>
      {loading ? (
        <Center>
          <ActivityIndicator size={32} />
        </Center>
      ) : (
        <Content
          contentContainerStyle={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center"
          }}
        >
          {items.map((item, index) => {
            if (item && item.links && item.links[0].href) {
              return (
                <TouchableOpacity
                  key={item.data[0].nasa_id}
                  onPress={() => navigation.navigate("Detail", { item })}
                >
                  <Image source={{ uri: item.links[0].href }} />
                </TouchableOpacity>
              );
            }
          })}
        </Content>
      )}
    </Container>
  );
};

Home.navigationOptions = {
  title: "Home"
};

export default Home;
