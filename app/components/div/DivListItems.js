export default function DivListItems({genericItems}){
  return (
    <div className="my-3 p-3 bg-body rounded shadow-sm">
      <h6 className="border-bottom pb-2 mb-0">{genericItems.title}</h6>
      {genericItems.items.map((item, index) => (
        <div className="d-flex text-muted pt-3" key={index}>
          <svg className="bd-placeholder-img flex-shrink-0 me-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={item.text} preserveAspectRatio="xMidYMid slice" focusable="false"><title>{item.text}</title><rect width="100%" height="100%" fill={item.color}></rect><text x="50%" y="50%" fill={item.color} dy=".3em"></text></svg>
          <div className="pb-3 mb-0 small lh-sm border-bottom w-100">
            <div className="d-flex justify-content-between">
              <strong className="text-gray-dark">{item.name}</strong>
              <a href={item.link.url}>{item.link.name}</a>
            </div>
            <span className="d-block">{item.text}</span>
          </div>
        </div>
      ))}
      {genericItems.bottom && (
        <small className="d-block text-end mt-3">
          <a href={genericItems.bottom.link}>{genericItems.bottom.text}</a>
        </small>
      )}
    </div>
)};
