import React, {Component} from 'react'
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Dimensions , Image, 
  KeyboardAvoidingView, FlatList, Button, ScrollView, Keyboard } from 'react-native'

import Ionicons from 'react-native-vector-icons/Ionicons'
import imagem from '../../assets/imgs/addReceita.png'

import {launchCamera, launchImageLibrary} from 'react-native-image-picker'

const options = {
  title: 'Selecione uma foto',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
}

import AddCategoria from '../components/AddCategoria'
import AddIngrediente from '../components/AddIngrediente'

const initialState = { 
  isKeyboardOpen: false,
}

export default class App extends Component {

  state = {
    ...initialState,
    ingredientes: this.props.route.params.ingredienteArray ? this.props.route.params.ingredienteArray : [{'valor': '', 'id': 0}],
    id: this.props.route.params.idIng ? this.props.route.params.idIng : 0,
    image: this.props.route.params.image ? this.props.route.params.image : null,
  }

  pickImage = (source) => {

    const pickerFunction = source === 'camera' ? launchCamera : launchImageLibrary;
    pickerFunction(options, (response) => {    
        if (response.didCancel) {
        console.log('User cancelled image picker');
        } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        } else {
            this.setState({ image: response.assets[0].uri })
        }
    })

  }

  setIngredientes = (valor, indice) => {
    
    let ingredientes = this.state.ingredientes
    ingredientes[indice].valor = valor
    if (!ingredientes[indice + 1]) {
      const id = this.state.id + 1
      ingredientes[indice+1] = {'valor': '', 'id': id}
      this.setState({ id })
    }
    
    this.setState({ ingredientes })

  }

  setKeyboardOn = () => {
    this.setState({ isKeyboardOpen: true });
  };
  
  setKeyboardOff = () => {
    this.setState({ isKeyboardOpen: false });
  };

  delIngrediente = async (indice) => {
    let ingredientes = this.state.ingredientes.slice(); // Criando uma cópia do array
    ingredientes.splice(indice, 1);

    await this.setState({ ingredientes })

  }


  componentDidMount() {

    /* Usando uma solução ruim, pois foi a unica que consegui */
    /* Basicamente vamos monitorar o teclado, se ligado, oculta botões /*/
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.setKeyboardOn
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.setKeyboardOff
    );

  }

  render() {

    return (

      <SafeAreaView style={styleApp.app}>

          <ScrollView>
        
            <View style={styleApp.appMain}>
              
              { /* Imagem superior */ }

              <TouchableOpacity onPress={() => this.pickImage('camera')}>

                <View style={styleApp.imagem}>
                    <Image source={this.state.image ? { uri: this.state.image } : imagem} style={styleApp.image} />
                </View>

              </TouchableOpacity>

              { /* Escolha dos ingredientes */ }
              <View style={{flex: 1}}>

                <View style={styleApp.input}>
                  <Text style={styleApp.inputDesc}> Quais são os </Text>
                  <Text style={[styleApp.inputDesc, {color: '#ECA457'} ]}>ingredientes </Text>
                </View>

                <View style={{flex: 1}}>
                  {this.state.ingredientes.map((ingrediente, index) => (
                    <AddIngrediente
                      key={ingrediente.id}
                      valor={ingrediente.valor}
                      indice={index}
                      funcao={this.setIngredientes}
                      deletar={this.delIngrediente}
                      onChange={(valor) => handleChange(valor, index)}
                    />
                  ))}
                </View>
              </View>
            </View>

          </ScrollView>
              
          { /*  Botões de navegação */ }
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 }}>
            {!this.state.isKeyboardOpen && (
              <TouchableOpacity style={[styleApp.backButton]}
                activeOpacity={0.7}
                onPress={() => this.props.navigation.reset({
                  routes: [{ 
                    name: 'Receita',
                    params: {
                      view: 'Ingrediente',
                      instrucaoArray: this.props.route.params.instrucaoArray, 
                      ingredienteArray: this.state.ingredientes, id: this.props.route.params.id, 
                      idIng: this.state.id, nomeReceita: this.props.route.params.nomeReceita,
                      categoria: this.props.route.params.categoria, image: this.state.image
                      }
                    }]
                  }) } >
                <Ionicons name="arrow-back" size={30} color={'white'} />
              </TouchableOpacity>
            )}

            {!this.state.isKeyboardOpen && (
              <TouchableOpacity style={[styleApp.addButton]}
                activeOpacity={0.7}
                onPress={() => this.props.navigation.navigate('Instrucao', { view: 'Ingrediente', 
                                                             instrucaoArray: this.props.route.params.instrucaoArray, 
                                                             ingredienteArray: this.state.ingredientes, id: this.props.route.params.id, 
                                                             idIng: this.state.id, nomeReceita: this.props.route.params.nomeReceita,
                                                             categoria: this.props.route.params.categoria, image: this.state.image } )} >
                <Ionicons name="arrow-forward" size={30} color={'white'} />
              </TouchableOpacity>
            )}
          </View>

      </SafeAreaView>
    
    )
  }
}

const styleApp = StyleSheet.create({

  app: {
    flex: 1,
    backgroundColor: '#D5ECF0',
  },

  appMain: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 20
  },

  imagem: {
    alignItems: 'center'
  },

  image: {
    height: (Dimensions.get('window').width / 6) * 4,
    width: (Dimensions.get('window').width / 2),
    resizeMode: 'contain',
  },

  input: {
    justifyContent: 'center',
    marginTop: 20,
    flexDirection: 'row'
  },

  inputDesc: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 20
  },

  inputNomeIngrediente: {
    width: '80%' ,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 7,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  backButton: {
    position: 'absolute',
    left: 30,
    bottom: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center' ,
    backgroundColor: '#ECA457',
  },

  addButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center' ,
    backgroundColor: '#ECA457',
   }

})