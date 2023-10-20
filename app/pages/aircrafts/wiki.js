import { useSession } from 'next-auth/react';
import LayoutUnauthenticated from '../../components/LayoutUnauthenticated';
import BaseLayout from '../../components/BaseLayout';

const navbarSubItems = [
  { name: 'Todas', url: '/aircrafts' },
  { name: 'Minha frota', url: '/aircrafts?filter=mine' },
  { name: 'Concorrentes', url: '/aircrafts?filter=rivals' },
  { name: 'Loja', url: '/aircrafts?filter=sale' },
  { name: 'Wiki', url: '/aircrafts/wiki' }
];

export default function wiki() {
  const { data: session } = useSession();

  if (!session) {
    return <LayoutUnauthenticated />;
  }
  
  return (
    <BaseLayout subtitle="Aeronaves" navbarSubItems={navbarSubItems} icon="/images/aircrafts-color-icon.svg" color={sessionStorage.getItem('color')} description="Gerencie as aeronaves aqui!">
      <p className="text-justify">Sua companhia precisa de aviões para iniciar novas rotas. Existem 5 tipos (tamanhos) de aviões:</p>
      <table className="table table-sm">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Passageiros</th>
            <th scope="col">Range (KM)</th>
            <th scope="col">Preço base</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">J</th>
            <td>50</td>
            <td>1.000</td>
            <td>$ 25M</td>
          </tr>
          <tr>
            <th scope="row">P</th>
            <td>100</td>
            <td>3.000</td>
            <td>$ 50M</td>
          </tr>
          <tr>
            <th scope="row">M</th>
            <td>150</td>
            <td>6.000</td>
            <td>$ 100M</td>
          </tr>
          <tr>
            <th scope="row">G</th>
            <td>200</td>
            <td>9.000</td>
            <td>$ 150M</td>
          </tr>
          <tr>
            <th scope="row">X</th>
            <td>250</td>
            <td>12.000</td>
            <td>$ 200M</td>
          </tr>
        </tbody>
      </table>
      <p>Informações adicionais:</p>
      <ul>
        <li>Na matrícula (nome) da aeronave, a primeira letra indica o tipo, os quatro números a seguir são aleatórios.</li>
        <li>O preço de uma aviação nova, na fabrica, pode variar em 5% para mais ou para menos em relação ao preço base.</li>
        <li>Ao comprar um avião, ele automaticamente perde aproximadamente 15% de seu valor.</li>
        <li>Cada avião pode atender a uma única rota.</li>
        <li>Você não consegue abrir uma rota cuja distância (entre os dois aeroportos) seja superior ao alcance da aeronave.</li>
        <li>Você pode vender uma aeronave desde que ela não esteja cumprindo nenhuma rota.</li>
      </ul>
    </BaseLayout>
  );
}
