export default function Footer() {
    return (
      <footer className="bg-primary text-background mt-12 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>&copy; 2024 Virtual 5ch. All rights reserved.</p>
            </div>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <a href="/" className="hover:text-accent transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-accent transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-accent transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </footer>
    );
  }