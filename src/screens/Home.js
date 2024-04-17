import React, {Component} from 'react'
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Dimensions , Image, FlatList } from 'react-native'
import { ListItem, Avatar, Button } from '@rneui/themed'

import Ionicons from 'react-native-vector-icons/Ionicons'
import icone from '../../assets/imgs/logo.png'


export default class App extends Component {

  state = {
    inputReceita: '',
    receitas: [],
    receitasFilter: [{id: 0, nome: 'Bolo de Banana', data: '2024-04-17'}, {id: 1, nome: 'Pudim', data: '2024-04-20'}]
  }

  getItem = ({ item: receita }) => {
    return (

      <ListItem

       key={receita.id} 
        bottomDivider 
        //onPress={() => this.props.navigation.navigate('LocCadastro', { user: user, view: 'ListaCad' } )} 
        containerStyle={{ backgroundColor: 'white', borderRadius: 10, borderWidth: 0.1 }}>
          <Avatar source={{uri: 'https://cdn.pixabay.com/photo/2024/03/05/18/43/taco-8615083_1280.png'}} />  
          
          <ListItem.Content>
              <ListItem.Title>{receita.nome}</ListItem.Title>
              {/*<ListItem.Subtitle>{user.CPF}</ListItem.Subtitle>*/}
              
          </ListItem.Content>

        </ListItem>
      
    )
  }

  render() {

    return (

      <SafeAreaView style={styleApp.app}>

        <View style={styleApp.appMain}>

          { /* Header */ }
          <View style={styleApp.header}>

            <Image source={icone} style={styleApp.image}/>

            <View style={styleApp.pesquisa}>
              <TouchableOpacity>
                <TextInput 
                  placeholder="Buscar Receita..."
                  style={{fontSize: 16}}
                  value={this.state.inputReceita}
                  onChangeText={(inputReceita) => this.setState({ inputReceita })}
                />
              </TouchableOpacity>
              <Ionicons name="search" size={25} style={{paddingTop: 11}} color='black'/> 
              
            </View>

            <TouchableOpacity>
              <Ionicons name="settings" size={30} style={{paddingTop: 9}} color='black'/>
            </TouchableOpacity>

          </View>

          { /* Filtros */ }
          <View style={styleApp.filtros}>
            <Text style={{fontSize: 16}}> 2 receitas </Text>
            <View style={styleApp.filtrosIcon}>

              <TouchableOpacity>
                <Ionicons name="filter" size={30} color='black' style={{paddingRight: 32}}/>
              </TouchableOpacity>

              <TouchableOpacity>
                <Ionicons name="funnel" size={30} color='black' style={{paddingRight: 8}}/>
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
            onPress={() => this.setState( {showAddTask: true} )}>
            <Ionicons name="add" size={35} color={'black'} />
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
    paddingVertical: 20
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
      backgroundColor: 'white',
      //borderColor: '#65A8F0',
      //borderWidth: 1
  }

})