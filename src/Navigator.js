import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home';
import Receita from './screens/inserirReceita'
import Ingrediente from './screens/inserirIngredientes'

const Stack = createStackNavigator();

const Navigator = () => {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Receita" component={Receita} />
          <Stack.Screen name="Ingrediente" component={Ingrediente} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  };
  
  export default Navigator;