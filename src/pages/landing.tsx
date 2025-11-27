import Navbar from '../components/Navbar'
import HeroHeader from '../components/HeroHeader'
import Guide from '../components/Guide'
import Footer from '../components/Footer'

function Landing() {

  return (
    <>
      <section>
        <Navbar />
        <div>
          <HeroHeader />
        </div>
      </section>

      <section>
        <Guide />
      </section>

      <section>
        <Footer />
      </section>
    </>
  )
}

export default Landing
