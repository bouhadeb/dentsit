const Footer = () => {
  return (
    <div>
      <footer className="footer footer-center bg-base-300 text-base-content p-4">
        <aside>
          <p>
            Copyright © {new Date().getFullYear()} - Tous droits réservés par
            Bouhadeb Abdeslame
          </p>
        </aside>
      </footer>
    </div>
  );
};

export default Footer;
