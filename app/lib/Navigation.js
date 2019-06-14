import { createAppContainer, createStackNavigator } from "react-navigation";
import Home from "../screens/Home";
import Detail from "../screens/Detail";

export default createAppContainer(
  createStackNavigator(
    {
      Home,
      Detail
    },
    {
      defaultNavigationOptions: {
        headerStyle: {
          elevation: 0
        }
      }
    }
  )
);
