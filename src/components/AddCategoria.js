import React, { Component } from 'react'
import { View, StyleSheet, TouchableWithoutFeedback, Modal, Text, TouchableOpacity, TextInput, Platform, FlatList } from 'react-native'
import { ListItem, Avatar, Button } from '@rneui/themed'

const initialState = { 
    desc: '', 
    categorias: [] 
}

/* Conexão com o banco de dados local SQLite */
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({
  name: 'myDatabase.db',
  location: 'default',
});

// Componente baseado em classe
export default class AddCategoria extends Component {

    state = {
        ...initialState
    }

    getItem = ({ item: categoria }) => {
        return (
    
           <ListItem
    
                key={categoria.id} 
                onPress={() => {
                const newCategoria = {
                    nome: categoria.nome,
                    id: categoria.id
                    }
                    this.props.onSave && this.props.onSave(newCategoria)
                    this.setState({ desc: '' })
                }} >
                    
                <ListItem.Content>
                <ListItem.Title>{categoria.nome}</ListItem.Title>
                {/*<ListItem.Subtitle>{user.CPF}</ListItem.Subtitle>*/}
                </ListItem.Content>
    
            </ListItem>
          
        )
      }

      save = () => {
  
        db.transaction((tx) => {

          tx.executeSql(
            'INSERT INTO CATEGORIAS (NOME) VALUES (?)',
            [this.state.desc],
            (tx, results) => {
              const categoriaId = results.insertId;
              const newCategoria = {
                nome: this.state.desc,
                id: categoriaId
              }
              this.props.onSave && this.props.onSave(newCategoria)
              this.setState({ desc: '' })
            },
            (tx, error) => {
              console.error('Erro ao inserir categoria:', error);
            }
          )
        })
      }


    localizarCategorias = () => {
        db.transaction((tx) => {
          tx.executeSql(
            'SELECT * FROM CATEGORIAS',
            [],
            (tx, results) => {
              const len = results.rows.length;
              
              const categorias = [] 

              for (let i = 0; i < len; i++) {
                const registro = results.rows.item(i);

                const newCat = {
                    id: registro.id,
                    nome: registro.nome
                }

                categorias.push(newCat)
                
              }

              this.setState({categorias})
            
            },
            (error) => {
              console.error('Erro ao localizar registros', error);
            }
          )
        })
    }

    componentDidUpdate() {
        this.localizarCategorias()
    }

    componentDidMount() {
    }
    
    render() {
        return (
            <Modal transparent={true} visible={this.props.isVisible}
                onRequestClose={this.props.onCancel}>

                <TouchableWithoutFeedback 
                    onPress={this.props.onCancel}>
                    
                    <View style={styles.background}> 
                    </View>

                </TouchableWithoutFeedback>

                <View style={styles.container}> 
                    <Text style={styles.header}> Selecione a categoria </Text>


                    { /* FlatList */ }
                    <FlatList 
                        keyExtractor={(categoria) => categoria.id.toString()}
                        data={this.state.categorias}
                        renderItem={this.getItem}
                        contentContainerStyle={{ paddingVertical: 10 }}
                    />


                    <TextInput style={styles.input} 
                    placeholder='Informe uma nova categoria...'
                    onChangeText={desc => this.setState( { desc: desc } )}
                    value={this.state.desc}
                    />

                    
                    <View style={styles.buttons}> 

                    <TouchableOpacity onPress={this.props.onCancel}> 
                            <Text style={styles.button}> Cancelar </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={this.save}> 
                            <Text style={styles.button}> Salvar </Text>
                        </TouchableOpacity>
                    
                    </View>                 
                </View>

                <TouchableWithoutFeedback 
                    onPress={this.props.onCancel}>
                    
                    <View style={styles.background}> 
                    </View>

                </TouchableWithoutFeedback>

            </Modal>
        )
    }

}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)'
    },
    container: {
        backgroundColor: '#FFF',
        height: '55%'
    },
    header: {
        fontFamily: 'Lato',
        backgroundColor: '#D5ECF0',
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 15,
        fontSize: 18
    },
    input: {
        fontSize: 16,
        height: 60,
        margin: 15,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E3E3E3',
        borderRadius: 6,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    button: {
        margin: 20,
        marginRight: 30,
        color: 'black',
        fontWeight: 'bold',
    },
    date: {
        fontFamily: 'Lato',
        fontSize: 20,
        marginLeft: 15
    }
})