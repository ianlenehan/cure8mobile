import React, { Component } from 'react'
import { Picker, Platform, Text } from 'react-native'
import _ from 'lodash'
import CardSection from './common/cardSection'
import countryNames from '../../helpers/countryNames'
import countryCodes from '../../helpers/countryCodes'

class PhonePicker extends Component {
  state = {
    countryCodes: {},
    codeList: {},
    countries: [],
    callingCode: ''
  }

  componentDidMount() {
    this.setState({ countryName: this.props.countryName })
    this.getPhoneCodes()
  }

  getPhoneCodes() {
    const { countryName } = this.props
    const codeList = _.reduce(countryNames, (result, v, k) => {
      result[v] = countryCodes[k]
      return result
    }, {})
    this.props.onCountryChange(countryName, codeList[countryName])
    this.setState({
      codeList,
      countries: Object.keys(codeList).sort(),
      callingCode: codeList[countryName]
    })
  }

  getItemColour() {
    if (this.props.itemStyle && Platform.OS !== 'android') {
      return this.props.itemStyle.color
    }
    return 'black'
  }

  updateCountry(countryName) {
    const callingCode = this.state.codeList[countryName]
    this.setState({ countryName, callingCode })
    this.props.onCountryChange(countryName, callingCode)
  }

  renderNote() {
    if (this.props.note) {
      return <Text style={styles.note}>{this.props.note}</Text>
    }
  }

  render() {
    const { codeList, countries } = this.state
    const pickerItems = countries.map((country, i) => {
      const code = codeList[country]
      const label = `${country} (+${code})`
      return <Picker.Item key={i} value={country} color={this.getItemColour()} label={label} />
    })

    return (
      <CardSection>
        {this.renderNote()}
        <Picker
          selectedValue={this.state.countryName}
          onValueChange={(country) => this.updateCountry(country)}
          style={this.props.style}
          itemStyle={this.props.itemStyle}
          mode='dropdown'
        >
          { pickerItems }
        </Picker>
      </CardSection>
    )
  }
}

export default PhonePicker

const styles = {
  note: {
    textAlign: 'center',
    fontSize: 10,
    color: 'grey'
  }
}
