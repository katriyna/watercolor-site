import './about-me.css';

function AboutMe() {

  return (
    <div className="about-me">
      <div className="about-me-container">
        <div className="about-me-avatar">
          <img src="/watercolors/ava.png" alt="avatar" />
        </div>
        <div className="about-me-text">
          <h2>Ekaterina Zaikina</h2>
          <div>
            <p>
              Software developer and artist with the main focus on web development, UX, making things consistent and convenient, every-day-use psychology,{' '}
              sewing and watercolors.
              For me the visual appearance of what I am doing is important.
              The other important thing is a balance between movements and pauses. Pauses are needed to see the next right movement and to just relax.
            </p>
            <p>
              Here are links to my <a href="https://www.linkedin.com/in/zaikina/" target="_blank">linkedin profile</a> and <a href="/main?page=watercolors">collection of paintings</a>.
            </p>
            <p>
              In the past I used to be also interested in non-formal conferences, and was co-organiser of <a href="/nc2014" target="_blank">Nërd|Camp 2014</a>, <a href="/nc2015" target="_blank">Nërd|Camp 2015</a>,{' '}
              <a href="/nc2017-spring" target="_blank">Nërd|Camp 2017 Spring</a>, <a href="/nc2017-outumn" target="_blank">Nërd|Camp 2017 Fall</a>,{' '}<a href="/nc2019" target="_blank">Nërd|Camp 2019</a> as well as{' '}
              the conferences at my work.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutMe;
