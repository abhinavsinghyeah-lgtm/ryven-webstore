export function QuizCTA() {
  return (
    <section className="quiz-cta">
      <div className="container">
        <div className="quiz-inner anim-up">
          <div className="quiz-content">
            <span className="quiz-icon">&#x1F9EA;</span>
            <h2>Not Sure Which Scent?</h2>
            <p>Take our 60-second quiz and we&apos;ll match you with your perfect fragrance. No guesswork needed.</p>
            <a href="#" className="btn btn-dark">Take the Quiz</a>
            <span className="quiz-note">Free &middot; 60 seconds &middot; 97% match rate</span>
          </div>
          <div className="quiz-steps">
            <div className="quiz-step">
              <span>1</span>
              <div>
                <strong>Pick Your Vibe</strong>
                <p>Bold, fresh, warm, or mysterious?</p>
              </div>
            </div>
            <div className="quiz-step">
              <span>2</span>
              <div>
                <strong>Choose Occasions</strong>
                <p>Where will you wear it most?</p>
              </div>
            </div>
            <div className="quiz-step">
              <span>3</span>
              <div>
                <strong>Get Your Match</strong>
                <p>We pick your top 3 scents.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
