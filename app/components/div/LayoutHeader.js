import Link from 'next/link'
export default function LayoutHeader({}){
  return (
    <header>
      <div className="px-3 py-2 text-bg-dark">
        <div className="container">
          <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
            <ul className="nav col-12 col-lg-auto my-2 justify-content-center my-md-0 text-small">
              <li>
                <Link href="/feed" className="nav-link text-white">
                  <img className="bi d-block mx-auto mb-1" src="/images/feed-white-icon.svg" width="48" height="38" alt="My SVG" />
                  Feed
                </Link>
              </li>
              <li>
                <Link href="aircrafts" className="nav-link text-white">
                  <img className="bi d-block mx-auto mb-1" src="/images/aircrafts-white-icon.svg" width="48" height="38" alt="My SVG" />
                  Aeronaves
                </Link>
              </li>
              <li>
                <Link href="airports" className="nav-link text-white">
                  <img className="bi d-block mx-auto mb-1" src="/images/airports-white-icon.svg" width="48" height="38" alt="My SVG" />
                  Aeroportos
                </Link>
              </li>
              <li>
                <Link href="routes" className="nav-link text-white">
                  <img className="bi d-block mx-auto mb-1" src="/images/routes-white-icon.svg" width="48" height="38" alt="My SVG" />
                  Rotas
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  )};
