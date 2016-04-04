class Example extends React.Component {
  state = {}

  componentDidMount() {
    const classes = document
      .getElementById('my-label')
      .getAttribute('class')

    this.setState({ classes })
  }

  render() {
    return (
      <div>
        <Label id='my-label' className='hello'>Default</Label>
        <b>className</b>: <code>{this.state.classes}</code>
      </div>
    )
  }
}
