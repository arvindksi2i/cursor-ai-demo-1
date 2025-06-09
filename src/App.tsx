import { Button } from 'primereact/button'
import { useEffect, useState } from 'react'
import 'primereact/resources/themes/lara-dark-indigo/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import './styles/theme.css'
import Weather from './components/Weather'
import Scribble from './components/Scribble'
import Games from './components/Games'
import Snake from './components/Snake'
import TicTacToe from './components/TicTacToe'

function App() {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className={`app ${theme}`}>
      <header>
        <nav>
          <div className="logo">LOGO</div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <Button 
              icon={theme === 'dark' ? 'pi pi-sun' : 'pi pi-moon'} 
              onClick={toggleTheme}
              className="p-button-rounded p-button-text theme-toggle"
              aria-label="Toggle theme"
            />
          </div>
        </nav>
      </header>

      <main>
        <section className="hero">
          <h1>Welcome to Our Platform</h1>
          <p>Experience the next generation of digital solutions</p>
          <div className="cta-buttons">
            <Button 
              label="Get Started" 
              className="p-button-danger p-button-lg"
              style={{ padding: '1rem 2rem' }}
            />
            <Button 
              label="Learn More" 
              className="p-button-outlined p-button-danger p-button-lg"
              style={{ padding: '1rem 2rem' }}
            />
          </div>
        </section>

        <section id="features" className="features">
          <h2>Key Features</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <i className="pi pi-shield"></i>
              <h3>Secure</h3>
              <p>Enterprise-grade security for your data</p>
            </div>
            <div className="feature-card">
              <i className="pi pi-bolt"></i>
              <h3>Fast</h3>
              <p>Lightning-fast performance</p>
            </div>
            <div className="feature-card">
              <i className="pi pi-users"></i>
              <h3>Collaborative</h3>
              <p>Built for teams of all sizes</p>
            </div>
          </div>
        </section>

        <section id="about" className="about">
          <div className="about-content">
            <h2>About Us</h2>
            <div className="about-grid">
              <div className="about-text">
                <h3>Our Story</h3>
                <p>We are passionate about creating innovative solutions that help businesses thrive in the digital age. Our team of experts is dedicated to delivering exceptional results and outstanding customer service.</p>
                <h3>Our Mission</h3>
                <p>To empower organizations with cutting-edge technology solutions that drive growth and success in an ever-evolving digital landscape.</p>
              </div>
              <div className="about-stats">
                <div className="stat-card">
                  <h4>5+ Years</h4>
                  <p>Industry Experience</p>
                </div>
                <div className="stat-card">
                  <h4>100+</h4>
                  <p>Happy Clients</p>
                </div>
                <div className="stat-card">
                  <h4>24/7</h4>
                  <p>Support</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="contact">
          <div className="contact-content">
            <h2>Get in Touch</h2>
            <div className="contact-grid">
              <div className="contact-info">
                <div className="contact-item">
                  <i className="pi pi-envelope"></i>
                  <div>
                    <h3>Email</h3>
                    <p>info@company.com</p>
                  </div>
                </div>
                <div className="contact-item">
                  <i className="pi pi-phone"></i>
                  <div>
                    <h3>Phone</h3>
                    <p>+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="contact-item">
                  <i className="pi pi-map-marker"></i>
      <div>
                    <h3>Location</h3>
                    <p>123 Business Street<br />New York, NY 10001</p>
                  </div>
                </div>
              </div>
              <div className="contact-social">
                <h3>Follow Us</h3>
                <div className="social-links">
                  <Button icon="pi pi-facebook" className="p-button-rounded p-button-text" />
                  <Button icon="pi pi-twitter" className="p-button-rounded p-button-text" />
                  <Button icon="pi pi-linkedin" className="p-button-rounded p-button-text" />
                  <Button icon="pi pi-github" className="p-button-rounded p-button-text" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="interactive-section">
          <div className="interactive-content">
            <h2>Weather & Notes</h2>
            <div className="interactive-grid">
              <div className="weather-container">
                <h3>Local Weather</h3>
                <Weather />
              </div>
              <div className="scribble-wrapper">
                <h3>Scribble Notes</h3>
                <Scribble />
              </div>
              <div className="snake-wrapper">
                <h3>Play Snake Game</h3>
                <Snake />
              </div>
              <div className="tic-tac-toe-wrapper">
                <h3>Play Tic Tac Toe</h3>
                <TicTacToe />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-content">
          <div className="footer-grid">
            <div className="footer-section">
              <h4>Company</h4>
              <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Resources</h4>
              <ul>
                <li><a href="#">Documentation</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Support</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Your Company. All rights reserved.</p>
          </div>
      </div>
      </footer>
      </div>
  )
}

export default App
