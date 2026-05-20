import { farmacia } from "@/data/site";
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <Logo light />
            </div>
            <p>
              Web escalable, diseñada con identidad visual propia y preparada para futuras
              integraciones comerciales con Supabase.
            </p>
          </div>

          <div>
            <h4>Secciones</h4>
            <p>
              <a href="#catalogo">Catálogo</a>
              <br />
              <a href="#servicios">Servicios</a>
              <br />
              <a href="#ofertas">Ofertas</a>
            </p>
          </div>

          <div>
            <h4>Atención</h4>
            <p>
              Medicamentos
              <br />
              Dermocosmética
              <br />
              Cuidado familiar
              <br />
              Protección solar
            </p>
          </div>

          <div>
            <h4>Contacto</h4>
            <p>
              {farmacia.telefono}
              <br />
              {farmacia.instagram}
              <br />
              {farmacia.direccion}
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Farmacia Andes. Todos los derechos reservados.</span>
          <span>Diseño web moderno · escalable · responsive</span>
        </div>
      </div>
    </footer>
  );
}
