import * as Babel from 'babel-standalone'

// use require() to preserve variable names,
// eval() needs to reference them
const _ = require('lodash')
const React = require('react')
const { Component } = React
const ReactDOM = require('react-dom')

/* eslint-disable no-unused-vars */
const faker = require('faker')

// put all components in scope so examples can use them
import * as stardust from 'stardust'
const {
  // Addons
  Confirm, Textarea,
  // Collections
  Form, Grid, Menu, Message, Table,
  // Elements
  Button, Buttons, Container, Divider, Header, Icon, Image, Input, Label, List, Segment, Segments,
  // Modules
  Checkbox, Progress, Modal, Dropdown,
  // Views
  Item, Statistic,
} = stardust
/* eslint-enable no-unused-vars */

import docgenInfo from '../docgenInfo.json'
import babelConfig from '../../../.babelrc'

import ace from 'brace'
import 'brace/ext/language_tools'
import 'brace/mode/jsx'
import 'brace/theme/tomorrow'
import AceEditor from 'react-ace'

// Set up custom completers by using a ace extension
// https://github.com/thlorenz/brace/issues/19
const languageTools = ace.acequire('ace/ext/language_tools')

const stardustCompleter = {
  getCompletions(editor, session, pos, prefix, callback) {
    const componentNames = []
    _.each(stardust, ({ _meta }, name) => {
      if (_meta.parent) return              // exclude sub-components
      componentNames.push({                 // completion object
        caption: name,
        value: name,
        meta: 'Stardust',
      })
    })
    callback(null, componentNames)
  },
}

const lodashCompleter = {
  getCompletions(editor, session, pos, prefix, callback) {
    callback(null, _.map(_, (val, key) => ({
      caption: key,
      value: key,
      meta: 'lodash',
    })))
  },
}

languageTools.addCompleter(stardustCompleter)
languageTools.addCompleter(lodashCompleter)

import initialExample from '!raw!src/elements/Label/Default-example'
// import initialExample from '!raw!src/elements/Label/className-example'

export default class NewDoc extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      sourceCode: initialExample,
    }
  }

  componentDidMount() {
    this.handleChangeCode(this.state.sourceCode)
  }

  handleChangeCode = (newValue) => {
    let error
    const IIFE = `(function() {\n${newValue}\nreturn Example\n}())`
    try {
      const transformed = Babel.transform(IIFE, babelConfig).code
      const Example = eval(transformed) // eslint-disable-line

      // handle examples as class/function or expression
      const instance = _.isFunction(Example) ? <Example /> : Example
      ReactDOM.render(instance, document.getElementById('example'))
    } catch (err) {
      error = err.message
    }
    this.setState({
      error,
      sourceCode: newValue,
    })
  }

  renderError() {
    const { error } = this.state
    if (!error) return null

    return <Message className='bottom attached error'>{error}</Message>
  }

  renderEditor() {
    const { sourceCode } = this.state
    return (
      <AceEditor
        mode='jsx'
        theme='tomorrow'
        width='100%'
        value={sourceCode}
        onChange={this.handleChangeCode}
        name='ace-editor'
        enableBasicAutocompletion
        enableLiveAutocompletion
        tabSize={2}
        useSoftTabs
        editorProps={{ $blockScrolling: Infinity }}
      />
    )
  }

  render() {
    const { component } = this.props
    const componentInfo = _.find(docgenInfo, (val, key) => key.includes(`/${component}.js`)) || {}

    const propDescriptions = _.map(componentInfo.props, (propDef, propName) => (
      <Grid.Column key={propName}>
        <Label horizontal><code>{propName}</code></Label>
        <p>{propDef.docBlock.description}</p>
      </Grid.Column>
    ))

    return (
      <Grid className='padded'>
        <Grid.Row className='one column'>
          <Grid.Column>
            <Header.H1 className=''>
              Label
              <Header.Subheader>
                {componentInfo.docBlock.description}
              </Header.Subheader>
            </Header.H1>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row className='vertically divided two column'>
          <Grid.Column>
            {this.renderEditor()}
            <Segment className='bottom attached blue' icon='blue info'>
              <b>Globals:</b>{' '}
              Stardust components plus{' '}
              <Label horizontal><code>React</code></Label>
              lodash <Label horizontal><code>_</code></Label>
              and <Label horizontal><code>faker</code></Label>
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <div id='example' />
            {this.renderError()}
          </Grid.Column>
        </Grid.Row>
        <Divider />
        <Grid.Row className='one column'>
          <Grid.Column>
            <Grid>
              <Grid.Column>
                <Header.H3>Props</Header.H3>
                <Grid className='three column'>
                  {propDescriptions}
                </Grid>
              </Grid.Column>
            </Grid>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
