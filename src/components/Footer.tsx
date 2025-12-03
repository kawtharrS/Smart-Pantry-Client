const footerLinks = ["About us", "Contact", "Jobs", "Press kit"];

const Footer = () => (
  <footer className="bg-neutral-800 w-full py-8 px-4 text-white">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-center text-center gap-5">
      <div>
        <h6 className="font-black text-2xl">Company</h6>
        <div className="flex flex-col gap-2 font-black">
          {footerLinks.map((link) => (
            <a key={link} href="#" className="!text-white">
              {link}
            </a>
          ))}
        </div>
      </div>
    </div>
    <div className="text-center mt-5 text-sm opacity-80">
      © 2025 Smart Pantry. All rights reserved.
    </div>
  </footer>
);

export default Footer;
