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

import AddInstrucao from '../components/AddInstrucao'

/* Conexão com o banco de dados local SQLite */
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({
  name: 'myDatabase.db',
  location: 'default',
});

const initialState = { 
  inputInstrucao: '',
  isKeyboardOpen: false
}

export default class App extends Component {

  state = {
    ...initialState,
    instrucoes: this.props.route.params.instrucaoArray ? this.props.route.params.instrucaoArray : [{'valor': '', 'id': 0, 'cont': 0}],
    id: this.props.route.params.id ? this.props.route.params.id : 0,
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

  setInputIntrucao = (inputInstrucao) => {
    this.setState({ inputInstrucao })
  }

  setInstrucao = (valor, indice) => {
    
    let instrucoes = this.state.instrucoes
    instrucoes[indice].valor = valor
    if (!instrucoes[indice + 1]) {
      const id = this.state.id + 1
      const cont = instrucoes.length;
      instrucoes[indice+1] = {'valor': '', 'id': id, 'cont': cont}
      this.setState({ id })
    }
    this.setState({ instrucoes })
  }

  setKeyboardOn = () => {
    this.setState({ isKeyboardOpen: true });
  };
  
  setKeyboardOff = () => {
    this.setState({ isKeyboardOpen: false });
  }

  delInstrucao = async (indice) => {
    let instrucoes = this.state.instrucoes.slice(); // Criando uma cópia do array
    instrucoes.splice(indice, 1);

    // Reindexar os IDs
    let instrucoesReindexado = instrucoes

    await this.setState({ instrucoes : instrucoesReindexado })

    // Tentar arrumar essa parte, preciso resetar os id's para exibir o # correto 
    // se não der certo, mantenho o array normal e tento outra solucao na proxima aba

    this.indexaarray(instrucoesReindexado)

  }

  indexaarray = async (instrucoesReindexado) => {

    let num = 0;
    instrucoesReindexado = instrucoesReindexado.map((instrucao, index) => {
      num++;
      return { cont: num - 1, id: instrucao.id, valor: instrucao.valor };
    });

    await this.setState({ instrucoes : instrucoesReindexado })

  }

  salvar = () => {
  
    db.transaction((tx) => {

      const ingredientes = this.props.route.params.ingredienteArray
      const instrucoes = this.state.instrucoes

      tx.executeSql(
        'INSERT INTO RECEITAS (NOME, CATEGORIA, DATA, IMAGEM) VALUES (?, ?, datetime(\'now\'), ?)',
        [this.props.route.params.nomeReceita, this.props.route.params.categoria.id, this.state.image],
        (tx, results) => {
          const receitaId = results.insertId; // Obtém o ID da receita inserida
  
          ingredientes.forEach((ingrediente) => {
            if (ingrediente.valor) {
                tx.executeSql(
                  'INSERT INTO INGREDIENTES (NOME, RECEITA) VALUES (?, ?)',
                  [ingrediente.valor, receitaId],
                  (tx, results) => {
                  },
                  (tx, error) => {
                    console.error('Erro ao inserir ingrediente:', error);
                  }
                )
              }
            })

          instrucoes.forEach((instrucao) => {
            if (instrucao.valor) {
                tx.executeSql(
                  'INSERT INTO INSTRUCOES (NOME, RECEITA) VALUES (?, ?)',
                  [instrucao.valor, receitaId],
                  (tx, results) => {
                  },
                  (tx, error) => {
                    console.error('Erro ao inserir ingrediente:', error);
                  }
                )
              }
            })

        },
        (tx, error) => {
          console.error('Erro ao inserir receita:', error);
        }
      );
    });
  };
  

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

    //console.log(this.state.instrucoes)

    return (

      <SafeAreaView style={styleApp.app}>

          <ScrollView>
        
            <View style={styleApp.appMain}>
              
              { /* Imagem superior */ }

              <TouchableOpacity onPress={() => this.pickImage('galeria')}>

                  <View style={styleApp.imagem}>
                      <Image source={this.state.image ? { uri: this.state.image } : imagem} style={styleApp.image} />
                  </View>

              </TouchableOpacity>

              { /* Escolha dos ingredientes */ }
              <View style={{flex: 1}}>

                <View style={styleApp.input}>
                  <Text style={styleApp.inputDesc}> Digite o </Text>
                  <Text style={[styleApp.inputDesc, {color: '#ECA457'} ]}>modo de preparo </Text>
                </View>

                <View style={{flex: 1}}>
                  {this.state.instrucoes.map((instrucao, index) => (
                    <AddInstrucao
                      key={instrucao.id}
                      cont={instrucao.cont}
                      valor={instrucao.valor}
                      indice={index}
                      funcao={this.setInstrucao}
                      deletar={this.delInstrucao}
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
                onPress={() => this.props.navigation.navigate('Ingrediente', { view: 'Instrucao', 
                                                                             instrucaoArray: this.state.instrucoes, 
                                                                             ingredienteArray: this.props.route.params.ingredienteArray, 
                                                                             id: this.state.id, idIng: this.props.route.params.idIng,
                                                                             nomeReceita: this.props.route.params.nomeReceita,
                                                                             categoria: this.props.route.params.categoria, image: this.state.image } )} >
                <Ionicons name="arrow-back" size={30} color={'white'} />
              </TouchableOpacity>
            )}

            {!this.state.isKeyboardOpen && (
              <TouchableOpacity style={[styleApp.saveButton]}
                activeOpacity={0.7}
                onPress={() =>{
                  this.salvar()
                  this.props.navigation.reset({
                    routes: [{ 
                    name: 'Home',
                    params: {
                      view: 'Instrucao'
                      }
                    }]
                  })
                  }
                }
                >
                <Text style={{color: 'white', fontWeight: 'bold', fontSize: 17}}> Salvar </Text>
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
    width: (Dimensions.get('window').width / 2) * 2,
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

  saveButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 90,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center' ,
    backgroundColor: '#ECA457',
   }

})