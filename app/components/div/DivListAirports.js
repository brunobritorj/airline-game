import Link from 'next/link'
import moneyFormat from '../../utils/moneyFormat'

export default function DivListAirports({ airports }) {
  return (
    <div className="my-3 p-3 bg-body rounded shadow-sm">
      {Array.isArray(airports) ? (
        airports.map((item, index) => (
          <div className="d-flex text-muted pt-3" key={index}>
            <svg className="bd-placeholder-img flex-shrink-0 me-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={item.iata} preserveAspectRatio="xMidYMid slice" focusable="false">
              <title>{item.iata}</title><rect width="100%" height="100%" fill={item.color}></rect><text x="50%" y="50%" fill={item.color} dy=".3em"></text>
            </svg>
            <div className="pb-3 mb-0 small lh-sm border-bottom w-100">
              <div className="d-flex justify-content-between">
                <strong className="text-gray-dark">{item.iata} | {item.city} - {item.country}</strong>
                <Link href={`/airports/${item._id}`}>Visitar</Link>
              </div>
              <span className="d-block">
                {item.airline ? (`${item.airline}`):(moneyFormat(item.price))}
              </span>
            </div>
          </div>
        ))
      ) : (
        <p>Carregando...</p>
      )}
    </div>
  );
}
