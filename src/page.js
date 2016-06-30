(function (GlossaryTest, GlossaryList, React) {
  GlossaryTest.Page = React.createClass({

    getInitialState() {
      return {
        checkAnswers: false,
        finished: false,
        page: 0,
        scores: [],
        listAnswered: false
      };
    },

    isLastList() {
      return (this.state.page === Math.floor(this.props.words.length / this.props.numPerList));
    },

    handleCheckAnswers() {
      this.setState({
        checkAnswers: true,
        finished: this.isLastList(),
      });
    },

    handleContinue() {
      this.setState({
        checkAnswers: false,
        page: this.state.page + 1,
        listAnswered: false
      });
    },

    handleFinish() {
      this.setState(this.getInitialState());
      this.props.onFinish(this.state.scores);
    },

    getAnswersHandler(page) {
      var self = this;
      return function (scores) {
        // Keep track of scores
        self.state.scores[page] = scores;

        if (self.isAllAnswered(scores)) {
          // Everything has been answered, update state to make button active
          self.setState({
            listAnswered: true
          });
        }
      };
    },

    isAllAnswered(scores) {
      // Calculate number of inputs that has been answered
      var numAnswered = 0;
      for (var i = 0; i < scores.length; i++) {
        if (scores[i] === 0 || scores[i] === 1) {
          numAnswered += 1;
        }
      }

      // Check against number of inputs in current list
      var numOnLastList = (this.props.words.length % this.props.numPerList);
      if (this.isLastList() && numOnLastList) {
        if (numAnswered !== numOnLastList) {
          return false;
        }
      }
      else if (numAnswered !== this.props.numPerList) {
        return false;
      }

      return true;
    },

    render() {
      // Determine which words to display
      var words = [];
      var start = this.state.page * this.props.numPerList;
      var end = start + this.props.numPerList;
      for (var i = start; i < end; i++) {
        if (this.props.words[i]) {
          words.push(this.props.words[i]);
        }
      }

      // Determine which button to display
      var button;
      if (this.state.checkAnswers) {
        if (this.state.finished) {
          button = (
            <GlossaryTest.Button onPress={this.handleFinish}>{this.props.l10n.finish}</GlossaryTest.Button>
          );
        }
        else {
          button = (
            <GlossaryTest.Button onPress={this.handleContinue}>{this.props.l10n.continue}</GlossaryTest.Button>
          );
        }
      }
      else {
        button = (
          <GlossaryTest.Button disabled={!this.state.listAnswered} onPress={this.handleCheckAnswers}>{this.props.l10n.checkAnswers}</GlossaryTest.Button>
        );
      }

      return (
        <div>
          <GlossaryList.List key={this.state.page} disabled={this.state.checkAnswers} words={words} checkAnswers={this.state.checkAnswers} onAnswer={this.getAnswersHandler(this.state.page)} />
          {button}
        </div>
      );
    }
  });
})(H5P.GlossaryTest, H5P.GlossaryList, H5P.React);
