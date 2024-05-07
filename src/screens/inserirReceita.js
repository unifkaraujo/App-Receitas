import React, {Component} from 'react'
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Dimensions , Image, KeyboardAvoidingView, 
  FlatList, Keyboard } from 'react-native'

import Ionicons from 'react-native-vector-icons/Ionicons'
import imagem from '../../assets/imgs/addReceita.png'

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const options = {
  title: 'Selecione uma foto',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

import AddCategoria from '../components/AddCategoria'

export default class App extends Component {

  state = {
    inputReceita: this.props.route.params.nomeReceita ? this.props.route.params.nomeReceita : '',
    showAddCategoria: false,
    isKeyboardOpen: false,
    inputCategoria: this.props.route.params.categoria ? this.props.route.params.categoria : {},
    image: this.props.route.params.image ? this.props.route.params.image : null,
  }

  pickImage = (source) => {

    const pickerFunction = source === 'camera' ? launchCamera : launchImageLibrary;
    pickerFunction(options, (response) => {
      console.log('teste')
        console.log('Response = ', response);
    
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

  setInputReceita = (inputReceita) => {
    this.setState({ inputReceita })
  }

  addCat = (newCategoria) => {
    this.setState({ inputCategoria: newCategoria })
    this.setState({ showAddCategoria: false })
  }

  setKeyboardOn = () => {
    this.setState({ isKeyboardOpen: true });
  };
  
  setKeyboardOff = () => {
    this.setState({ isKeyboardOpen: false });
  }

  componentDidMount() {
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

          <AddCategoria isVisible={this.state.showAddCategoria} 
              onCancel={() => this.setState({ showAddCategoria: false }) }
              onSave={this.addCat} />

          <View style={styleApp.appMain}>

            { /* Imagem superior */ }

            <TouchableOpacity onPress={() => this.pickImage('camera')}>

              <View style={styleApp.imagem}>
                  <Image source={this.state.image ? { uri: this.state.image } : imagem} style={styleApp.image} />
              </View>

           </TouchableOpacity>

            { /* Input para inserir nome da receita */ }
            <View>

              <View style={styleApp.input}> 
                  <Text style={styleApp.inputDesc}> Digite o </Text>
                  <Text style={[styleApp.inputDesc, {color: '#ECA457'} ]}>nome </Text>
                  <Text style={styleApp.inputDesc}>da sua </Text>
                  <Text style={[styleApp.inputDesc, {color: '#ECA457'} ]}>receita </Text>
              </View>

              <View style={{alignItems: 'center', paddingTop: 10}}> 
                  <View style={styleApp.inputNomeReceita}>
                      <TouchableOpacity>
                          <TextInput 
                              placeholder="Insira o nome aqui"
                              style={{fontSize: 16}}
                              value={this.state.inputReceita}
                              onChangeText={this.setInputReceita}
                          />
                      </TouchableOpacity>
                  </View>
              </View>

            </View>

            { /* Escolha da categoria */ }

            <View>

              <View style={styleApp.input}>
                <Text style={styleApp.inputDesc}> Escolha uma </Text>
                <Text style={[styleApp.inputDesc, {color: '#ECA457'} ]}>categoria </Text>
              </View>

              <View style={{alignItems: 'center', paddingTop: 10}}> 
                    <View style={styleApp.inputCatReceita}>
                        <TouchableOpacity
                          onPress={() => this.setState({ showAddCategoria: true })} >

                            <Text style={{fontSize: 16, color: '#999999'}}> {this.state.inputCategoria.nome ? this.state.inputCategoria.nome : 'Selecione aqui a categoria' } </Text>

                        </TouchableOpacity>
                        <Ionicons name="search" size={25} style={{paddingLeft: 10}} color='black'/> 
                    </View>
                    
              </View>

            </View>

          </View>
        
          { /*  Botões de navegação */ }
            {!this.state.isKeyboardOpen && (

              <View>

                <TouchableOpacity style={[styleApp.backButton]}
                  activeOpacity={0.7}
                  onPress={() => this.props.navigation.goBack()} >
                  <Ionicons name="arrow-back" size={30} color={'white'} />
                </TouchableOpacity>

                <TouchableOpacity style={[styleApp.addButton]}
                  activeOpacity={0.7}
                  
                  onPress={() => this.props.navigation.navigate('Ingrediente', 
                                { view: 'Receita', ingredienteArray: this.props.route.params.ingredienteArray, 
                                instrucaoArray: this.props.route.params.instrucaoArray, id: this.props.route.params.id, 
                                idIng: this.props.route.params.idIng, nomeReceita: this.state.inputReceita,
                                categoria: this.state.inputCategoria, image: this.state.image } )} >
                  
                  <Ionicons name="arrow-forward" size={30} color={'white'} />
                </TouchableOpacity>
                
              </View>
            )}
      
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
    alignItems: 'center',
  },

  image: {
    height: (Dimensions.get('window').width / 6) * 4,
    width: (Dimensions.get('window').width / 2) * 2,
    resizeMode: 'contain',
  },

  iconeCamera: {
    position: 'absolute',
    top: 230,
    right: 50,

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

  inputNomeReceita: {
    width: '80%' ,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 7,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  inputCatReceita: {
    width: '80%' ,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 7,
    paddingHorizontal: 20,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center'
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
      //borderColor: '#65A8F0',
      //borderWidth: 1
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