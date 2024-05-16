import React, {Component} from 'react'
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Dimensions , Image, 
  KeyboardAvoidingView, FlatList, ScrollView, Keyboard, 
  Alert} from 'react-native'
import { ListItem, Avatar, Button } from '@rneui/themed'

import Ionicons from 'react-native-vector-icons/Ionicons'
import imagem from '../../assets/imgs/addReceita.png'
import icon_ingr from '../../assets/imgs/icon_ingr.png'
import icon_prep from '../../assets/imgs/icon_prep.png'

import AddIngrediente from '../components/AddIngredienteEdit'
import AddInstrucao from '../components/AddInstrucaoEdit'

import {launchCamera, launchImageLibrary} from 'react-native-image-picker'

const options = {
  title: 'Selecione uma foto',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
}

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
    ingredientesEdit: [],
    instrucoes: [],
    instrucoesEdit: [],
    showIngredientes: true,
    modEdit: false,
    maiorId: 0,
    maiorIdInst: 0,
    image: this.props.route.params.receita.image
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
            this.salvarImagem(response.assets[0].uri)
        }
    })

  }

  salvarImagem = (image) => {

    db.transaction((tx) => {
      tx.executeSql(
        'update receitas set imagem = ? where id = ?',
        [image, this.state.receita.id],
        (tx, results) => {
        },
        (tx, error) => {
          console.error('Erro ao salvar imagem', error);
        }
      )
    })

  }

  retornaMaiorID = () => {
    return new Promise((resolve, reject) => {
      let id = 0;
  
      db.transaction((tx) => {
        tx.executeSql(
          'select id from ingredientes order by id desc limit 1',
          [],
          (tx, results) => {
            if (results.rows.length > 0) {
              const maiorId = results.rows.item(0).id;
              id = maiorId;
              this.setState({ maiorId: id+1 }, () => resolve(id));
            } else {
              id = 0;
              this.setState({ maiorId: id+1 }, () => resolve(id));
            }
          },
          (tx, error) => {
            console.error('Erro ao localizar id:', error);
            reject(error);
          }
        )
      })
    })
  }
  

  retornaMaiorIDInst = () => {
    return new Promise((resolve, reject) => {
      let id = 0;
  
      db.transaction((tx) => {
        tx.executeSql(
          'select id from instrucoes order by id desc limit 1',
          [],
          (tx, results) => {
            if (results.rows.length > 0) {
              const maiorId = results.rows.item(0).id;
              id = maiorId;
              this.setState({ maiorIdInst: id+1 }, () => resolve(id));
            } else {
              id = 0;
              this.setState({ maiorIdInst: id+1 }, () => resolve(id));
            }
          },
          (tx, error) => {
            console.error('Erro ao localizar id:', error);
            reject(error);
          }
        )
      })
    })
  }

  setIngredientes = (valor, indice) => {
    /* Primeiro crio uma cópia do array e de seus objetos, pra não manter a mesma referencia */
    let ingredientesTemp = this.state.ingredientesEdit.map(obj => ({ ...obj }))
    ingredientesTemp[indice].nome = valor;
    let id = this.state.maiorId
    if (!ingredientesTemp[indice + 1]) {
        id = id + 1
        ingredientesTemp[indice + 1] = { nome: '', id: id, receita: this.state.receita.id };
    }
    this.setState({ ingredientesEdit: ingredientesTemp, maiorId : id });
}


  delIngrediente = async (indice) => {
    let ingredientes = this.state.ingredientesEdit.slice(); // Criando uma cópia do array
    ingredientes.splice(indice, 1);

    this.setState({ ingredientesEdit: ingredientes })

  }

  setInstrucao = (valor, indice) => {
    
    let instrucoes = this.state.instrucoesEdit.map(obj => ({ ...obj }))
    instrucoes[indice].nome = valor
    let id = this.state.maiorIdInst
    if (!instrucoes[indice + 1]) {
      id = id + 1
      instrucoes[indice+1] = {nome: '', id: id, receita: this.state.receita.id}
    }
    this.setState({ instrucoesEdit: instrucoes, maiorIdInst : id })
  }

  delInstrucao = async (indice) => {
    let instrucoes = this.state.instrucoesEdit.slice(); // Criando uma cópia do array
    instrucoes.splice(indice, 1);
    
    this.setState({ instrucoesEdit : instrucoes })

  }

  salvar = async () => {

    await db.transaction((tx) => {

      const ingredientes = this.state.ingredientesEdit.map(obj => ({ ...obj }));
      const instrucoes = this.state.instrucoesEdit.map(obj => ({ ...obj }));

      tx.executeSql(
        'DELETE FROM INGREDIENTES WHERE RECEITA = ?',
            [this.state.receita.id],
            (tx, results) => {

              ingredientes.forEach((ingrediente) => {
                if (ingrediente.nome && ingrediente.nome != '' ) {
                  tx.executeSql(
                    'INSERT INTO INGREDIENTES (ID, NOME, RECEITA) VALUES (?, ?, ?)',
                    [ingrediente.id, ingrediente.nome, ingrediente.receita],
                    (tx, results) => {},
                    (tx, error) => {
                      console.error('Erro ao inserir ingrediente:', error);
                    }
                  )
                }
              })
              
            },
            (tx, error) => {
              console.error('Erro ao deletar ingredientes:', error);
            }
          )

      tx.executeSql(
            'DELETE FROM INSTRUCOES WHERE RECEITA = ?',
                [this.state.receita.id],
                (tx, results) => {
    
                  instrucoes.forEach((instrucao) => {
                    if (instrucao.nome && instrucao.nome != '' ) {
                      tx.executeSql(
                        'INSERT INTO INSTRUCOES (ID, NOME, RECEITA) VALUES (?, ?, ?)',
                        [instrucao.id, instrucao.nome, instrucao.receita],
                        (tx, results) => {},
                        (tx, error) => {
                          console.error('Erro ao inserir instrução:', error);
                        }
                      )
                    }
                  })
                  
                },
                (tx, error) => {
                  console.error('Erro ao deletar instrucoes:', error);
                }
              )
    })

    this.localizarIngredientes()
    this.localizarInstrucoes()
    this.setState({ modEdit: false })

  }

  exibirConfirmacao = () => {
    Alert.alert(
      'Confirmação',
      'Tem certeza que deseja deletar esta receita?',
      [
        { text: 'Cancelar'},
        { text: 'Deletar', onPress: () => this.deletarReceita() }
      ],
      { cancelable: false }
    )
  }

  deletarReceita = () => {

    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM RECEITAS WHERE ID = ?',
        [this.state.receita.id],
        (tx, results) => {

          db.transaction((tx) => {
            tx.executeSql(
              'DELETE FROM INGREDIENTES WHERE RECEITA = ?',
              [this.state.receita.id],
              (tx, results) => {    
                
                db.transaction((tx) => {
                  tx.executeSql(
                    'DELETE FROM INSTRUCOES WHERE RECEITA = ?',
                    [this.state.receita.id],
                    (tx, results) => {   
                      this.props.navigation.reset({
                        routes: [{ 
                        name: 'Home',
                        params: {
                          view: 'ViewReceita'
                        } }]
                      })
                    },
                    (error) => {
                      console.error('Erro ao localizar registros', error);
                    }
                  )
                })
                
              },
              (error) => {
                console.error('Erro ao localizar registros', error);
              }
            )
          })
        },
        (error) => {
          console.error('Erro ao localizar registros', error);
        }
      )
    })
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
          source={icon_ingr} 
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
          source={icon_prep} 
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

            <TouchableOpacity onPress={() => this.pickImage('galeria')}>

              <View style={styleApp.imagem}>
                  <Image source={this.state.image ? { uri: this.state.image } : imagem} style={styleApp.image} />
              </View>

            </TouchableOpacity>

            <View style={styleApp.iconTrash}>
              <TouchableOpacity onPress={() => this.exibirConfirmacao()}>
                  <Ionicons name="trash" size={30} color={'black'} />
              </TouchableOpacity>
            </View>

            <View style={styleApp.iconPencil}>
              <TouchableOpacity onPress={async () => {

                let ingredientesTemp = [...this.state.ingredientes]
                const id = await this.retornaMaiorID()+1
                ingredientesTemp[ingredientesTemp.length] = { nome: '', id: id, receita: this.state.receita.id }

                let instrucoesTemp = [...this.state.instrucoes]
                const idInst = await this.retornaMaiorIDInst()+1
                instrucoesTemp[instrucoesTemp.length] = { nome: '', id: idInst, receita: this.state.receita.id }

                this.setState({ modEdit : !this.state.modEdit, ingredientesEdit: ingredientesTemp, instrucoesEdit: instrucoesTemp }) }
                }>
                  <Ionicons name="pencil" size={25} color={'black'} />
              </TouchableOpacity>
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

              { /* FlatList dos ingredientes em modo edição */ }
              {this.state.showIngredientes && this.state.modEdit && (

                <ScrollView>  

                  <View style={{paddingBottom: 50}}>
                    {this.state.ingredientesEdit.map((ingrediente, index) => (
                      <AddIngrediente
                        key={ingrediente.id}
                        nome={ingrediente.nome}
                        indice={index}
                        funcao={this.setIngredientes}
                        deletar={this.delIngrediente}
                      />
                    ))}
                  </View>

                </ScrollView>

              )}

              { /* FlatList das instruções em modo edição */ }
              {!this.state.showIngredientes && this.state.modEdit && (

                <ScrollView>  

                  <View style={{paddingBottom: 50}}>
                    {this.state.instrucoesEdit.map((instrucao, index) => (
                      <AddInstrucao
                        key={instrucao.id}
                        cont={index}
                        valor={instrucao.nome}
                        indice={index}
                        funcao={this.setInstrucao}
                        deletar={this.delInstrucao}
                      />
                    ))}
                  </View>

                </ScrollView>

              )}

              { /* FlatList dos ingredientes em modo visualização */ }
              {this.state.showIngredientes && !this.state.modEdit && (

                <View > 

                  <View style={{flexDirection: 'row'}}>
                    <View style={styleApp.dividerFocusIng} />
                    <View style={styleApp.dividerIng} />
                  </View>
                
                  <FlatList 
                      keyExtractor={(ingrediente) => ingrediente.id.toString()}
                      data={this.state.ingredientes}
                      renderItem={this.getItem}
                      contentContainerStyle={{ paddingBottom: 50 }}
                  />

                </View>

              )}

              { /* FlatList dos ingredientes */ }
              {!this.state.showIngredientes && !this.state.modEdit && (

                <View> 
                  
                  <View style={{flexDirection: 'row'}}>
                    <View style={styleApp.dividerPrep} />
                    <View style={styleApp.dividerFocusPrep} />
                  </View>

                  <FlatList 
                      keyExtractor={(instrucao) => instrucao.id.toString()}
                      data={this.state.instrucoes}
                      renderItem={this.getItemPrep}
                      contentContainerStyle={{ paddingBottom: 50 }}
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
                onPress={() => {
                  this.props.navigation.reset({
                    routes: [{ 
                    name: 'Home',
                    params: {
                      view: 'ViewReceita'
                    } }]
                  })
                } } >
                <Ionicons name="arrow-back" size={30} color={'white'} />
            </TouchableOpacity>
            )}

            {!this.state.isKeyboardOpen && this.state.modEdit && (
              <TouchableOpacity style={[styleApp.saveButton]}
                activeOpacity={0.7}
                onPress={() => this.salvar() }
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
    paddingTop: 20
  },

  imagem: {
    alignItems: 'center',
    marginBottom: 10,
  },

  iconTrash: {
    position: 'absolute',
    width: 50,
    height: 50,
    right: 30,
    top: 10,
    justifyContent: 'flex-end',
    alignItems: 'flex-end' ,
  },

  iconPencil: {
    position: 'absolute',
    width: 50,
    height: 50,
    right: 35,
    top: 70,
    justifyContent: 'flex-end',
    alignItems: 'flex-end' ,
  },

  image: {
    height: (Dimensions.get('window').width / 6) * 4,
    width: (Dimensions.get('window').width / 2),
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
   },


})