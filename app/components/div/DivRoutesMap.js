export default function DivRoutesMap({ routes }) {
  return (
    <div>
      {Array.isArray(routes) ? (
        routes.map((item, index) => (
          <>
            <a>{item.src}-{item.dst}</a>
            <ul key={index}>
              <li>src: {item.src}</li>
              <li>dst: {item.dst}</li>
              <li>color: {item.color}</li>
            </ul>
          </>
        ))
      ) : (
        <p>Carregando...</p>
      )}
    </div>
  );
}
