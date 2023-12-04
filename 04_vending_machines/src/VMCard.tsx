import './VMCard.css';

type VMCardProps = {
  vendingMachine: VendingMachine,
  goTo: () => void,
}

export default function VMCard(props: VMCardProps) {
  const { imageSrc, locationText, notes } = props.vendingMachine;

  return (
    <div className='card' onClick={props.goTo}>
      <img src={imageSrc} height='200px' />
      <h2>{locationText}</h2>
      <p>{notes}</p>
    </div>
  )
}
