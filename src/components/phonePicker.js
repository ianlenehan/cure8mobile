import React, { Component } from 'react'
import { Picker, Platform, Text } from 'react-native'
import _ from 'lodash'
import CardSection from './common/cardSection'
import countryNames from '../../helpers/countryNames.json'
import countryCodes from '../../helpers/countryCodes.json'

const styles = {
  note: {
    textAlign: 'center',
    fontSize: 10,
    color: 'grey',
  },
}

class PhonePicker extends Component {
  state = {
    codeList: {},
    countries: [],
  }

  componentDidMount() {
    this.getPhoneCodes()
  }

  getPhoneCodes() {
    const { countryName } = this.props
    const codeList = _.reduce(countryNames, (result, v, k) => {
      const newResult = { ...result }
      newResult[v] = countryCodes[k]
      return newResult
    }, {})
    this.props.onCountryChange(countryName, codeList[countryName])
    this.setState({
      codeList,
      countries: Object.keys(codeList).sort(),
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
    this.props.onCountryChange(countryName, callingCode)
  }

  renderNote() {
    if (this.props.note) {
      return <Text style={styles.note}>{this.props.note}</Text>
    }
    return null
  }

  render() {
    const { codeList, countries } = this.state
    const pickerItems = countries.map((country) => {
      const code = codeList[country]
      const label = `${country} (+${code})`
      return (
        <Picker.Item
          key={country}
          value={country}
          color={this.getItemColour()}
          label={label}
        />
      )
    })

    return (
      <CardSection>
        {this.renderNote()}
        <Picker
          selectedValue={this.props.countryName}
          onValueChange={(country) => this.updateCountry(country)}
          style={this.props.style}
          itemStyle={this.props.itemStyle}
          mode="dropdown"
        >
          { pickerItems }
        </Picker>
      </CardSection>
    )
  }
}

export default PhonePicker
