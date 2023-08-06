export default function DivListAssets({assets}){
  return (
    <div className="my-3 p-3 bg-body rounded shadow-sm">
      <h6 className="border-bottom pb-2 mb-0">Seus recursos</h6>
      {assets.map((item, index) => (
        <div className="d-flex text-muted pt-3" key={index}>
          <img className="me-3" src={item.icon} alt="" width="48" height="38" />
          <div className="pb-3 mb-0 small lh-sm w-100">
            <div className="d-flex justify-content-between">
              <strong className="text-gray-dark">{item.name}</strong>
            </div>
            <span className="d-block">{item.text}</span>
          </div>
        </div>
      ))}
    </div>
)};
