export default function DivListNews({news}){
  return (
    <div className="my-3 p-3 bg-body rounded shadow-sm">
      <h6 className="border-bottom pb-2 mb-0">{news.title}</h6>
      {news.items.map((item, index) => (
        <div className="d-flex text-muted pt-3" key={index}>
          <svg className="bd-placeholder-img flex-shrink-0 me-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={item.text} preserveAspectRatio="xMidYMid slice" focusable="false"><title>{item.text}</title><rect width="100%" height="100%" fill={item.color}></rect><text x="50%" y="50%" fill="#007bff" dy=".3em"></text></svg>
          <p className="pb-3 mb-0 small lh-sm border-bottom">
            <strong className="d-block text-gray-dark">{item.title}</strong>{item.text}</p>
        </div>
      ))}
      {news.bottom && (
        <small className="d-block text-end mt-3">
          <a href={news.bottom.link}>{news.bottom.text}</a>
        </small>
      )}
    </div>
)};
