import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home';
import Receita from './screens/inserirReceita'
import Ingrediente from './screens/inserirIngredientes'
import Instrucao from './screens/inserirInstrucoes'
import ViewReceita from './screens/viewReceita'

const Stack = createStackNavigator();

const Navigator = () => {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Receita" component={Receita} />
          <Stack.Screen name="Ingrediente" component={Ingrediente} />
          <Stack.Screen name="Instrucao" component={Instrucao} />
          <Stack.Screen name="ViewReceita" component={ViewReceita} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  };
  
  export default Navigator;