import React from 'react'
import { Constants } from 'expo'
import { Ionicons } from '@expo/vector-icons'
import { StyleSheet, Text, View, TextInput, TouchableOpacity,
         ListView, Keyboard, Switch } from 'react-native'

const Header = (props) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={props.onToggleAllComplete} >
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
    <View style={rstyles.container} >
      <Switch value={complete} />
      <View style={rstyles.textWrap} >
        <Text style={[rstyles.text, complete && rstyles.complete]} >{text}</Text>
      </View>
    </View>
  )
}

const rstyles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  text: { fontSize: 24, color: '#4d4d4d' },
  complete: { textDecorationLine: 'line-through' },
  textWrap: { flex: 1, marginHorizontal: 10 }

})

export default class App extends React.Component {
  constructor (props) {
    super(props)
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })
    this.state = { allComplete: false, value: '', items: [],
      dataSource: ds.cloneWithRows([])
    }
    this.handleAddItem = this.handleAddItem.bind(this)
    this.setSource = this.setSource.bind(this)
    this.handleToggleAllComplete = this.handleToggleAllComplete.bind(this)
  }

  handleToggleAllComplete () {
    const complete = !this.state.allComplete
    const newItems = this.state.items.map(item => ({...item, complete}) )
    this.setSource(newItems, newItems, {allComplete: complete} )
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
          onToggleAllComplete={this.handleToggleAllComplete}
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
