import React, { Component } from "react";
import { YellowBox } from "react-native";
import Navigation from "./lib/Navigation";

YellowBox.ignoreWarnings(["Warning"]);
console.disableYellowBox = true;

class App extends Component {
  render() {
    return <Navigation />;
  }
}

export default App;
