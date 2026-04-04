export function QuizCTA() {
  return (
    <section className="quiz-cta">
      <div className="container">
        <div className="quiz-inner anim-up">
          <div className="quiz-content">
            <span className="quiz-icon">&#x1F9EA;</span>
            <h2>Not Sure Which <em>Scent?</em></h2>
            <p>Answer a few fun questions and our AI will match you with your perfect fragrance. Works better than asking your ex.</p>
            <a href="/quiz" className="btn btn-dark">Take the Quiz &#x2192;</a>
            <small className="quiz-note">Free &#xB7; 60 seconds &#xB7; 97% match rate</small>
          </div>
          <div className="quiz-steps">
            <div className="quiz-step">
              <span className="quiz-step-num">1</span>
              <div>
                <strong>Pick Your Vibe</strong>
                <small>Cozy? Bold? Fresh? Mysterious?</small>
              </div>
            </div>
            <div className="quiz-step">
              <span className="quiz-step-num">2</span>
              <div>
                <strong>Choose Occasions</strong>
                <small>Date night, office, everyday?</small>
              </div>
            </div>
            <div className="quiz-step">
              <span className="quiz-step-num">3</span>
              <div>
                <strong>Get Your Match</strong>
                <small>AI picks your top 3 scents</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
