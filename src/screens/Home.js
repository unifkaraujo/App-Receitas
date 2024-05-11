import React, {Component} from 'react'
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, 
  Dimensions , Image, FlatList, Modal, TouchableWithoutFeedback } from 'react-native'
import { ListItem, Avatar, Button } from '@rneui/themed'

import Ionicons from 'react-native-vector-icons/Ionicons'
import icone from '../../assets/imgs/logo.png'
import icon_home from '../../assets/imgs/icon_home.png'

import FilterModal from '../components/FilterModal'

/* Conexão com o banco de dados local SQLite */
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({
  name: 'myDatabase.db',
  location: 'default',
});


export default class App extends Component {

  state = {
    inputReceita: '',
    receitas: [],
    receitasFilter: [],
    ordenacao: 'receitas.data desc',
    ordenacaVisible: false,
    qtdReceitas: 0
  }

  setInputReceita = async (inputReceita) => {
    await this.setState({ inputReceita })
    this.localizarReceitas()
  }

  setReceitas = (receitas) => {
    this.setState({ receitas })
  }

  setOrdenacao = (ordenacao) => {
    this.setState({ ordenacao })
    this.localizarReceitas()
    this.setState({ ordenacaVisible: false })
  }

  setReceitasFilter = (receitasFilter) => {
    this.setState({ receitasFilter })
  }

  getItem = ({ item: receita }) => {
    return (

      <ListItem

       key={receita.id} 
        bottomDivider 
        onPress={() => this.props.navigation.navigate('ViewReceita', { receita: receita, view: 'Home' } )} 
        containerStyle={{ backgroundColor: 'white', borderRadius: 10, borderWidth: 0.1 }}>
          <Avatar source={icon_home} />  
          
          <ListItem.Content>
              <ListItem.Title>{receita.nome}</ListItem.Title>
              <ListItem.Subtitle>{receita.categoria}</ListItem.Subtitle>
              
          </ListItem.Content>

        </ListItem>
      
    )
  }

  /* Funções do Banco de Dados */

  criaTabela = () => {
    db.transaction((tx) => {

      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS RECEITAS (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, data datetime, categoria integer, imagem TEXT)',
        [],
      )

      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS INGREDIENTES (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, receita integer)',
        [],
      )

      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS INSTRUCOES (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, receita integer)',
        [],
      )  
      
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS CATEGORIAS (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT)',
        [],
      ) 

    })
  }

  deletaTabela = () => {
    db.transaction((tx) => {

      tx.executeSql(
        'DROP TABLE RECEITAS',
        [],
      )

      tx.executeSql(
        'DROP TABLE INGREDIENTES',
        [],
      )

      tx.executeSql(
        'DROP TABLE INSTRUCOES',
        [],
      )

      tx.executeSql(
        'DROP TABLE CATEGORIAS',
        [],
      )

    })
  }

  insereRegistro = () => {
    db.transaction((tx) => {

      tx.executeSql(
        'INSERT INTO CATEGORIAS (NOME) VALUES ("Bolo")',
        [],
      )

    })
  }

  logregistros = () => {
    db.transaction((tx) => {

      tx.executeSql(
        'SELECT * FROM RECEITAS',
        [],
        (tx, results) => {
          const len = results.rows.length;
          
          for (let i = 0; i < len; i++) {
            const registro = results.rows.item(i);
            console.log(registro)
          }
        
        },
        (error) => {
          console.error('Erro ao localizar registros', error);
        }
      )
    })
  }

  localizarReceitas = async () => {

    await db.transaction((tx) => {
      tx.executeSql(
        'SELECT RECEITAS.NOME, RECEITAS.ID, RECEITAS.DATA, CATEGORIAS.NOME AS categoria, RECEITAS.IMAGEM FROM RECEITAS LEFT JOIN CATEGORIAS ON CATEGORIAS.ID = RECEITAS.CATEGORIA ORDER BY '+ this.state.ordenacao,
        [],
        (tx, results) => {
          const len = results.rows.length;

          let receitas = []
          let receitasFilter = []

          for (let i = 0; i < len; i++) {
            const registro = results.rows.item(i);

            const novaReceita = {
              id: registro.id,
              nome: registro.nome,
              data: registro.data,
              categoria: registro.categoria,
              image: registro.imagem
            };

            receitas.push(novaReceita);
          }
          this.setReceitas(receitas)
          receitasFilter = receitas.filter(receita => receita.nome.toLowerCase().includes(this.state.inputReceita.toLowerCase()))
          this.setReceitasFilter(receitasFilter)
          var qtdReceitas = receitasFilter.length
          this.setState({ qtdReceitas })
        },
        (error) => {
          console.error('Erro ao localizar registros', error);
        }
      )
    })
  }

  componentDidMount() {
    //this.deletaTabela()
    //this.insereRegistro()
    this.criaTabela()
    this.localizarReceitas()
    //this.logregistros()
  }

  render() {

    return (

      <SafeAreaView style={styleApp.app}>

        <View style={styleApp.appMain}>

        <FilterModal transparent={true} 
            visible={this.state.ordenacaVisible}
            onRequestClose={() => this.setState({ ordenacaVisible: false }) } 
            funcOrdenacao={this.setOrdenacao} 
            />

          { /* Header */ }
          <View style={styleApp.header}>

            <Image source={icone} style={styleApp.image}/>

            <View style={styleApp.pesquisa}>
              <TouchableOpacity >
                <TextInput 
                  placeholder="Buscar Receita..."
                  style={{fontSize: 16}}
                  value={this.state.inputReceita}
                  onChangeText={this.setInputReceita}
                />
              </TouchableOpacity>
              <Ionicons name="search" size={25} color='black'/> 
              
            </View>

            <TouchableOpacity>
              <Ionicons name="settings" size={30} style={{paddingTop: 9}} color='black'/>
            </TouchableOpacity>

          </View>

          { /* Filtros */ }
          <View style={styleApp.filtros}>
            <Text style={{fontSize: 16}}> {this.state.qtdReceitas} {this.state.qtdReceitas == 1 ? 'receita' : 'receitas'} </Text>
            <View style={styleApp.filtrosIcon}>

              <TouchableOpacity onPress={() => this.setState({ ordenacaVisible: true })}>
                <Ionicons name="filter" size={30} color='black' style={{paddingRight: 9}}/>
              </TouchableOpacity>

            </View>
          </View>

          { /* FlatList */ }
          <FlatList 
            keyExtractor={(receita) => receita.id.toString()}
            data={this.state.receitasFilter}
            renderItem={this.getItem}
            contentContainerStyle={{ paddingVertical: 10 }}
          />

          { /*  Botão de Adicionar */ }
          <TouchableOpacity style={[styleApp.addButton]}
            activeOpacity={0.7}
            onPress={() => this.props.navigation.navigate('Receita', { view: 'Home' } )} >
            <Ionicons name="add" size={35} color={'white'} />
          </TouchableOpacity>


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
    paddingTop: 20
  },

  modalApp: {
    //flex: 1,
    //backgroundColor: '#D5ECF0',
  },

  modalAppMain: {
    //flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 20,
    alignItems: 'flex-end'
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },

  pesquisa: {
    width: (Dimensions.get('window').width / 5) * 3 ,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 20,
    fontSize: 13,
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  image: {
    height: 46,
    width: 60,
  },

  filtros: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40
  },

  filtrosIcon: {
    flexDirection: 'row',
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