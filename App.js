import React from 'react'
import { Constants } from 'expo'
import { Ionicons } from '@expo/vector-icons'
import { StyleSheet, Text, View, TextInput, TouchableOpacity,
         ListView, Keyboard } from 'react-native'

const Header = (props) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity>
        <Ionicons name='ios-checkmark-circle' size={32} color='lightblue' />
      </TouchableOpacity>
      <TextInput value={props.value}
                 onChangeText={props.onChange}
                 placeholder='Hey Dude, what do you want todo?'
                 blurOnSubmt={false} returnKeyType='done'
                 style={styles.input}
                 onSubmitEditing={props.onAddItem}
      />
    </View>
  )
}

const Footer = () => <View />

const Row = ({text, complete}) => {
  return (
    <View>
      <Text>{text}</Text>
    </View>
  )
}

export default class App extends React.Component {
  constructor (props) {
    super(props)
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })
    this.state = { value: '', items: [],
      dataSource: ds.cloneWithRows([])
    }
    this.handleAddItem = this.handleAddItem.bind(this)
    this.setSource = this.setSource.bind(this)
  }

  setSource (items, itemsDataSource, otherState={}) {
    this.setState({
      items,
      dataSource: this.state.dataSource.cloneWithRows(itemsDataSource),
      ...otherState
      })
  }

  handleAddItem () {
    const newItems = [...this.state.items, {
      key: new Date(),
      text: this.state.value,
      complete: false
    }]
    this.setSource(newItems, newItems, { value: '' })
//    this.setState({ items: newItems, value: '' })
  }


  render() {
    return (
      <View style={styles.container}>
        <Header
          value={this.state.value}
          onChange={(value) => this.setState({value})}
          onAddItem={this.handleAddItem}
        />
          <View style={styles.content}>
            <ListView  enableEmptySections
                       onScroll={ () => Keyboard.dismiss() }
                       dataSource={this.state.dataSource}
                       renderRow={ ({ key, ...value }) => {
                         return <Row key={key} {...value} />
                       }}
            />
          </View>
        <Footer />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight + 4,
    padding: 8,
    backgroundColor: '#f5f5f5f5'},
  content: { flex: 1 },
  input: { flex: 1, height: 50, marginLeft: 8 },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-around'
  }
})
