import React, {Component} from 'react'
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Dimensions , Image, KeyboardAvoidingView, FlatList } from 'react-native'

import Ionicons from 'react-native-vector-icons/Ionicons'
import imagem from '../../assets/imgs/addReceita.png'

import AddCategoria from '../components/AddCategoria'


export default class App extends Component {

  state = {
    inputReceita: '',
    showAddCategoria: false
  }

  setInputReceita = (inputReceita) => {
    this.setState({ inputReceita })
  }

  addTask = () => {
    console.log('entrou')
  }

  componentDidMount() {
  }

  render() {

    return (

      <SafeAreaView style={styleApp.app}>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >

             <AddCategoria isVisible={this.state.showAddCategoria} 
                    onCancel={() => this.setState({ showAddCategoria: false }) }
                    onSave={this.addTask} />

          <View style={styleApp.appMain}>

            { /* Imagem superior */ }
            <View style={styleApp.imagem}>
              <Image source={imagem} style={styleApp.image}/>

            </View>

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
                            { /* COPIAR O MODAL DO PROJETO DE TASKS, VAI SER NAQUELE MESMO ESTILO */ }

                            <Text style={{fontSize: 16}}> Selecione aqui a categoria </Text>

                        </TouchableOpacity>
                        <Ionicons name="search" size={25} style={{paddingLeft: 10}} color='black'/> 
                    </View>
                    
              </View>

            </View>


            { /*  Botões de navegação */ }
            <TouchableOpacity style={[styleApp.backButton]}
              activeOpacity={0.7}
              onPress={() => this.props.navigation.goBack()} >
              <Ionicons name="arrow-back" size={30} color={'white'} />
            </TouchableOpacity>

            <TouchableOpacity style={[styleApp.addButton]}
              activeOpacity={0.7}
              onPress={() => this.props.navigation.navigate('Receita', { view: 'Home' } )} >
              <Ionicons name="arrow-forward" size={30} color={'white'} />
            </TouchableOpacity>


          </View>
        
        </KeyboardAvoidingView>
      
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
    height: (Dimensions.get('window').width / 4) * 3,
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