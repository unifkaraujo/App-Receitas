import React, { Component } from 'react'
import { View, StyleSheet, TouchableWithoutFeedback, Modal, Text, TouchableOpacity, TextInput, Platform, FlatList } from 'react-native'
import { ListItem, Avatar, Button } from '@rneui/themed'

const initialState = { 
    desc: '', 
    categorias: [
        {id: 1, descricao: 'Bolo'}, 
        {id: 2, descricao: 'Sobremesa'}, 
        {id: 3, descricao: 'Lanche'},
        {id: 4, descricao: 'Lanche'},
        {id: 5, descricao: 'Lanche'},
        {id: 6, descricao: 'Lanche'},
        {id: 7, descricao: 'Lanche'},
        {id: 8, descricao: 'Lanche'},
        {id: 9, descricao: 'Lanche'},
        {id: 10, descricao: 'Lanche'},
        {id: 11, descricao: 'Lanche'},
        {id: 12, descricao: 'Lanche'},
    ] 
}

// Componente baseado em classe
export default class AddCategoria extends Component {

    state = {
        ...initialState
    }

    getItem = ({ item: categoria }) => {
        return (
    
          <ListItem
    
           key={categoria.id} 
            //onPress={() => this.props.navigation.navigate('Receita', { receita: receita, view: 'Home' } )} 
            >
              
              <ListItem.Content>
                  <ListItem.Title>{categoria.descricao}</ListItem.Title>
                  {/*<ListItem.Subtitle>{user.CPF}</ListItem.Subtitle>*/}
                  
              </ListItem.Content>
    
            </ListItem>
          
        )
      }

    save = () => {

        const newCategoria = {
            desc: this.state.desc,
        }

        this.props.onSave && this.props.onSave(newCategoria)
        this.setState({ ...initialState })

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