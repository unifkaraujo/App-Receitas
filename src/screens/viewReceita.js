import React, {Component} from 'react'
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Dimensions , Image, 
  KeyboardAvoidingView, FlatList, ScrollView, Keyboard } from 'react-native'
import { ListItem, Avatar, Button } from '@rneui/themed'

import Ionicons from 'react-native-vector-icons/Ionicons'
import imagem from '../../assets/imgs/addReceita.png'

/* Conexão com o banco de dados local SQLite */
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({
  name: 'myDatabase.db',
  location: 'default',
});

export default class App extends Component {

  state = {
    receita: this.props.route.params.receita,
    ingredientes: [],
    instrucoes: [],
    showIngredientes: true
  }

  localizarIngredientes = () => {

    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM INGREDIENTES WHERE RECEITA = ?',
        [this.state.receita.id],
        (tx, results) => {
          const len = results.rows.length;

          let ingredientes = []

          for (let i = 0; i < len; i++) {
            const registro = results.rows.item(i);
            ingredientes.push(registro)
          }
        
          this.setState({ ingredientes })
        
        },
        (error) => {
          console.error('Erro ao localizar registros', error);
        }
      )
    })
  }

  localizarInstrucoes = () => {

    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM INSTRUCOES WHERE RECEITA = ?',
        [this.state.receita.id],
        (tx, results) => {
          const len = results.rows.length;

          let instrucoes = []

          for (let i = 0; i < len; i++) {
            const registro = results.rows.item(i);
            instrucoes.push(registro)
          }
        
          this.setState({ instrucoes })
        
        },
        (error) => {
          console.error('Erro ao localizar registros', error);
        }
      )
    })
  }

  getItem = ({ item: ingrediente }) => {
    return (

      <ListItem

       key={ingrediente.id} 
        bottomDivider 
        containerStyle={{ backgroundColor: 'white', borderRadius: 10, borderWidth: 0.1 }}>
          <Avatar 
          source={{uri: 'https://cdn.pixabay.com/photo/2014/12/21/23/34/swiss-cheese-575541_1280.png'}} 
          />  
          
          <ListItem.Content>
              <ListItem.Title>{ingrediente.nome}</ListItem.Title>
              {/*<ListItem.Subtitle>{receita.categoria}</ListItem.Subtitle>*/}
              
          </ListItem.Content>

        </ListItem>
      
    )
  }

  getItemPrep = ({ item: instrucao }) => {
    return (

      <ListItem

       key={instrucao.id} 
        bottomDivider 
        containerStyle={{ backgroundColor: 'white', borderRadius: 10, borderWidth: 0.1}}>

        <Avatar 
          source={{uri: 'https://cdn.pixabay.com/photo/2017/01/31/18/12/comic-characters-2026120_1280.png'}} 
          />  
          
          <ListItem.Content>
              <ListItem.Title>{instrucao.nome}</ListItem.Title>
              {/*<ListItem.Subtitle>{receita.categoria}</ListItem.Subtitle>*/}
              
          </ListItem.Content>

        </ListItem>
      
    )
  }

  setKeyboardOn = () => {
    this.setState({ isKeyboardOpen: true });
  };
  
  setKeyboardOff = () => {
    this.setState({ isKeyboardOpen: false });
  }

  componentDidMount() {

    this.localizarIngredientes()
    this.localizarInstrucoes()

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

        <View style={styleApp.appMain}>
              
            { /* Imagem superior */ }
            <View style={styleApp.imagem}>
                <Image source={imagem} style={styleApp.image}/>
            </View>

            <View style={{alignItems: 'center',}}> 
                <Text style={styleApp.inputDesc}> {this.state.receita.nome} </Text>
            </View>

            <View style={styleApp.flatlist}> 

              <View style={styleApp.menu}>

                <View style={{}}>
                  <TouchableOpacity onPress={() => this.setState({ showIngredientes: true })}>
                      <Text style={styleApp.textmenu}> Ingredientes </Text>
                  </TouchableOpacity>
                </View>

                <View >
                  <TouchableOpacity onPress={() => this.setState({ showIngredientes: false })}>
                      <Text style={styleApp.textmenu}> Modo de preparo </Text>
                  </TouchableOpacity>
                </View>

              </View>

              { /* FlatList dos ingredientes */ }
              {this.state.showIngredientes && (

                <View > 

                  <View style={{flexDirection: 'row'}}>
                    <View style={styleApp.dividerFocusIng} />
                    <View style={styleApp.dividerIng} />
                  </View>
                
                  <FlatList 
                      keyExtractor={(ingrediente) => ingrediente.id.toString()}
                      data={this.state.ingredientes}
                      renderItem={this.getItem}
                      contentContainerStyle={{ paddingVertical: 10 }}
                  />

                </View>

              )}

              { /* FlatList dos ingredientes */ }
              {!this.state.showIngredientes && (

                <View> 
                  
                  <View style={{flexDirection: 'row'}}>
                    <View style={styleApp.dividerPrep} />
                    <View style={styleApp.dividerFocusPrep} />
                  </View>

                  <FlatList 
                      keyExtractor={(instrucao) => instrucao.id.toString()}
                      data={this.state.instrucoes}
                      renderItem={this.getItemPrep}
                      contentContainerStyle={{ paddingVertical: 10 }}
                  />

                </View>

              )}  

            </View>

        </View>
              
        { /*  Botões de navegação */ }
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 }}>
            {!this.state.isKeyboardOpen && (
            <TouchableOpacity style={[styleApp.backButton]}
                activeOpacity={0.7}
                onPress={() => this.props.navigation.goBack()} >
                <Ionicons name="arrow-back" size={30} color={'white'} />
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
    paddingTop: 20
  },

  imagem: {
    alignItems: 'center',
    marginBottom: 10,
  },

  image: {
    height: (Dimensions.get('window').width / 6) * 4,
    resizeMode: 'contain',
  },

  inputDesc: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 25,
    color: '#FF7F27',
  },

  flatlist: {
    flex: 1,
    marginTop: 20,
    backgroundColor: 'white',
  },
  
  menu: {
    flexDirection: 'row',
    paddingVertical: 10,
    justifyContent: 'space-evenly',
  },

  dividerIng: {
    height: 1,
    width: '50%',
    backgroundColor: 'gray',
  },

  dividerPrep: {
    height: 1,
    width: '50%',
    backgroundColor: 'gray',
  },

  dividerFocusIng: {
    height: 1,
    width: '50%',
    backgroundColor: '#ECA457',
  },

  dividerFocusPrep: {
    height: 1,
    width: '50%',
    backgroundColor: '#ECA457',
  },

  textmenu: {
    fontSize: 18,
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


})