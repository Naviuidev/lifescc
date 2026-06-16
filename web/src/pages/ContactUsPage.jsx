import { useId, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import SupportModal from '../components/SupportModal.jsx'
import ContactBranchesMap from '../components/ContactBranchesMap.jsx'
import ContactUsFormCard from '../components/ContactUsFormCard.jsx'
import './HomePage.css'
import './ContactUsPage.css'

export default function ContactUsPage() {
  const formId = useId()
  const [supportOpen, setSupportOpen] = useState(false)

  return (
    <div className="home-page">
      <Navbar />
      <SupportModal open={supportOpen} onClose={() => setSupportOpen(false)} />
      <div className="contact-us-page-wrap">
      <main className="page-main contact-us-page">
        <div className="contact-us-page__shell">
          <div className="contact-us-page__grid">
            <section className="contact-us-page__info" aria-labelledby={`${formId}-heading`}>
              <h1 id={`${formId}-heading`} className="contact-us-page__title">
                Contact Us
              </h1>
              <p className="contact-us-page__intro">
                Email, call, or complete the form to learn how Lifescc can help with your hair, skin, and weight care
                goals.
              </p>
              <div className="contact-us-page__direct">
                <p className="contact-us-page__direct-row">
                  <span className="contact-us-page__direct-label">Email:</span>{' '}
                  <a className="contact-us-page__direct-link" href="mailto:feedback@lifescc.com">
                    feedback@lifescc.com
                  </a>
                </p>
                <p className="contact-us-page__direct-row">
                  <span className="contact-us-page__direct-label">Phone:</span>{' '}
                  <a className="contact-us-page__direct-link" href="tel:+919533445566">
                    +91 9533 44 55 66
                  </a>
                </p>
                <p className="contact-us-page__direct-row">
                  <span className="contact-us-page__direct-label">Phone:</span>{' '}
                  <a className="contact-us-page__direct-link" href="tel:+917331144606">
                    +91 7331 14 46 06
                  </a>
                </p>
                <p className="contact-us-page__direct-row">
                  <span className="contact-us-page__direct-label">Phone:</span>{' '}
                  <a className="contact-us-page__direct-link" href="tel:+917331144607">
                    +91 7331 14 46 07
                  </a>
                </p>
                <button
                  type="button"
                  className="contact-us-page__support-btn contact-us-page__direct-link--underline"
                  onClick={() => setSupportOpen(true)}
                >
                  Customer Support
                </button>
              </div>

              <div className="contact-us-page__columns">
                <div>
                  <h2 className="contact-us-page__col-title">Customer Support</h2>
                  <p className="contact-us-page__col-text">
                    Our support team is available around the clock to address any concerns or queries you may have.
                  </p>
                </div>
                <div>
                  <h2 className="contact-us-page__col-title">Feedback and Suggestions</h2>
                  <p className="contact-us-page__col-text">
                    We value your feedback and are continuously working to improve our services. Your input helps us
                    serve you better.
                  </p>
                </div>
                <div>
                  <h2 className="contact-us-page__col-title">Media Inquiries</h2>
                  <p className="contact-us-page__col-text">
                    For media-related questions or press inquiries, please contact us at media@lifescc.com.
                  </p>
                </div>
              </div>
            </section>

            <ContactUsFormCard />
          </div>

          <ContactBranchesMap />
        </div>
      </main>
      <SiteFooter />
      </div>
    </div>
  )
}
